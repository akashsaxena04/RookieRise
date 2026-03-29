const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rookieId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    link: { type: String }, // e.g., Google Meet or Zoom link
    notes: { type: String },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'], default: 'scheduled' }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
