import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApplications } from '../contexts/ApplicationsContext';
import { usersAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Search, UserCircle, MessageCircle, ArrowRight, BarChart3, Clock, AlertCircle, Heart } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

function RookieDashboardPage() {
  const { user } = useAuth();
  const { applications, fetchApplications } = useApplications();
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const loadApplications = async () => {
      await fetchApplications({ rookieId: user._id });
      setLoading(false);
    };
    const fetchSavedJobs = async () => {
       try {
          const data = await usersAPI.getSavedJobs(user._id);
          if (data.success) {
             setSavedJobs(data.savedJobs);
          }
       } catch (err) {}
    };
    loadApplications();
    fetchSavedJobs();
  }, [user._id, fetchApplications]);

  const appliedCount = applications.length;
  const shortlistedCount = applications.filter(a => a.status === 'shortlisted').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;
  const pendingCount = appliedCount - shortlistedCount - rejectedCount;

  // Chart Data Configuration
  const doughnutData = {
    labels: ['Pending Review', 'Shortlisted', 'Rejected'],
    datasets: [{
      data: [pendingCount, shortlistedCount, rejectedCount],
      backgroundColor: ['#60A5FA', '#34D399', '#F87171'],
      borderWidth: 0,
      hoverOffset: 10
    }]
  };

  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Profile Views',
      data: [0, 0, 0, 0, 0, 0, 0],
      borderColor: '#818CF8',
      backgroundColor: 'rgba(129, 140, 248, 0.2)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#4F46E5',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, padding: 20, font: { family: "'Inter', sans-serif" } } }
    }
  };

  const lineOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
          x: { grid: { display: false } },
          y: { grid: { borderDash: [5, 5] }, beginAtZero: true }
      },
      plugins: {
          legend: { display: false }
      }
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 top-shadow">
      
      {/* Dynamic Header */}
      <div className="bg-slate-900 text-white pt-12 pb-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
           <div>
             <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl md:text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100">
               Welcome back, {user?.name.split(' ')[0]}! 👋
             </motion.h1>
             <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-slate-400 text-lg">
               You are building momentum. Keep pushing forward.
             </motion.p>
           </div>
           
           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="mt-8 md:mt-0 flex gap-3">
             <a href="/jobs" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
                <Search size={18} /> Find New Jobs
             </a>
             <a href={`/profile/${user?._id}`} className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl font-bold transition-all flex items-center gap-2 text-white border border-white/10">
                <UserCircle size={18} /> Enhance Profile
             </a>
           </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        
        {/* Core Stats Grid */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Applied', val: appliedCount, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Shortlisted', val: shortlistedCount, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'In Review', val: pendingCount, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Rejected', val: rejectedCount, color: 'text-rose-600', bg: 'bg-rose-50' }
          ].map((stat, idx) => (
             <motion.div key={idx} variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center hover:-translate-y-1 transition-transform">
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 text-2xl font-black`}>
                  {stat.val}
                </div>
                <p className="text-slate-500 font-medium text-sm">{stat.label}</p>
             </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Analytics Charts */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Pipeline Doughnut */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8 items-center">
               <div className="md:w-1/2 w-full">
                  <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                     <BarChart3 className="text-blue-500" /> Application Health
                  </h2>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                     A visual breakdown of where your submitted applications currently stand. A healthy pipeline has a steady flow of pending reviews.
                  </p>
                  
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
                     <BarChart3 size={20} className="mt-0.5 flex-shrink-0" />
                     <p className="text-sm font-medium">Your shortlist rate is {(shortlistedCount / (appliedCount || 1) * 100).toFixed(0)}%. Add a 60-second video pitch to boost this by 40%!</p>
                  </div>
               </div>
               <div className="md:w-1/2 w-full h-64 relative">
                  {appliedCount === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                       <BarChart3 size={32} className="mb-2 opacity-50" />
                       <span className="text-sm font-medium">No Data Available</span>
                    </div>
                  ) : (
                    <Doughnut data={doughnutData} options={chartOptions} />
                  )}
               </div>
            </div>

            {/* Profile Momentum Line Chart */}
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
               <h2 className="text-xl font-bold text-slate-900 mb-2">Profile Momentum</h2>
               <p className="text-slate-500 text-sm mb-6">How often recruiters are checking out your profile this week.</p>
               <div className="h-64 w-full">
                  <Line data={lineData} options={lineOptions} />
               </div>
            </div>
          </motion.div>

          {/* Right Column: Applications List */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-1">
             <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="text-indigo-500" /> Recent Activity
                   </h2>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                  {loading ? (
                    <div className="h-full flex items-center justify-center text-slate-400">Loading...</div>
                  ) : applications.length === 0 ? (
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center flex flex-col items-center justify-center h-full">
                       <AlertCircle size={32} className="text-slate-300 mb-3" />
                       <p className="text-slate-500 text-sm mb-4">You haven't applied to any jobs yet.</p>
                       <a href="/jobs" className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium">Browse Jobs</a>
                    </div>
                  ) : (
                    applications.slice(0, 5).map(app => (
                      <div key={app._id} className="p-4 rounded-2xl border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all group bg-slate-50 hover:bg-white cursor-default">
                         <div className="flex justify-between items-start mb-2">
                             <h3 className="font-bold text-slate-900 max-w-[70%] truncate group-hover:text-blue-600 transition-colors">
                                 {app.jobId?.title || 'Application'}
                             </h3>
                             <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                                app.status === 'shortlisted' ? 'bg-emerald-100 text-emerald-700' :
                                app.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                                'bg-blue-100 text-blue-700'
                             }`}>
                               {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                             </span>
                         </div>
                         <p className="text-sm text-slate-500 flex items-center justify-between">
                            <span>{app.jobId?.companyName || 'Company'}</span>
                            <span className="text-xs">{new Date(app.appliedDate).toLocaleDateString()}</span>
                         </p>
                         <a href={`/jobs/${app.jobId?._id || ''}`} className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Job Listing <ArrowRight size={14} />
                         </a>
                      </div>
                    ))
                  )}
                </div>
                {applications.length > 5 && (
                  <div className="pt-4 mt-2 border-t border-slate-100 text-center">
                    <button className="text-sm font-medium text-slate-500 hover:text-slate-800">View All Applications</button>
                  </div>
                )}
             </div>
          </motion.div>
        </div>

        {/* Saved Jobs Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mb-8 mt-8">
           <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Heart className="text-rose-500 fill-rose-500" /> Your Saved Opportunities
           </h2>
           {savedJobs.length === 0 ? (
               <div className="bg-white rounded-[2rem] p-12 shadow-sm border border-slate-200 text-center text-slate-500 flex flex-col items-center">
                  <Heart size={48} className="mb-4 text-slate-200" />
                  <p className="text-lg font-medium text-slate-700">No jobs saved yet.</p>
                  <p className="max-w-md mx-auto mt-2 text-sm">Browse the job listings and click 'Save Job' on any role that catches your eye. We'll track them here for you.</p>
               </div>
           ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {savedJobs.map(job => (
                    <a key={job._id} href={`/jobs/${job._id}`} className="block bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 group hover:-translate-y-1">
                       <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors mb-1 truncate">{job.title}</h3>
                       <p className="text-sm text-slate-500 mb-4">{job.recruiterId?.company || job.companyName}</p>
                       <div className="flex justify-between items-center text-xs font-semibold mt-auto pt-4 border-t border-slate-100">
                          <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg">{job.location}</span>
                          <span className="text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">View Role <ArrowRight size={14} /></span>
                       </div>
                    </a>
                 ))}
               </div>
           )}
        </motion.div>

      </div>
    </div>
  );
}

export default RookieDashboardPage;
