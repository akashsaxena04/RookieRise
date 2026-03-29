import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const API = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

API.interceptors.request.use(
    (config) => {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

API.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            if (error.response.status === 401 && window.location.pathname !== '/login') {
                localStorage.removeItem('user');
                window.location.href = '/login';
                toast.error('Session expired. Please login again.');
            } else {
                toast.error(error.response.data.message || error.response.data.error || 'An error occurred');
            }
        } else if (error.request) {
            toast.error('Network Error. Please check your connection.');
        } else {
            toast.error('An unexpected error occurred.');
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: async (email, password) => {
        try {
            const data = await API.post('/auth/login', { email, password });
            return { success: true, user: data };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Login failed' };
        }
    },
    register: async (userData) => {
        try {
            const data = await API.post('/auth/register', userData);
            return { success: true, user: data };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Registration failed' };
        }
    },
    forgotPassword: async (email) => {
        try {
            const data = await API.post('/auth/forgot-password', { email });
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Failed' };
        }
    },
    resetPassword: async (token, password) => {
        try {
            const data = await API.post(`/auth/reset-password/${token}`, { password });
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Failed' };
        }
    }
};

export const jobsAPI = {
    getJobs: async (filters = {}) => {
        try {
            const params = new URLSearchParams(filters).toString();
            const data = await API.get(`/jobs?${params}`);
            return data;
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Failed to fetch jobs' };
        }
    },
    getJobById: async (jobId) => {
        try {
            const data = await API.get(`/jobs/${jobId}`);
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    createJob: async (jobData) => {
        try {
            const data = await API.post('/jobs', jobData);
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    updateJob: async (jobId, updates) => {
        try {
            const data = await API.put(`/jobs/${jobId}`, updates);
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    deleteJob: async (jobId) => {
        try {
            const data = await API.delete(`/jobs/${jobId}`);
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

export const applicationsAPI = {
    applyToJob: async (rookieId, jobId, coverletter, recruiterId) => {
        try {
            const data = await API.post('/applications', { jobId, coverletter, recruiterId });
            return data;
        } catch (error) {
             return { success: false, error: error.response?.data?.error || error.message };
        }
    },
    getApplications: async (filters = {}) => {
        try {
            const params = new URLSearchParams(filters).toString();
            const data = await API.get(`/applications?${params}`);
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    updateApplicationStatus: async (applicationId, status) => {
        try {
            const data = await API.put(`/applications/${applicationId}/status`, { status });
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    getRecruiterAnalytics: async () => {
        try {
            const data = await API.get('/applications/analytics');
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

export const usersAPI = {
    getUserById: async (userId) => {
        try {
            const data = await API.get(`/users/profile/${userId}`);
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    updateUser: async (formData) => {
        try {
            // Using formData because of file uploads (multer)
            const data = await API.put('/users/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    searchUsers: async (query) => {
        try {
            const data = await API.get(`/users/search?query=${encodeURIComponent(query)}`);
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    toggleSaveJob: async (userId, jobId) => {
        try {
            const data = await API.post(`/users/${userId}/save-job`, { jobId });
            return data;
        } catch (error) {
            return { success: false, error: error.response?.data?.error || error.message };
        }
    },
    getSavedJobs: async (userId) => {
        try {
            const data = await API.get(`/users/${userId}/saved-jobs`);
            return data;
        } catch (error) {
            return { success: false, error: error.response?.data?.error || error.message };
        }
    }
};

export const savedJobsAPI = {
    saveJob: async (userId, jobId) => {
        try {
            const data = await API.post(`/jobs/${jobId}/save`);
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    unsaveJob: async (userId, jobId) => {
        try {
            const data = await API.delete(`/jobs/${jobId}/unsave`);
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

export const interviewsAPI = {
    createInterview: async (interviewData) => {
        try {
            const data = await API.post(`/interviews`, interviewData);
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    getInterviews: async () => {
        try {
            const data = await API.get(`/interviews`);
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    updateInterviewStatus: async (id, status) => {
        try {
            const data = await API.put(`/interviews/${id}/status`, { status });
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export const messagesAPI = {
    sendMessage: async (conversationId, senderId, text) => {
        try {
            const data = await API.post(`/chat/messages`, { conversationId, text });
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    getMessages: async (conversationId) => {
        try {
            const data = await API.get(`/chat/messages/${conversationId}`);
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    markAsRead: async (conversationId) => {
        try {
            const data = await API.put(`/chat/messages/${conversationId}`);
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

export const conversationsAPI = {
    getConversations: async (userId) => {
        try {
            const data = await API.get(`/chat/conversations`);
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    createConversation: async (participants) => {
        try {
             const data = await API.post(`/chat/conversations`, { participants });
             return data;
        } catch (error) {
             return { success: false, error: error.message };
        }
    }
};

export const notificationsAPI = {
    getNotifications: async (userId) => {
        try {
            const data = await API.get(`/notifications`);
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    markAsRead: async (notificationId, userId) => {
        try {
            const data = await API.put(`/notifications/${notificationId}/read`);
            return data;
        } catch (error) {
             return { success: false, error: error.message };
        }
    }
};
