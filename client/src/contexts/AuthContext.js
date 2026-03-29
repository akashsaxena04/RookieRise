import React, { createContext, useContext, useState, useCallback } from 'react';
import { authAPI, usersAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authAPI.login(email, password);
      if (result.success) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        if (result.user.token) {
           localStorage.setItem('token', result.user.token);
        }
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      setError('Login failed');
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authAPI.register(data);
      if (result.success) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        if (result.user.token) {
           localStorage.setItem('token', result.user.token);
        }
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      setError('Registration failed');
      return { success: false, error: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
      setLoading(true);
      setError(null);
      try {
          return await authAPI.forgotPassword(email);
      } catch (err) {
          setError('Failed to send reset link');
          return { success: false, error: 'Failed' };
      } finally {
          setLoading(false);
      }
  }, []);

  const resetPassword = useCallback(async (token, password) => {
      setLoading(true);
      setError(null);
      try {
          return await authAPI.resetPassword(token, password);
      } catch (err) {
          setError('Failed to reset password');
          return { success: false, error: 'Failed' };
      } finally {
          setLoading(false);
      }
  }, []);

  const toggleSaveJob = useCallback(async (jobId) => {
      if (!user) return { success: false, error: 'Not logged in' };
      try {
          const data = await usersAPI.toggleSaveJob(user._id, jobId);
          if (data.success) {
              const updatedUser = { ...user, savedJobs: data.savedJobs };
              setUser(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
          }
          return data;
      } catch (err) {
          return { success: false, error: 'Failed to save job' };
      }
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    forgotPassword,
    resetPassword,
    toggleSaveJob,
    logout,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
