const Notification = require('../model/Notification'); // Assuming you have a Notification model
const User = require('../model/User');
const notificationService = require('../services/notification-service');

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user ID from the token
    const notifications = await Notification.find({ userId }).sort({ date: -1 }); // Fetch notifications for the user
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

const saveNotificationToken = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.user.id;

    // Add the token to the user's fcmTokens array if it doesn't exist
    await User.findByIdAndUpdate(
      userId,
      { 
        $addToSet: { fcmTokens: token } // $addToSet only adds if token doesn't exist
      },
      { new: true }
    );

    res.status(200).json({ message: 'Notification token saved successfully' });
  } catch (error) {
    console.error('Error saving notification token:', error);
    res.status(500).json({ message: 'Failed to save notification token' });
  }
};

const sendNotificationToUser = async (req, res) => {
  try {
    const { userId, title, body, data } = req.body;
    
    // Save notification to database
    const notification = await Notification.create({
      userId,
      title,
      body,
      data,
      date: new Date()
    });

    // Send push notification
    await notificationService.sendNotification(userId, {
      title,
      body,
      data
    });

    res.status(200).json({ 
      message: 'Notification sent successfully',
      notification 
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Failed to send notification' });
  }
};

const markNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await Notification.updateMany(
      { userId, unread: true },
      { $set: { unread: false } }
    );

    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ message: 'Failed to mark notifications as read' });
  }
};

module.exports = {
  getNotifications,
  saveNotificationToken,
  sendNotificationToUser,
  markNotificationsAsRead
}; 