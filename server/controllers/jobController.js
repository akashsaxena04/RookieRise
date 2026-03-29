const Job = require('../models/Job');

exports.getJobs = async (req, res) => {
    try {
        const { search, location, type, experience, salary, skills, sort, page = 1, limit = 10 } = req.query;
        let query = { status: 'open' };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } }
            ];
        }
        if (location) query.location = { $regex: location, $options: 'i' };
        if (type) query.type = type;
        if (experience) query.experience = experience;
        
        // Basic skills matching (if job requirements contain any of the selected skills)
        if (skills) {
            const skillsArray = skills.split(',').map(s => s.trim());
            query.requirements = { $in: skillsArray.map(s => new RegExp(s, 'i')) };
        }

        // Extremely basic salary text match (for MVP)
        if (salary) query.salary = { $regex: salary, $options: 'i' };

        // Sorting
        let sortOption = { postedDate: -1 }; // default latest
        if (sort === 'oldest') sortOption = { postedDate: 1 };
        // Can add more complex sorting logic here later if salary is numeric

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Job.countDocuments(query);

        const jobs = await Job.find(query)
            .populate('recruiterId', 'name company companyDescription companyCulture perks companySize website')
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        let processedJobs = jobs;
        if (req.query.userId && req.query.userId !== 'undefined') {
            const User = require('../models/User');
            const user = await User.findById(req.query.userId);
            if (user && user.type === 'rookie' && user.skills && user.skills.length > 0) {
                const userSkills = user.skills.map(s => s.toLowerCase());
                processedJobs = jobs.map(job => {
                    let matchCount = 0;
                    if (job.requirements && job.requirements.length > 0) {
                        job.requirements.forEach(reqSkill => {
                            if (userSkills.includes(reqSkill.toLowerCase())) matchCount++;
                        });
                        const matchPercentage = Math.round((matchCount / job.requirements.length) * 100);
                        return { ...job.toObject(), matchPercentage };
                    }
                    return { ...job.toObject(), matchPercentage: 0 };
                });
            } else {
                 processedJobs = jobs.map(job => job.toObject());
            }
        }

        res.json({ 
            success: true, 
            jobs: processedJobs, 
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
            } 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('recruiterId', 'name company companyDescription companyCulture perks companySize website');
        if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
        
        let processedJob = job.toObject();
        if (req.query.userId && req.query.userId !== 'undefined') {
            const User = require('../models/User');
            const user = await User.findById(req.query.userId);
            if (user && user.type === 'rookie' && user.skills && user.skills.length > 0) {
                const userSkills = user.skills.map(s => s.toLowerCase());
                let matchCount = 0;
                if (processedJob.requirements && processedJob.requirements.length > 0) {
                    processedJob.requirements.forEach(reqSkill => {
                        if (userSkills.includes(reqSkill.toLowerCase())) matchCount++;
                    });
                    processedJob.matchPercentage = Math.round((matchCount / processedJob.requirements.length) * 100);
                } else {
                    processedJob.matchPercentage = 0;
                }
            }
        }

        res.json({ success: true, job: processedJob });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createJob = async (req, res) => {
    try {
        const job = await Job.create({
            ...req.body,
            recruiterId: req.user._id
        });
        res.status(201).json({ success: true, job });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, error: 'Job not found' });

        // Only the recruiter who created it can update it
        if (job.recruiterId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, job: updatedJob });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, error: 'Job not found' });

        if (job.recruiterId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        await Job.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Job removed' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.saveJob = async (req, res) => {
    try {
        const user = await require('../models/User').findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        if (!user.savedJobs.includes(req.params.id)) {
            user.savedJobs.push(req.params.id);
            await user.save();
        }
        res.json({ success: true, message: 'Job saved successfully', savedJobs: user.savedJobs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.unsaveJob = async (req, res) => {
    try {
        const user = await require('../models/User').findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        user.savedJobs = user.savedJobs.filter(id => id.toString() !== req.params.id.toString());
        await user.save();
        
        res.json({ success: true, message: 'Job unsaved successfully', savedJobs: user.savedJobs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
