const express = require('express');
const router = express.Router();
const { getNotifications, addNotification, markAsRead } = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getNotifications)
    .post(protect, addNotification);

router.put('/:id/read', protect, markAsRead);

module.exports = router;
