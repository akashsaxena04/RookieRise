const express = require('express');
const router = express.Router();
const { createInterview, getInterviews, updateInterviewStatus } = require('../controllers/interviewController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .post(protect, createInterview)
    .get(protect, getInterviews);

router.route('/:id/status')
    .put(protect, updateInterviewStatus);

module.exports = router;
