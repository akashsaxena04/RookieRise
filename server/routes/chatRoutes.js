const express = require('express');
const router = express.Router();
const { getConversations, createConversation, getMessages, sendMessage, markAsRead } = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/conversations')
    .get(protect, getConversations)
    .post(protect, createConversation);

router.route('/messages/:conversationId')
    .get(protect, getMessages)
    .put(protect, markAsRead);

router.post('/messages', protect, sendMessage);

module.exports = router;
