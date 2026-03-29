const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['rookie', 'recruiter'], required: true },
  profilePicture: { type: String, default: 'https://via.placeholder.com/150' },
  bio: { type: String },
  location: { type: String },
  
  // Rookie specific
  phone: { type: String },
  skills: { type: [String], default: [] },
  experience: { type: String },
  education: { type: [String], default: [] },
  resume: { type: String },
  githubLink: { type: String },
  linkedinLink: { type: String },
  portfolio: { type: String },
  videoPitch: { type: String }, // NEW
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],

  // Recruiter specific
  company: { type: String },
  companyDescription: { type: String },
  companyCulture: { type: String }, // NEW
  perks: { type: [String], default: [] }, // NEW
  industry: { type: String },
  website: { type: String },
  companySize: { type: String },

  // Password Reset
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
