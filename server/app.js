const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const userRoutes = require('./routes/user-routes');

const app = express();

app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['set-cookie']
}));

app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: '__Host-sid',
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24
  },
  rolling: true,
  resave: false,
  saveUninitialized: false
}));

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

app.use(mongoSanitize());

// Use routes
app.use('/api', userRoutes); // This will now handle both user and invoice routes

// Add to your routes setup
const invoiceSettingsRoutes = require('./routes/invoiceSettings');
app.use('/api', invoiceSettingsRoutes);

// ... error handling and other setup

module.exports = app;
  