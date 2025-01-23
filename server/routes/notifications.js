const express = require('express');
const router = express.Router();
const { verifyToken } = require('../controllers/user-controller');
const { 
  getNotifications, 
  saveNotificationToken, 
  markNotificationsAsRead 
} = require('../controllers/notification-controller');

router.get('/', verifyToken, getNotifications);
router.post('/token', verifyToken, saveNotificationToken);
router.post('/mark-read', verifyToken, markNotificationsAsRead);

module.exports = router; 