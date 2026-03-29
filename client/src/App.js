import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { JobsProvider } from './contexts/JobsContext';
import { ApplicationsProvider } from './contexts/ApplicationsContext';
import { ChatProvider } from './contexts/ChatContext';
import { useAuth } from './contexts/AuthContext';

// Lazy loaded Pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const JobListingPage = lazy(() => import('./pages/JobListingPage'));
const JobDetailPage = lazy(() => import('./pages/JobDetailPage'));
const RookieDashboardPage = lazy(() => import('./pages/RookieDashboardPage'));
const RecruiterDashboardPage = lazy(() => import('./pages/RecruiterDashboardPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const PostJobPage = lazy(() => import('./pages/PostJobPage'));

// Layout
import MainLayout from './layouts/MainLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <JobsProvider>
          <ApplicationsProvider>
            <ChatProvider>
              <ToastContainer position="top-right" autoClose={3000} />
              <Suspense fallback={<div className="loading-spinner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: '#6366f1' }}>Loading...</div>}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                  <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
                  <Route path="/jobs" element={<MainLayout><JobListingPage /></MainLayout>} />
                  <Route path="/jobs/:jobId" element={<MainLayout><JobDetailPage /></MainLayout>} />

                  {/* Protected routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <MainLayout>
                          <RookieDashboardPage />
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/recruiter-dashboard"
                    element={
                      <ProtectedRoute>
                        <MainLayout>
                          <RecruiterDashboardPage />
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/post-job"
                    element={
                      <ProtectedRoute>
                        <MainLayout>
                          <PostJobPage />
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/chat"
                    element={
                      <ProtectedRoute>
                        <MainLayout>
                          <ChatPage />
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile/:userId"
                    element={
                      <ProtectedRoute>
                        <MainLayout>
                          <ProfilePage />
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Suspense>
            </ChatProvider>
          </ApplicationsProvider>
        </JobsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
