const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  unread: { type: Boolean, default: true },
});

module.exports = mongoose.model('Notification', notificationSchema);