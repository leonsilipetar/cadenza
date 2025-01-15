const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const sequelize = require('./config/dbConfig'); // Ensure this is your Sequelize config
const userRoutes = require('./routes/user-routes');
// Import other routes as needed

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Handle preflight requests
app.options('*', cors());

// Routes
app.use('/api/users', userRoutes);
// Add other routes as needed

// Sync database
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

// Serve static files from the React app
const buildPath = path.join(__dirname, '../client/build');
app.use(express.static(buildPath));

// The catch-all handler: for any request that doesn't match the API routes, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


