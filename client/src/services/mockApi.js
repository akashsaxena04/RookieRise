// Mock API service for RookieRise
// Uses localStorage for data persistence

const STORAGE_KEYS = {
  USERS: 'rookierise_users',
  JOBS: 'rookierise_jobs',
  APPLICATIONS: 'rookierise_applications',
  MESSAGES: 'rookierise_messages',
  CONVERSATIONS: 'rookierise_conversations',
  SAVED_JOBS: 'rookierise_saved_jobs',
  SKILLS: 'rookierise_skills',
  NOTIFICATIONS: 'rookierise_notifications'
};

// Initialize localStorage with mock data
function initializeMockData() {
  // Mock users
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || {
    1: {
      id: 1,
      email: 'john@example.com',
      password: 'password123',
      name: 'John Doe',
      type: 'rookie',
      profilePicture: 'https://via.placeholder.com/150',
      bio: 'Passionate developer eager to learn',
      location: 'San Francisco, CA',
      skills: ['JavaScript', 'React', 'CSS'],
      experience: 'Fresh Graduate',
      resume: null,
      createdAt: new Date('2024-01-15').toISOString()
    },
    2: {
      id: 2,
      email: 'recruiter@tech.com',
      password: 'password123',
      name: 'Sarah Johnson',
      type: 'recruiter',
      profilePicture: 'https://via.placeholder.com/150',
      company: 'TechCorp Inc',
      bio: 'Recruiting top talent for innovative projects',
      location: 'San Francisco, CA',
      createdAt: new Date('2023-06-10').toISOString()
    },
    3: {
      id: 3,
      email: 'jane@example.com',
      password: 'password123',
      name: 'Jane Smith',
      type: 'rookie',
      profilePicture: 'https://via.placeholder.com/150',
      bio: 'Aspiring full-stack developer',
      location: 'New York, NY',
      skills: ['Python', 'Django', 'PostgreSQL'],
      experience: '1 Year',
      resume: null,
      createdAt: new Date('2024-02-01').toISOString()
    }
  };

  // Mock jobs
  const jobs = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOBS)) || {
    1: {
      id: 1,
      recruiterId: 2,
      title: 'Junior React Developer',
      company: 'TechCorp Inc',
      location: 'San Francisco, CA',
      description: 'We are looking for a passionate junior developer to join our team.',
      requirements: ['React', 'JavaScript', 'CSS', 'Git'],
      salary: '$60,000 - $80,000',
      type: 'Full-time',
      experience: 'Entry-level',
      postedDate: new Date('2024-03-10').toISOString(),
      status: 'open'
    },
    2: {
      id: 2,
      recruiterId: 2,
      title: 'Frontend Developer Intern',
      company: 'TechCorp Inc',
      location: 'Remote',
      description: 'Internship opportunity to work on modern web applications.',
      requirements: ['HTML', 'CSS', 'JavaScript', 'React'],
      salary: '$2,000/month',
      type: 'Internship',
      experience: 'Entry-level',
      postedDate: new Date('2024-03-08').toISOString(),
      status: 'open'
    },
    3: {
      id: 3,
      recruiterId: 2,
      title: 'Backend Developer',
      company: 'TechCorp Inc',
      location: 'New York, NY',
      description: 'Join our backend team to build scalable APIs.',
      requirements: ['Node.js', 'Express', 'MongoDB', 'REST API'],
      salary: '$70,000 - $90,000',
      type: 'Full-time',
      experience: '1-2 Years',
      postedDate: new Date('2024-03-05').toISOString(),
      status: 'open'
    }
  };

  // Mock applications
  const applications = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) || {
    1: {
      id: 1,
      rookieId: 1,
      jobId: 1,
      recruiterId: 2,
      status: 'applied',
      appliedDate: new Date('2024-03-11').toISOString(),
      coverletter: 'I am very interested in this position...'
    },
    2: {
      id: 2,
      rookieId: 3,
      jobId: 2,
      recruiterId: 2,
      status: 'shortlisted',
      appliedDate: new Date('2024-03-09').toISOString(),
      coverletter: 'Excited about this internship opportunity...'
    }
  };

  // Mock conversations and messages
  const conversations = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) || {
    1: {
      id: 1,
      participants: [1, 2],
      createdAt: new Date('2024-03-11').toISOString(),
      lastMessage: 'Thanks for applying!'
    }
  };

  const messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES)) || {
    1: [
      {
        id: 1,
        conversationId: 1,
        senderId: 2,
        text: 'Thanks for applying!',
        timestamp: new Date('2024-03-11 10:30').toISOString(),
        read: true
      },
      {
        id: 2,
        conversationId: 1,
        senderId: 1,
        text: 'Thank you for considering my application!',
        timestamp: new Date('2024-03-11 10:45').toISOString(),
        read: true
      }
    ]
  };

  const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) || {
    1: [
      {
        id: 1,
        userId: 1,
        type: 'application_update',
        message: 'Your application to Junior React Developer has been shortlisted',
        read: false,
        createdAt: new Date('2024-03-11').toISOString()
      }
    ]
  };

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));

  return { users, jobs, applications, conversations, messages, notifications };
}

