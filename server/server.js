const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const mongoose = require('mongoose');

const router = require('./routes/user-routes.js');
const groupRouter = require('./routes/group-routes.js');

const path = require('path');

const cookieParser = require('cookie-parser');

const cors = require('cors');

const ServerConfig = require('./serverConfig');

require('dotenv').config();
 



const app = express();



app.use(

  cors({

    origin: ['http://localhost:3000', 'https://cadenza.com.hr'],

    credentials: true,

    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

    allowedHeaders: ['Content-Type', 'Authorization'],

    exposedHeaders: ['Set-Cookie']

  })

);





// Handle preflight requests

app.options('*', cors());



app.use(cookieParser());

app.use(express.json());

app.use((req, res, next) => {

  res.header('Access-Control-Allow-Credentials', 'true');

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  next();

});

app.use('/api', (req, res, next) => {

  if (req.path.includes('login') || req.path.includes('signup')) {

    res.cookie('myCookieName', 'value', {

      httpOnly: true,

      secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production

      sameSite: 'lax',  // Changed from 'strict' to 'lax'

      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days

      path: '/',

      domain: process.env.NODE_ENV === 'production' ? '.cadenza.com.hr' : 'localhost'

    });

  }

  next();

}, router);

app.use('/api', groupRouter);




// Serve static files from the React app

const buildPath = path.join(__dirname, '../client/build');

app.use(express.static(buildPath));



// The catch-all handler: for any request that doesn't match the API routes, send back React's index.html file.

app.get('*', (req, res) => {

  res.sendFile(path.join(__dirname, '../client/build/index.html'));

});



const PORT = process.env.PORT || 5000;



mongoose.set('strictQuery', false);

mongoose.connect(`mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.r3ypmfa.mongodb.net/`)

  .then(() => {

    // Create an HTTP server
    const server = http.createServer(app);
    const io = socketIo(server, {
      cors: {
        origin: ['http://localhost:3000', 'https://cadenza.com.hr'],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    // Handle socket connections
    io.on('connection', (socket) => {
        console.log('New client connected');

        // Listen for chat messages
        socket.on('sendMessage', (message) => {
            // Broadcast the message to all clients
            io.emit('receiveMessage', message);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    // Replace app.listen with server.listen
    server.listen(PORT, () => {
        console.log("Database is connected");
        console.log(`Listening on port ${PORT}`);
    });

  })

  .catch((err) => console.log(err));


