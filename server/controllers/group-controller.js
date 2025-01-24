const Group = require('../model/Group');
const Message = require('../model/Message');

// Create a new group
const createGroup = async (req, res) => {
    const { name, members } = req.body;
    try {
        const group = new Group({ name, members });
        await group.save();
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: 'Error creating group' });
    }
};

// Get messages for a group
const getGroupMessages = async (req, res) => {
    const { groupId } = req.params;
    try {
        const messages = await Message.find({ groupId }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching group messages' });
    }
};

module.exports = { createGroup, getGroupMessages }; 