// Simulate async API calls with delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication
export const authAPI = {
  async login(email, password) {
    await delay(500);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || {};
    const user = Object.values(users).find(u => u.email === email && u.password === password);
    if (user) {
      return { success: true, user };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  async register(data) {
    await delay(500);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || {};
    const exists = Object.values(users).find(u => u.email === data.email);
    if (exists) {
      return { success: false, error: 'Email already exists' };
    }
    const newUser = {
      id: Math.max(...Object.keys(users).map(Number), 0) + 1,
      ...data,
      createdAt: new Date().toISOString()
    };
    users[newUser.id] = newUser;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return { success: true, user: newUser };
  }
};

// Jobs
export const jobsAPI = {
  async getJobs(filters = {}) {
    await delay(300);
    let jobs = Object.values(JSON.parse(localStorage.getItem(STORAGE_KEYS.JOBS)) || {});
    
    if (filters.search) {
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.location) {
      jobs = jobs.filter(job => job.location.includes(filters.location));
    }
    if (filters.type) {
      jobs = jobs.filter(job => job.type === filters.type);
    }
    
    return { success: true, jobs };
  },

  async getJobById(jobId) {
    await delay(200);
    const jobs = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOBS)) || {};
    return { success: true, job: jobs[jobId] };
  },

  async createJob(jobData) {
    await delay(300);
    const jobs = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOBS)) || {};
    const newJob = {
      id: Math.max(...Object.keys(jobs).map(Number), 0) + 1,
      ...jobData,
      postedDate: new Date().toISOString(),
      status: 'open'
    };
    jobs[newJob.id] = newJob;
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    return { success: true, job: newJob };
  },

  async updateJob(jobId, updates) {
    await delay(300);
    const jobs = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOBS)) || {};
    if (jobs[jobId]) {
      jobs[jobId] = { ...jobs[jobId], ...updates };
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
      return { success: true, job: jobs[jobId] };
    }
    return { success: false, error: 'Job not found' };
  }
};

// Applications
export const applicationsAPI = {
  async applyToJob(rookieId, jobId, coverletter) {
    await delay(300);
    const applications = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) || {};
    
    const existingApp = Object.values(applications).find(
      app => app.rookieId === rookieId && app.jobId === jobId
    );
    if (existingApp) {
      return { success: false, error: 'Already applied to this job' };
    }

    const newApp = {
      id: Math.max(...Object.keys(applications).map(Number), 0) + 1,
      rookieId,
      jobId,
      recruiterId: 2, // Mock recruiter ID
      status: 'applied',
      appliedDate: new Date().toISOString(),
      coverletter
    };
    
    applications[newApp.id] = newApp;
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    return { success: true, application: newApp };
  },

  async getApplications(filters = {}) {
    await delay(300);
    let applications = Object.values(JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) || {});
    
    if (filters.rookieId) {
      applications = applications.filter(app => app.rookieId === filters.rookieId);
    }
    if (filters.recruiterId) {
      applications = applications.filter(app => app.recruiterId === filters.recruiterId);
    }
    if (filters.status) {
      applications = applications.filter(app => app.status === filters.status);
    }
    
    return { success: true, applications };
  },

  async updateApplicationStatus(applicationId, status) {
    await delay(300);
    const applications = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) || {};
    if (applications[applicationId]) {
      applications[applicationId].status = status;
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
      return { success: true, application: applications[applicationId] };
    }
    return { success: false, error: 'Application not found' };
  }
};

