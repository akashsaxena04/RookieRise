import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Rocket, Target, Briefcase, MessageSquare, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import './HomePage.css'; // Removed structural css; strictly using Tailwind

function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-3xl"></div>
        <div className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] rounded-full bg-indigo-400/20 blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-medium text-sm mb-8">
            <Zap size={16} className="text-blue-600" />
            <span className="tracking-wide">The #1 Platform for Entry-Level Talent</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Launch Your Career with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">RookieRise</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop competing with seniors for entry-level jobs. Connect directly with top recruiters looking exclusively for fresh, ambitious talent like you.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-600/20">
                  Join as Rookie <ArrowRight size={20} />
                </Link>
                <Link to="/jobs" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white text-slate-800 border-2 border-slate-200 rounded-2xl font-bold text-lg hover:border-slate-300 hover:bg-slate-50 active:scale-95 transition-all">
                  <Briefcase size={20} /> Browse Jobs
                </Link>
              </>
            ) : (
              <Link to="/jobs" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-600/20">
                 <Briefcase size={20} /> Browse Available Jobs
              </Link>
            )}
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-24 border-y border-slate-200/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose RookieRise?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">We've stripped away the noise of traditional job boards to bring you a focused, streamlined hiring experience.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: Target, title: "Smart Matchmaking", desc: "Our algorithm calculates exact match percentages between your skills and job requirements.", color: "text-rose-500", bg: "bg-rose-50" },
              { icon: Briefcase, title: "Curated Opportunities", desc: "No more scrolling past 'Entry Level' jobs requiring 5 years of experience. Strictly rookie-friendly.", color: "text-blue-500", bg: "bg-blue-50" },
              { icon: MessageSquare, title: "Direct Messaging", desc: "Chat instantly with recruiters the moment you are shortlisted. Cut out the email spam.", color: "text-emerald-500", bg: "bg-emerald-50" },
              { icon: Zap, title: "60-Second Pitches", desc: "Stand out by adding a quick elevator pitch video to your profile seamlessly capturing attention.", color: "text-amber-500", bg: "bg-amber-50" }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={itemVariants} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works / Social Proof */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">Your hiring journey, completely reimagined.</h2>
            <div className="space-y-6">
              {[
                "Create a profile highlighting your specific rookie skills.",
                "Upload a 60-second video pitch to stand out instantly.",
                "See your intelligent match percentage on every job listing.",
                "Secure the bag with direct recruiter chat access."
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle2 size={24} className="text-blue-600" />
                  </div>
                  <p className="text-lg text-slate-700">{step}</p>
                </div>
              ))}
            </div>
            {!isAuthenticated && (
              <div className="mt-10">
                <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 flex items-center gap-2">
                  Create your free account today <ArrowRight size={20} />
                </Link>
              </div>
            )}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
            className="lg:w-1/2 w-full"
          >
            <div className="relative bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2rem] p-1 shadow-2xl shadow-blue-500/20">
               <div className="bg-white rounded-[1.8rem] h-96 w-full flex flex-col justify-center items-center p-8 text-center bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiLz48L3N2Zz4=')]">
                  <Rocket size={64} className="text-indigo-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Designed for the Future</h3>
                  <p className="text-slate-500 max-w-sm">A beautiful, seamless workspace for recruiters and applicants alike.</p>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

export default HomePage;
