import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '../contexts/JobsContext';
import { useAuth } from '../contexts/AuthContext';
import { useApplications } from '../contexts/ApplicationsContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Briefcase, Clock, Flame, Filter, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

function JobListingPage() {
  const { jobs, fetchJobs, loading, error, totalPages, currentPage } = useJobs();
  const { user } = useAuth();
  const { applications, fetchApplications } = useApplications();
  
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    experience: ''
  });
  
  const [page, setPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false); // Mobile filter toggle

  useEffect(() => {
    // Pass userId so the backend can calculate matchPercentage
    fetchJobs({ ...filters, page, userId: user?._id });
    if (user?.type === 'rookie') {
       fetchApplications({ rookieId: user._id });
    }
  }, [page, user, fetchApplications]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs({ ...filters, page: 1, userId: user?._id });
  };

  const handleReset = () => {
    const defaultFilters = { search: '', location: '', type: '', experience: '' };
    setFilters(defaultFilters);
    setPage(1);
    fetchJobs({ ...defaultFilters, userId: user?._id });
  };

  const handlePageChange = (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
          setPage(newPage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-12 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Explore Opportunities</h1>
            <p className="text-lg text-slate-500">Discover roles specifically looking for your rookie talent.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <button 
          className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white border border-slate-200 rounded-xl font-medium shadow-sm hover:bg-slate-50"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        >
          <Filter size={18} /> {isFiltersOpen ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Sidebar Filters */}
        <AnimatePresence>
          {(isFiltersOpen || window.innerWidth >= 1024) && (
            <motion.aside 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:w-1/4 flex flex-col gap-6"
            >
              <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm sticky top-28">
                <div className="flex items-center gap-2 mb-6">
                  <Filter size={20} className="text-blue-600" />
                  <h3 className="font-bold text-lg text-slate-900">Filters</h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Keywords</label>
                    <div className="relative">
                      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" name="search" value={filters.search} onChange={handleFilterChange}
                        placeholder="Job title, skills..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" name="location" value={filters.location} onChange={handleFilterChange}
                        placeholder="City or Remote"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Job Type</label>
                    <div className="relative">
                      <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none transition-all">
                        <option value="">All Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Experience</label>
                    <div className="relative">
                      <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select name="experience" value={filters.experience} onChange={handleFilterChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none transition-all">
                        <option value="">Any Experience</option>
                        <option value="Entry Level">Entry Level</option>
                        <option value="Mid Level">Mid Level</option>
                        <option value="Senior Level">Senior Level</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-3">
                    <button onClick={handleSearch} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]">
                      Apply Filters
                    </button>
                    <button onClick={handleReset} className="w-full py-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 font-medium rounded-xl transition-all">
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Job Listings Area */}
        <div className="lg:w-3/4 flex flex-col gap-6">
          {loading ? (
            <div className="bg-white rounded-3xl border border-slate-200 py-20 flex justify-center">
              <LoadingSpinner message="Searching for opportunities..." />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center text-red-600">
              <p className="mb-4">{error}</p>
              <button onClick={handleReset} className="px-6 py-2 bg-white rounded-full font-medium shadow-sm hover:bg-red-50 transition-colors">Try Again</button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs found</h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">We couldn't find any positions matching your current filters.</p>
              <button onClick={handleReset} className="px-6 py-2 border border-slate-200 rounded-full text-slate-700 hover:bg-slate-50 font-medium transition-colors">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center px-2">
                <p className="text-slate-500 font-medium">Showing <span className="text-slate-900">{jobs.length}</span> results</p>
                <div className="text-sm text-slate-400">Page {currentPage} of {totalPages || 1}</div>
              </div>

              <motion.div 
                initial="hidden" animate="show" 
                variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                className="space-y-4"
              >
                {jobs.map(job => (
                  <motion.div key={job._id} variants={cardVariants} className="group bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 relative overflow-hidden">
                    
                    {/* Visual flair element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex flex-shrink-0 items-center justify-center overflow-hidden border border-slate-200">
                           {job.recruiterId?.companyLogo ? (
                             <img src={job.recruiterId.companyLogo} alt="Logo" className="w-full h-full object-cover" />
                           ) : (
                             <Briefcase size={24} className="text-slate-400" />
                           )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                          <p className="text-slate-500 font-medium">{job.company}</p>
                        </div>
                      </div>

                      {/* SMART MATCHMAKING INDICATOR */}
                      {user?.type === 'rookie' && job.matchPercentage !== undefined && (
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm shadow-sm border ${
                          job.matchPercentage >= 75 ? 'bg-orange-50 text-orange-600 border-orange-200' :
                          job.matchPercentage >= 50 ? 'bg-green-50 text-green-600 border-green-200' :
                          'bg-slate-50 text-slate-500 border-slate-200'
                        }`}>
                          {job.matchPercentage >= 75 && <Flame size={16} fill="currentColor" />}
                          {job.matchPercentage}% Match
                        </div>
                      )}
                    </div>

                    <p className="text-slate-600 line-clamp-2 text-sm leading-relaxed mb-6">
                      {job.description || 'No description provided.'}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium">{job.type}</span>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg">{job.experience}</span>
                    </div>

                    <div className="border-t border-slate-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-slate-400 flex items-center gap-1">
                        <Clock size={14} /> Posted {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'recently'}
                      </div>
                      <div className="flex w-full sm:w-auto gap-2">
                        {user?.type === 'recruiter' ? (
                          user?._id === job.recruiterId._id ? (
                            <button className="flex-1 sm:flex-none px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-xl transition-colors">
                              Manage
                            </button>
                          ) : (
                            <Link to={`/jobs/${job._id}`} className="flex-1 sm:flex-none px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-xl transition-colors text-center">
                              View Details
                            </Link>
                          )
                        ) : (() => {
                          const userApp = applications.find(a => (a.jobId?._id === job._id || a.jobId === job._id));
                          const hasApplied = userApp && userApp.status !== 'rejected';
                          return hasApplied ? (
                            <Link to={`/jobs/${job._id}`} className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-center border border-emerald-100 flex items-center justify-center gap-1">
                               <CheckCircle2 size={16} /> Applied
                            </Link>
                          ) : (
                            <Link to={`/jobs/${job._id}`} className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-900 text-white hover:bg-blue-600 font-medium rounded-xl transition-colors shadow-md shadow-slate-900/10 text-center">
                              View Details & Apply
                            </Link>
                          );
                        })()}
                      </div>
                    </div>

                  </motion.div>
                ))}
              </motion.div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex items-center gap-1 px-4 text-sm font-medium text-slate-600">
                    Page <span className="text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200">{currentPage}</span> of {totalPages}
                  </div>
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobListingPage;
