# 🚀 RookieRise

RookieRise is a comprehensive, full-stack SaaS job matching platform that connects entry-level job seekers (Rookies) with top-tier recruiters. Built with the MERN stack, the application provides a seamless, real-time experience for job browsing, application tracking, and recruiter-candidate communication.

## ✨ Features

### For Rookies (Job Seekers)
- **Public Job Board:** Browse and search for jobs without needing an account.
- **Saved Jobs:** Bookmark jobs to apply for them later.
- **Application Tracking:** Apply directly to jobs and track your application status in real-time.
- **Real-Time Chat:** Communicate directly with recruiters once an application is initiated.
- **Notifications:** Get instant updates on application status changes and new messages.

### For Recruiters
- **Job Management:** Post, edit, and manage job listings with ease.
- **Applicant Tracking System (ATS):** Review rookie applications, update their statuses (e.g., Shortlisted, Interviewing, Rejected), and manage the hiring pipeline.
- **Interviews:** Schedule and manage interviews with applicants.
- **Direct Messaging:** Reach out to applicants seamlessly through the integrated chat system.

### Core Platform Features
- **Authentication & Security:** JWT-based authentication with secure password management.
- **Modern UI/UX:** Fully responsive design built with Tailwind CSS, featuring subtle animations, premium UI components, and a robust Dark Mode.
- **Real-Time Engine:** Powered by Socket.io for instantaneous chat and live notifications.
- **Deployment Ready:** Configured for seamless deployment on Vercel (Frontend) and Render (Backend).

## 🛠️ Tech Stack

**Frontend (Client):**
- React.js
- React Router DOM
- Tailwind CSS & shadcn/ui components
- Context API (State Management)
- Socket.io-client (Real-time communication)
- Vercel (Deployment Configuration)

**Backend (Server):**
- Node.js & Express.js
- MongoDB & Mongoose (Database)
- Socket.io (WebSockets)
- JWT (Authentication)
- Nodemailer (Email notifications/invitations)
- Render (Deployment Configuration)

## 📁 Project Structure

```text
RookieRise/
├── client/                 # React Frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React Context providers (Auth, Jobs, Chat, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── layouts/        # Page layouts (Main, Dashboard, etc.)
│   │   ├── pages/          # Application pages
│   │   └── services/       # API integration services
│   └── vercel.json         # Vercel deployment configuration
│
└── server/                 # Node.js Backend
    ├── controllers/        # Request handlers
    ├── middlewares/        # Custom middlewares (Auth, Error handling)
    ├── models/             # Mongoose database schemas
    ├── routes/             # API endpoint definitions
    ├── utils/              # Helper functions (uploadConfig, sendEmail, etc.)
    └── index.js            # Express server entry point
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)
- Git
- [Docker](https://www.docker.com/) & Docker Compose

### 1. Clone the repository
```bash
git clone https://github.com/akashsaxena04/RookieRise.git
cd RookieRise
```

### 2. Run with Docker (Recommended)
The easiest way to run the entire stack locally is using Docker. Make sure to configure your root `.env` file first (e.g. `MONGODB_URI`, `JWT_SECRET`, etc.).

```bash
# Start both client and server containers
docker-compose up --build
```
The application will instantly be accessible at `http://localhost:3000`.

### 3. Manual Setup (Without Docker)

#### Backend Setup
```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file and configure your environment variables
# Required variables setup:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# CLIENT_URL=http://localhost:3000
```
Start the backend development server:
```bash
npm run dev
```

#### Frontend Setup
Open a new terminal window:
```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Create a .env file locally pointing to the backend
# REACT_APP_API_URL=http://localhost:5000/api
# REACT_APP_SOCKET_URL=http://localhost:5000
```
Start the React development server:
```bash
npm start    # or npm run dev depending on your package.json setup
```
The application will be running at `http://localhost:3000`.

## 🌐 Deployment Details

This repository is structured and optimized for production deployment:
- **Frontend (`/client`):** Ready to be connected to **Vercel**. Single Page Application (SPA) routing is handled properly via the included `vercel.json` file.
- **Backend (`/server`):** Ready for environments like **Render** or Heroku. Ensure all environment secrets (Database URIs, JWT tokens) are securely added to the platform's Environment Variables dashboard.

## 🤝 Contributing

Contributions are always welcome! 
1. Fork the project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.
