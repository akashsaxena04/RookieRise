const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, searchUsers, toggleSaveJob, getSavedJobs } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../utils/uploadConfig');

router.get('/search', protect, searchUsers);
router.route('/profile')
    // Accept either a profilePicture or a resume
    .put(protect, upload.single('file'), updateUserProfile);

router.route('/profile/:id')
    .get(protect, getUserProfile);

router.post('/:id/save-job', protect, toggleSaveJob);
router.get('/:id/saved-jobs', protect, getSavedJobs);

module.exports = router;