// Messages
export const messagesAPI = {
  async sendMessage(conversationId, senderId, text) {
    await delay(200);
    const messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES)) || {};
    
    if (!messages[conversationId]) {
      messages[conversationId] = [];
    }

    const newMessage = {
      id: messages[conversationId].length + 1,
      conversationId,
      senderId,
      text,
      timestamp: new Date().toISOString(),
      read: false
    };

    messages[conversationId].push(newMessage);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    return { success: true, message: newMessage };
  },

  async getMessages(conversationId) {
    await delay(200);
    const messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES)) || {};
    return { success: true, messages: messages[conversationId] || [] };
  },

  async markAsRead(conversationId) {
    await delay(100);
    const messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES)) || {};
    if (messages[conversationId]) {
      messages[conversationId].forEach(msg => { msg.read = true; });
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    }
    return { success: true };
  }
};

// Conversations
export const conversationsAPI = {
  async getConversations(userId) {
    await delay(200);
    const conversations = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) || {};
    const userConversations = Object.values(conversations).filter(
      conv => conv.participants.includes(userId)
    );
    return { success: true, conversations: userConversations };
  },

  async createConversation(participants) {
    await delay(200);
    const conversations = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) || {};
    
    const newConversation = {
      id: Math.max(...Object.keys(conversations).map(Number), 0) + 1,
      participants,
      createdAt: new Date().toISOString()
    };

    conversations[newConversation.id] = newConversation;
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    return { success: true, conversation: newConversation };
  }
};

// Users
export const usersAPI = {
  async getUserById(userId) {
    await delay(200);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || {};
    return { success: true, user: users[userId] };
  },

  async updateUser(userId, updates) {
    await delay(200);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || {};
    if (users[userId]) {
      users[userId] = { ...users[userId], ...updates };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return { success: true, user: users[userId] };
    }
    return { success: false, error: 'User not found' };
  },

  async searchUsers(query) {
    await delay(300);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || {};
    const results = Object.values(users).filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
    return { success: true, users: results };
  }
};

// Saved Jobs
export const savedJobsAPI = {
  async saveJob(userId, jobId) {
    await delay(200);
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_JOBS)) || {};
    if (!saved[userId]) saved[userId] = [];
    if (!saved[userId].includes(jobId)) {
      saved[userId].push(jobId);
      localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(saved));
    }
    return { success: true };
  },

  async getSavedJobs(userId) {
    await delay(200);
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_JOBS)) || {};
    const jobs = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOBS)) || {};
    const savedJobIds = saved[userId] || [];
    const savedJobs = savedJobIds.map(id => jobs[id]).filter(Boolean);
    return { success: true, jobs: savedJobs };
  },

  async removeSavedJob(userId, jobId) {
    await delay(200);
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_JOBS)) || {};
    if (saved[userId]) {
      saved[userId] = saved[userId].filter(id => id !== jobId);
      localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(saved));
    }
    return { success: true };
  }
};

// Notifications
export const notificationsAPI = {
  async getNotifications(userId) {
    await delay(200);
    const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) || {};
    if (!notifications[userId]) notifications[userId] = [];
    return { success: true, notifications: notifications[userId] };
  },

  async addNotification(userId, notification) {
    await delay(100);
    const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) || {};
    if (!notifications[userId]) notifications[userId] = [];
    
    const newNotif = {
      id: notifications[userId].length + 1,
      userId,
      ...notification,
      createdAt: new Date().toISOString()
    };
    
    notifications[userId].push(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    return { success: true, notification: newNotif };
  },

  async markAsRead(notificationId, userId) {
    await delay(100);
    const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) || {};
    const notif = notifications[userId]?.find(n => n.id === notificationId);
    if (notif) {
      notif.read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }
    return { success: true };
  }
};

// Initialize mock data on first load
if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
  initializeMockData();
}
