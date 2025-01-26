const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: { type: String, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    recipientId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Message', messageSchema); 