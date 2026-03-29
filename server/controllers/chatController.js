const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

exports.getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ participants: req.user._id })
            .populate('participants', 'name email profilePicture company')
            .sort('-updatedAt');
        res.json({ success: true, conversations });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createConversation = async (req, res) => {
    try {
        const { participants } = req.body;
        // Check if exactly these participants already have a conversation
        const existing = await Conversation.findOne({
            participants: { $all: participants, $size: participants.length }
        });

        if (existing) {
            return res.json({ success: true, conversation: existing });
        }

        const conversation = await Conversation.create({ participants });
        res.status(201).json({ success: true, conversation });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ conversationId: req.params.conversationId })
            .sort('timestamp');
        res.json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { conversationId, text } = req.body;
        const message = await Message.create({
            conversationId,
            senderId: req.user._id,
            text
        });

        const conversation = await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: text
        });

        // Emit to receivers
        if (req.io && conversation) {
            const receivers = conversation.participants.filter(p => p.toString() !== req.user._id.toString());
            receivers.forEach(receiverId => {
                req.io.to(receiverId.toString()).emit('receive_message', message);
            });
        }

        res.status(201).json({ success: true, message });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params;
        await Message.updateMany(
            { conversationId, senderId: { $ne: req.user._id }, read: false },
            { read: true }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
