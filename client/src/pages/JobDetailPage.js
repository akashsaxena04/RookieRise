import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobs } from '../contexts/JobsContext';
import { useApplications } from '../contexts/ApplicationsContext';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Briefcase, Clock, Building, CheckCircle2, Heart, MessageSquare } from 'lucide-react';

function JobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { getJobById } = useJobs();
  const { applyToJob, loading: applyLoading, applications, fetchApplications } = useApplications();
  const { user, toggleSaveJob } = useAuth();
  const { createConversation, loading: chatLoading } = useChat();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const result = await getJobById(jobId);
        if (result.success) {
          setJob(result.job);
        } else {
          setError('Job not found');
        }
      } catch (err) {
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
    if (user?.type === 'rookie') {
        fetchApplications({ rookieId: user._id });
    }
  }, [jobId, getJobById, user, fetchApplications]);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSuccessMessage('');

    if (!coverLetter.trim()) {
      setSubmitError('Please write a cover letter');
      return;
    }

    const recruiterIdStr = typeof job.recruiterId === 'object' ? job.recruiterId._id : job.recruiterId;
    const result = await applyToJob(user._id, job._id, coverLetter, recruiterIdStr);
    if (result.success !== false) {
      setSuccessMessage('Application submitted successfully! Redirecting...');
      setCoverLetter('');
      setShowApplyForm(false);
      setTimeout(() => navigate('/dashboard'), 2000);
    } else {
      setSubmitError(result.error || 'Failed to submit application');
    }
  };

  const isSaved = user?.savedJobs?.includes(job?._id);

  const handleSaveJob = async () => {
      const res = await toggleSaveJob(job._id);
      if (res.success) {
          toast.success(isSaved ? 'Removed from saved jobs' : 'Job saved successfully');
      } else {
          toast.error(res.error || 'Failed to save job');
      }
  };

  const handleChat = async () => {
      if (!user) return toast.error('Must be logged in to chat');
      const recruiterIdStr = typeof job.recruiterId === 'object' ? job.recruiterId._id : job.recruiterId;
      const res = await createConversation([user._id, recruiterIdStr]);
      if (res.success !== false) {
           navigate('/chat');
      } else {
           toast.error(res.error || 'Failed to start conversation');
      }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><LoadingSpinner message="Loading job details..." /></div>;
  if (error || !job) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-red-600 font-bold">{error || 'Job not found'}</div>;

  const recruiter = typeof job.recruiterId === 'object' ? job.recruiterId : {};

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      
      {/* Premium Header Backdrop */}
      <div className="bg-slate-900 text-white pt-12 pb-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <button onClick={() => navigate('/jobs')} className="flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors w-fit">
            <ArrowLeft size={18} /> Back to Jobs
          </button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center overflow-hidden border-4 border-slate-800 shadow-xl flex-shrink-0">
               {recruiter.companyLogo ? (
                 <img src={recruiter.companyLogo} alt="Logo" className="w-full h-full object-cover" />
               ) : (
                 <Briefcase size={32} className="text-slate-900" />
               )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold mb-3">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm md:text-base">
                <span className="flex items-center gap-1"><Building size={16} className="text-blue-400" /> {recruiter.company || job.companyName || 'Corporate'}</span>
                <span className="flex items-center gap-1"><MapPin size={16} className="text-indigo-400" /> {job.location}</span>
                <span className="flex items-center gap-1"><Clock size={16} className="text-emerald-400" /> Posted {new Date(job.postedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-12 relative z-20 flex flex-col md:flex-row gap-8">
        
        {/* Main Content Column */}
        <div className="md:w-2/3 space-y-6">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Briefcase size={16}/></span>
              Job Overview
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                 <p className="text-sm text-slate-500 mb-1">Job Type</p>
                 <p className="font-semibold text-slate-900">{job.type}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                 <p className="text-sm text-slate-500 mb-1">Experience Level</p>
                 <p className="font-semibold text-slate-900">{job.experience}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 col-span-2">
                 <p className="text-sm text-slate-500 mb-1">Estimated Salary</p>
                 <p className="font-semibold text-slate-900">{job.salary || 'Not specified'}</p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-3">About This Position</h3>
            <div className="text-slate-600 leading-relaxed whitespace-pre-wrap mb-8">
              {job.description}
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-4">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.requirements && job.requirements.map((skill, idx) => (
                <span key={idx} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-medium text-sm flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-indigo-500" /> {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Company Culture Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 shadow-lg text-white">
             <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
               <Building size={20} className="text-blue-400" /> About {recruiter.company || 'the Company'}
             </h2>
             
             {recruiter.companyDescription ? (
               <p className="text-slate-300 leading-relaxed mb-6">{recruiter.companyDescription}</p>
             ) : (
               <p className="text-slate-400 italic mb-6">No detailed description provided by the recruiter.</p>
             )}

             {recruiter.companyCulture && (
               <div className="mb-6">
                 <h3 className="text-lg font-semibold text-blue-200 mb-2">Our Culture</h3>
                 <p className="text-slate-300 leading-relaxed bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/5">{recruiter.companyCulture}</p>
               </div>
             )}

             {recruiter.perks && recruiter.perks.length > 0 && (
               <div>
                 <h3 className="text-lg font-semibold text-blue-200 mb-3">Perks & Benefits</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {recruiter.perks.map((perk, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-200 bg-white/5 px-4 py-2 rounded-xl">
                        <Heart size={14} className="text-rose-400 flex-shrink-0" /> <span className="text-sm">{perk}</span>
                      </div>
                   ))}
                 </div>
               </div>
             )}
          </motion.div>

        </div>

        {/* Action Sidebar */}
        <div className="md:w-1/3 space-y-6">
           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-28">
              {user?.type === 'recruiter' ? (
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Recruiter View</h3>
                  <p className="text-slate-500 text-sm mb-6">You're viewing this job as a recruiter.</p>
                  {user?._id === job.recruiterId?._id && (
                     <button className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors">Edit Listing</button>
                  )}
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Apply?</h3>
                  <p className="text-slate-500 text-sm mb-6">Submit your cover letter to join {recruiter.company || 'the team'}.</p>

                  {successMessage && (
                    <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 size={16} /> {successMessage}
                    </div>
                  )}

                  {!showApplyForm ? (
                    <div className="space-y-3">
                      {!user ? (
                         <button onClick={() => navigate('/login', { state: { returnTo: `/jobs/${job._id}` } })} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95">
                            Sign In to Apply
                         </button>
                      ) : (
                        () => {
                           const userApp = applications.find(a => (a.jobId?._id === job._id || a.jobId === job._id));
                           const hasApplied = userApp && userApp.status !== 'rejected';
                           return hasApplied ? (
                              <div className="w-full py-3.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl font-bold flex items-center justify-center gap-2">
                                 <CheckCircle2 size={18} /> Application Active
                              </div>
                           ) : (
                              <button onClick={() => setShowApplyForm(true)} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95">
                                 Apply Now
                              </button>
                           );
                        }
                      )()}
                      {user && (
                        <button onClick={handleSaveJob} className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                          <Heart size={18} className={isSaved ? "fill-rose-500 text-rose-500" : ""} /> {isSaved ? "Saved" : "Save Job"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={handleApply} className="space-y-4">
                      {submitError && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{submitError}</div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Pitch Yourself (Cover Letter)</label>
                        <textarea
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          placeholder="Tell the recruiter why you're a great fit..."
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none min-h-[150px]"
                          disabled={applyLoading}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button type="button" onClick={() => setShowApplyForm(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors" disabled={applyLoading}>Cancel</button>
                        <button type="submit" className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white flex justify-center items-center rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95" disabled={applyLoading}>
                          {applyLoading ? <LoadingSpinner /> : 'Submit'}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}

              <hr className="my-6 border-slate-100" />

              <div className="text-center">
                 <p className="text-sm font-medium text-slate-900 mb-1">Have questions about the role?</p>
                 <button onClick={handleChat} disabled={chatLoading} className="inline-flex items-center justify-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors py-2">
                   <MessageSquare size={16} /> Message {recruiter.name?.split(' ')[0] || 'Recruiter'}
                 </button>
              </div>
           </motion.div>
        </div>

      </div>
    </div>
  );
}

export default JobDetailPage;
