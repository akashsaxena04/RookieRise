const Interview = require('../models/Interview');
const Application = require('../models/Application');

exports.createInterview = async (req, res) => {
    try {
        const { applicationId, date, time, link, notes } = req.body;

        const application = await Application.findById(applicationId);
        if (!application) return res.status(404).json({ success: false, error: 'Application not found' });

        // Update application status
        application.status = 'interview scheduled';
        await application.save();

        const interview = await Interview.create({
            applicationId,
            recruiterId: req.user._id,
            rookieId: application.rookieId,
            date,
            time,
            link,
            notes
        });

        res.status(201).json({ success: true, interview });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getInterviews = async (req, res) => {
    try {
        // Fetch based on whether the user is a rookie or recruiter
        const userType = req.user.type; // Assuming you have this set via auth middleware
        
        let query = {};
        if (userType === 'rookie') {
            query.rookieId = req.user._id;
        } else if (userType === 'recruiter') {
            query.recruiterId = req.user._id;
        }

        const interviews = await Interview.find(query)
            .populate('applicationId')
            .populate('rookieId', 'name email profilePicture')
            .populate('recruiterId', 'name company');

        res.json({ success: true, interviews });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateInterviewStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const interview = await Interview.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!interview) return res.status(404).json({ success: false, error: 'Interview not found' });

        res.json({ success: true, interview });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
