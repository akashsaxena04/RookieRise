import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../contexts/JobsContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Briefcase, Building2, MapPin, DollarSign, ListChecks, AlignLeft, Send } from 'lucide-react';

function PostJobPage() {
  const { createJob, loading } = useJobs();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: user?.company || '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    requirements: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Convert requirements from comma-separated string to array
    const jobData = {
      ...formData,
      requirements: formData.requirements.split(',').map(r => r.trim()).filter(r => r)
    };

    const result = await createJob(jobData);
    if (result.success !== false) {
      toast.success('Job posted successfully!');
      navigate('/recruiter-dashboard');
    } else {
      toast.error(result.error || 'Failed to post job');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 top-shadow">
      
      {/* Header */}
      <div className="bg-slate-900 text-white pt-12 pb-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto relative z-10 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl">
               <Briefcase size={28} className="text-white" />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
               Post a New Opportunity
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-slate-400 text-lg">
               Reach thousands of ambitious entry-level professionals instantly.
            </motion.p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-12 relative z-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
           <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Job Title */}
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                       <Briefcase size={16} className="text-indigo-500" /> Job Title *
                    </label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" placeholder="e.g. Junior Frontend Developer" />
                 </div>

                 {/* Company */}
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                       <Building2 size={16} className="text-indigo-500" /> Company Name *
                    </label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" placeholder="Your Company Ltd." />
                 </div>

                 {/* Location */}
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                       <MapPin size={16} className="text-indigo-500" /> Location
                    </label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" placeholder="e.g. Remote, New York, NY" />
                 </div>

                 {/* Salary */}
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                       <DollarSign size={16} className="text-indigo-500" /> Salary Range
                    </label>
                    <input type="text" name="salary" value={formData.salary} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" placeholder="e.g. $60k - $80k" />
                 </div>
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Job Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none">
                   <option value="Full-time">Full-time</option>
                   <option value="Part-time">Part-time</option>
                   <option value="Contract">Contract</option>
                   <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Requirements */}
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <ListChecks size={16} className="text-indigo-500" /> Matchmaking Requirements (Comma Separated)
                 </label>
                 <input type="text" name="requirements" value={formData.requirements} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" placeholder="e.g. React, Node.js, Graphic Design" />
                 <p className="text-xs text-slate-500 mt-2">These act as keywords for our Smart Matchmaking algorithm against Rookie skills.</p>
              </div>

              {/* Description */}
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <AlignLeft size={16} className="text-indigo-500" /> Job Description *
                 </label>
                 <textarea name="description" value={formData.description} onChange={handleChange} required rows="6" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-y" placeholder="Describe the responsibilities and ideal candidate..."></textarea>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                 <button type="button" onClick={() => navigate('/recruiter-dashboard')} className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">Cancel</button>
                 <button type="submit" disabled={loading} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/25 active:scale-95 flex items-center gap-2">
                   {loading ? 'Posting...' : <><Send size={18} /> Publish Listing</>}
                 </button>
              </div>
           </form>
        </motion.div>
      </div>
    </div>
  );
}

export default PostJobPage;
