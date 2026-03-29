const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        if (req.file) {
            if (req.file.fieldname === 'profilePicture') {
                 user.profilePicture = req.file.path;
            } else if (req.file.fieldname === 'resume') {
                 user.resume = req.file.path;
            }
        } else {
             user.profilePicture = req.body.profilePicture || user.profilePicture;
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.bio = req.body.bio || user.bio;
        user.location = req.body.location || user.location;

        if (user.type === 'rookie') {
            user.skills = req.body.skills || user.skills;
            user.experience = req.body.experience || user.experience;
            user.videoPitch = req.body.videoPitch !== undefined ? req.body.videoPitch : user.videoPitch;
            user.githubLink = req.body.githubLink !== undefined ? req.body.githubLink : user.githubLink;
            user.linkedinLink = req.body.linkedinLink !== undefined ? req.body.linkedinLink : user.linkedinLink;
            user.portfolio = req.body.portfolio !== undefined ? req.body.portfolio : user.portfolio;
            
            if (req.file && req.file.fieldname === 'resume') {
                 user.resume = req.file.path;
            } else {
                 user.resume = req.body.resume || user.resume;
            }
        } else {
            user.company = req.body.company || user.company;
            user.companyDescription = req.body.companyDescription !== undefined ? req.body.companyDescription : user.companyDescription;
            user.companyCulture = req.body.companyCulture !== undefined ? req.body.companyCulture : user.companyCulture;
            user.perks = req.body.perks !== undefined ? req.body.perks : user.perks;
            user.industry = req.body.industry !== undefined ? req.body.industry : user.industry;
            user.website = req.body.website !== undefined ? req.body.website : user.website;
            user.companySize = req.body.companySize !== undefined ? req.body.companySize : user.companySize;
            // Handle company logo if added later
        }

        if (req.body.password) {
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        await user.save();

        res.json({
            success: true, user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                type: user.type,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json({ success: true, users: [] });

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('-password');

        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.toggleSaveJob = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        const { jobId } = req.body;
        if (!jobId) return res.status(400).json({ success: false, error: 'Job ID required' });
        
        const jobIndex = user.savedJobs.findIndex(id => id.toString() === jobId.toString());
        if (jobIndex > -1) {
            user.savedJobs.splice(jobIndex, 1);
        } else {
            user.savedJobs.push(jobId);
        }
        await user.save();
        res.json({ success: true, savedJobs: user.savedJobs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getSavedJobs = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate({
            path: 'savedJobs',
            populate: { path: 'recruiterId', select: 'company companyLogo' }
        });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        res.json({ success: true, savedJobs: user.savedJobs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
