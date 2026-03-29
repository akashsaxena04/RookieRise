const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');

exports.applyToJob = async (req, res) => {
    try {
        const { jobId, coverletter, recruiterId } = req.body;

        // Check if already applied
        const existing = await Application.findOne({ rookieId: req.user._id, jobId });
        if (existing) {
            return res.status(400).json({ success: false, error: 'Already applied to this job' });
        }

        const application = await Application.create({
            rookieId: req.user._id,
            jobId,
            recruiterId,
            coverletter
        });

        const jobDoc = await Job.findById(jobId);
        const notification = await Notification.create({
            userId: recruiterId,
            type: 'application_update',
            message: `${req.user.name} pitched themselves for your ${jobDoc?.title || 'Job'} listing.`
        });

        if (req.io) {
            req.io.to(recruiterId.toString()).emit('new_notification', notification);
        }

        res.status(201).json({ success: true, application });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getApplications = async (req, res) => {
    try {
        const { rookieId, recruiterId, status } = req.query;
        let query = {};
        if (rookieId) query.rookieId = rookieId;
        if (recruiterId) query.recruiterId = recruiterId;
        if (status) query.status = status;

        const applications = await Application.find(query)
            .populate('jobId')
            .populate('rookieId', 'name email profilePicture')
            .populate('recruiterId', 'name company');

        res.json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getRecruiterAnalytics = async (req, res) => {
    try {
        const recruiterId = req.user._id;

        const totalJobs = await Job.countDocuments({ recruiterId });
        const applications = await Application.find({ recruiterId }).populate('jobId', 'title');

        const totalApplicants = applications.length;
        const shortlisted = applications.filter(a => a.status === 'shortlisted' || a.status === 'interview scheduled').length;
        const rejected = applications.filter(a => a.status === 'rejected').length;
        const offers = applications.filter(a => a.status === 'offer status' || a.status === 'accepted').length;

        const jobCounts = {};
        applications.forEach(app => {
            if (app.jobId) {
                const title = app.jobId.title;
                jobCounts[title] = (jobCounts[title] || 0) + 1;
            }
        });

        const applicationsByJob = Object.keys(jobCounts).map(title => ({
            title,
            count: jobCounts[title]
        }));

        res.json({
            success: true,
            stats: { totalJobs, totalApplicants, shortlisted, rejected, offers, applicationsByJob }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('jobId').populate('recruiterId');
        if (!application) return res.status(404).json({ success: false, error: 'Not found' });

        const message = status === 'shortlisted' 
            ? `Congratulations! You have been shortlisted for ${application.jobId?.title} by ${application.recruiterId?.company || 'the Employer'}.` 
            : status === 'rejected' 
            ? `Update: Your application for ${application.jobId?.title} was not selected at this time.`
            : `Your application for ${application.jobId?.title} has moved to: ${status}`;

        const notification = await Notification.create({
            userId: application.rookieId,
            type: 'application_update',
            message
        });

        if (req.io) {
            req.io.to(application.rookieId.toString()).emit('new_notification', notification);
        }

        res.json({ success: true, application });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
