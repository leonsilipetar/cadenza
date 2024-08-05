const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/user-routes.js');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const ServerConfig = require('./serverConfig');
require('dotenv').config();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      const allowedOrigins = ['http://localhost:3000', 'https://mai-cadenza.onrender.com'];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

// Handle preflight requests
app.options('*', cors());

app.use(cookieParser());
app.use(express.json());
app.use('/api', router);

// Serve static files from the React app
const buildPath = path.join(__dirname, '../client/build');
app.use(express.static(buildPath));

// The catch-all handler: for any request that doesn't match the API routes, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

const PORT = process.env.PORT || 5000;

mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.r3ypmfa.mongodb.net/`)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database is connected");
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
