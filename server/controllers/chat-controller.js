const Message = require('../model/Message');
const User = require('../model/User');

const getMessages = async (req, res) => {
    try {
        const { recipientId } = req.params;
        const senderId = req.user._id; // Get from authenticated user

        const messages = await Message.find({
            $or: [
                { senderId, recipientId },
                { senderId: recipientId, recipientId: senderId }
            ]
        }).sort({ timestamp: 1 });

        // Update read status for messages sent to the current user
        await Message.updateMany(
            { senderId: recipientId, recipientId: senderId, read: false },
            { $set: { read: true } }
        );

        res.json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
};

const getChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (user.isMentor) {
            // For mentors, return their students
            return res.json(user.students.map(student => ({
                id: student.ucenikId,
                name: `${student.ime} ${student.prezime}`
            })));
        } else if (user.isStudent) {
            // For students, return their mentors
            return res.json(user.mentors.map(mentorId => ({
                id: mentorId,
                // You'll need to fetch mentor details here
                name: "Mentor Name" // This should be fetched from the database
            })));
        }

        res.json([]);
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).json({ message: 'Error fetching chats' });
    }
};

module.exports = { getMessages, getChats }; 