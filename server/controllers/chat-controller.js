const Message = require('../model/Message');

const getMessages = async (req, res) => {
    const { senderId, recipientId } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { senderId, recipientId },
                { senderId: recipientId, recipientId: senderId },
            ],
        }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages' });
    }
};

module.exports = { getMessages }; 