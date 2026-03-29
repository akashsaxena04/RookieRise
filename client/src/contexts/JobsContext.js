import React, { createContext, useContext, useState, useCallback } from 'react';
import { jobsAPI } from '../services/api';

const JobsContext = createContext();

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchJobs = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await jobsAPI.getJobs(filters);
      if (result.success !== false) { // Backend could just return data direct or { success: true, ... }
        setJobs(result.jobs || result); 
        setTotalPages(result.totalPages || 1);
        setCurrentPage(result.currentPage || 1);
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      setError('Failed to fetch jobs');
      return { success: false, error: 'Failed to fetch jobs' };
    } finally {
      setLoading(false);
    }
  }, []);

  const getJobById = useCallback(async (jobId) => {
    try {
      const result = await jobsAPI.getJobById(jobId);
      return result;
    } catch (err) {
      return { success: false, error: 'Failed to fetch job' };
    }
  }, []);

  const createJob = useCallback(async (jobData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await jobsAPI.createJob(jobData);
      if (result.success) {
        setJobs([...jobs, result.job]);
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      setError('Failed to create job');
      return { success: false, error: 'Failed to create job' };
    } finally {
      setLoading(false);
    }
  }, [jobs]);

  const updateJob = useCallback(async (jobId, updates) => {
    setLoading(true);
    setError(null);
    try {
      const result = await jobsAPI.updateJob(jobId, updates);
      if (result.success) {
        setJobs(jobs.map(job => job.id === jobId ? result.job : job));
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      setError('Failed to update job');
      return { success: false, error: 'Failed to update job' };
    } finally {
      setLoading(false);
    }
  }, [jobs]);

  const value = {
    jobs,
    loading,
    error,
    fetchJobs,
    getJobById,
    createJob,
    updateJob,
    totalPages,
    currentPage
  };

  return (
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
}
