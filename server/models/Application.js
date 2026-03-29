const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    rookieId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['applied', 'under review', 'shortlisted', 'interview scheduled', 'rejected', 'hired'], default: 'applied' },
    appliedDate: { type: Date, default: Date.now },
    coverletter: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
