const Notification = require('../model/Notification');
const asyncWrapper = require('../middleware/asyncWrapper');

// Create a new notification
const createNotification = asyncWrapper(async (req, res) => {
  const { userId, mentorId, message } = req.body;

  try {
    const notification = await Notification.create({
      userId,
      mentorId,
      message,
      date: new Date(),
      unread: true, // Set as unread by default
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Error creating notification' });
  }
});

// Get all notifications for a user
const getNotifications = asyncWrapper(async (req, res) => {
  const userId = req.user.id; // Assuming user ID is stored in req.user

  try {
    const notifications = await Notification.findAll({
      where: { userId },
      order: [['date', 'DESC']],
    });

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// Mark a notification as read
const markAsRead = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.unread = false;
    await notification.save();

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
});

// Delete a notification
const deleteNotification = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await Notification.destroy({ where: { id } });
    res.status(200).json({ message: 'Notification successfully deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Error deleting notification' });
  }
});

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
}; 