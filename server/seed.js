const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Job = require('./models/Job');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rookierise';

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding');

        // Clear existing data
        await User.deleteMany({});
        await Job.deleteMany({});
        console.log('Cleared existing data');

        // Create a recruiter
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const recruiter = await User.create({
            name: 'Google Recruiter',
            email: 'recruiter@google.com',
            password: hashedPassword,
            type: 'recruiter',
            company: 'Google',
            location: 'Mountain View, CA',
            bio: 'Hiring the best talent for engineering roles.'
        });

        console.log('Created Recruiter:', recruiter.email);

        // Create jobs
        const jobs = await Job.create([
            {
                recruiterId: recruiter._id,
                title: 'Junior React Developer',
                company: 'Google',
                location: 'Remote',
                description: 'Join our team as a Junior React Developer and help build amazing user interfaces.',
                requirements: ['React', 'JavaScript', 'HTML/CSS'],
                salary: '$80k - $100k',
                type: 'Full-time',
                experience: 'Entry-level'
            },
            {
                recruiterId: recruiter._id,
                title: 'Node.js Backend Engineer',
                company: 'Google',
                location: 'Mountain View, CA',
                description: 'Looking for a backend engineer familiar with Express and MongoDB to build scalable APIs.',
                requirements: ['Node.js', 'Express', 'MongoDB'],
                salary: '$90k - $110k',
                type: 'Full-time',
                experience: '1-3 years'
            }
        ]);

        console.log('Created Jobs:', jobs.length);

        console.log('Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedData();
