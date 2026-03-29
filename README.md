# RookieRise - Job Matching Platform

A modern React-based job matching platform that connects entry-level job seekers (rookies) with recruiters. Built with vanilla JavaScript, React Router, and Tailwind CSS.

## Project Overview

RookieRise is a comprehensive job matching platform where:
- **Rookies** can browse jobs, apply to positions, track applications, and chat with recruiters
- **Recruiters** can post jobs, review applications, and communicate with candidates
- Both parties can build profiles, save jobs, and maintain conversations

## Tech Stack

- **Frontend**: React 18.2.0
- **Routing**: React Router v6
- **Styling**: Tailwind CSS 3.4.1
- **State Management**: React Context API with custom hooks
- **Data Storage**: localStorage (mock API)
- **Real-time Chat**: Socket.io-client (ready for integration)
- **Language**: Vanilla JavaScript (no TypeScript)

## Project Structure

```
src/
├── index.js                      # React entry point
├── App.js                        # Main app with routing
├── index.css                     # Global styles with Tailwind
│
├── layouts/
│   ├── MainLayout.js            # Main app layout with navbar/footer
│   └── MainLayout.css
│
├── contexts/                     # State management
│   ├── AuthContext.js           # Authentication state
│   ├── JobsContext.js           # Jobs listing state
│   ├── ApplicationsContext.js    # Job applications state
│   └── ChatContext.js           # Messaging state
│
├── services/
│   └── mockApi.js               # Mock API with localStorage
│
├── pages/                        # Page components
│   ├── HomePage.js              # Landing page
│   ├── LoginPage.js             # Login page
│   ├── RegisterPage.js          # Registration page
│   ├── JobListingPage.js        # Job browsing & search
│   ├── JobDetailPage.js         # Job details & application
│   ├── RookieDashboardPage.js   # Rookie dashboard
│   ├── RecruiterDashboardPage.js # Recruiter dashboard
│   ├── ChatPage.js              # Messaging interface
│   ├── ProfilePage.js           # User profiles
│   └── *.css                    # Page styles
│
public/
├── index.html                   # HTML entry point
└── favicon files
```

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. The app will open at `http://localhost:3000`

## Features

### Implemented ✅
- User authentication (Login/Register)
- Job browsing with filters
- Job details and application submission
- User dashboards (Rookie & Recruiter)
- User profiles with editing
- Messaging system (mock)
- Responsive design
- Mock data in localStorage

### In Development 🚀
- Advanced job matching algorithm
- Recruiter job posting interface
- Interview scheduling
- Notifications system
- Advanced search filters
- User skill recommendations

## Demo Credentials

**Rookie Account:**
- Email: john@example.com
- Password: password123

**Recruiter Account:**
- Email: recruiter@tech.com
- Password: password123

## Mock Data

The app comes with pre-populated mock data:
- 3 sample users (1 recruiter, 2 rookies)
- 3 sample job postings
- 2 sample applications
- Sample conversations and messages

All data is stored in localStorage and persists during your session.

## State Management

The app uses React Context API for state management:

- **AuthContext**: Handles user authentication and session
- **JobsContext**: Manages jobs list and job operations
- **ApplicationsContext**: Tracks job applications
- **ChatContext**: Manages conversations and messages

Each context provides custom hooks for easy access:
```javascript
const { user, login, logout } = useAuth();
const { jobs, fetchJobs, applyToJob } = useJobs();
const { conversations, sendMessage } = useChat();
```

## API Structure

Mock API methods are organized by feature:

```javascript
// Authentication
authAPI.login(email, password)
authAPI.register(userData)

// Jobs
jobsAPI.getJobs(filters)
jobsAPI.getJobById(jobId)
jobsAPI.createJob(jobData)

// Applications
applicationsAPI.applyToJob(rookieId, jobId, coverLetter)
applicationsAPI.getApplications(filters)
applicationsAPI.updateApplicationStatus(appId, status)

// Messages & Chat
messagesAPI.sendMessage(convId, senderId, text)
conversationsAPI.getConversations(userId)

// Users & Profiles
usersAPI.getUserById(userId)
usersAPI.updateUser(userId, updates)
```

## Customization

### Adding Features

1. **New Page**: Create a component in `src/pages/`
2. **New State**: Create a context in `src/contexts/`
3. **New API Methods**: Extend `src/services/mockApi.js`
4. **Styling**: Use Tailwind classes or add CSS files

### Styling

- Colors defined in CSS variables (`src/index.css`)
- Utility classes available in CSS files
- Tailwind configuration in `tailwind.config.js`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Code splitting via React Router
- Component memoization for expensive renders
- Efficient context updates
- Lazy loading of pages

## Future Enhancements

- [ ] Backend API integration
- [ ] Real Socket.io WebSocket implementation
- [ ] File upload for resumes
- [ ] Email notifications
- [ ] Video interview support
- [ ] Advanced analytics
- [ ] Mobile app version
- [ ] Dark mode theme

## Contributing

This is a frontend prototype. Feel free to:
- Add new features
- Improve styling
- Enhance user experience
- Add more mock data
- Create new components

## Notes

- This is a **frontend-only prototype** using mock data
- All data is stored in localStorage and will clear on browser cache clear
- To connect to a real backend, replace mock API calls in contexts
- Socket.io client is ready for real-time features when backend is available

## License

MIT

---

Built with React, Tailwind CSS, and vanilla JavaScript. Ready for backend integration!
