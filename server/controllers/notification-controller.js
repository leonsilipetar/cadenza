const Notification = require('../model/Notification'); // Assuming you have a Notification model

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

module.exports = {
  getNotifications,
}; 