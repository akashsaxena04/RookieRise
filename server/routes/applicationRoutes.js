const express = require('express');
const router = express.Router();
const { applyToJob, getApplications, updateApplicationStatus, getRecruiterAnalytics } = require('../controllers/applicationController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .post(protect, applyToJob)
    .get(protect, getApplications);

router.route('/analytics')
    .get(protect, getRecruiterAnalytics);

router.route('/:id/status')
    .put(protect, updateApplicationStatus);

module.exports = router;
