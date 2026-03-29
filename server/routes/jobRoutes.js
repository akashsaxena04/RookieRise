const express = require('express');
const router = express.Router();
const { getJobs, getJobById, createJob, updateJob, deleteJob, saveJob, unsaveJob } = require('../controllers/jobController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(getJobs)
    .post(protect, createJob);

router.route('/:id')
    .get(getJobById)
    .put(protect, updateJob)
    .delete(protect, deleteJob);

router.route('/:id/save')
    .post(protect, saveJob);

router.route('/:id/unsave')
    .delete(protect, unsaveJob);

module.exports = router;
