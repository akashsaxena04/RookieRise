import React, { createContext, useContext, useState, useCallback } from 'react';
import { applicationsAPI } from '../services/api';

const ApplicationsContext = createContext();

export function ApplicationsProvider({ children }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const applyToJob = useCallback(async (rookieId, jobId, coverletter, recruiterId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await applicationsAPI.applyToJob(rookieId, jobId, coverletter, recruiterId);
      if (result.success !== false) { // Using standard response check
        setApplications([...applications, result.application]);
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      setError('Failed to apply to job');
      return { success: false, error: 'Failed to apply to job' };
    } finally {
      setLoading(false);
    }
  }, [applications]);

  const fetchApplications = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await applicationsAPI.getApplications(filters);
      if (result.success !== false) {
        setApplications(result.applications || result);
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      setError('Failed to fetch applications');
      return { success: false, error: 'Failed to fetch applications' };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateApplicationStatus = useCallback(async (applicationId, status) => {
    setLoading(true);
    setError(null);
    try {
      const result = await applicationsAPI.updateApplicationStatus(applicationId, status);
      if (result.success !== false) {
        setApplications(applications.map(app =>
          app._id === applicationId ? (result.application || result) : app
        ));
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      setError('Failed to update application');
      return { success: false, error: 'Failed to update application' };
    } finally {
      setLoading(false);
    }
  }, [applications]);

  const value = {
    applications,
    loading,
    error,
    applyToJob,
    fetchApplications,
    updateApplicationStatus
  };

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationsContext);
  if (!context) {
    throw new Error('useApplications must be used within an ApplicationsProvider');
  }
  return context;
}
