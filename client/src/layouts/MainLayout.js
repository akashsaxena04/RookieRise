import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationDropdown from '../components/NotificationDropdown';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Briefcase, LayoutDashboard, MessageSquare, User, LogOut, Rocket } from 'lucide-react';
import './MainLayout.css'; // Preserved for any legacy root styles but strictly using Tailwind

function MainLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname.startsWith(to) && to !== '/' || (to === '/' && location.pathname === '/');
    return (
      <Link 
        to={to} 
        onClick={closeMenu}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
          isActive 
            ? 'bg-blue-50 text-blue-600 shadow-sm' 
            : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
        }`}
      >
        <Icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
        {children}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Sticky Premium Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-lg border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <Rocket size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">
                RookieRise
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <NavLink to="/jobs" icon={Briefcase}>Browse Jobs</NavLink>
              
              {user?.type === 'rookie' && (
                <NavLink to="/dashboard" icon={LayoutDashboard}>My Dashboard</NavLink>
              )}
              {user?.type === 'recruiter' && (
                <NavLink to="/recruiter-dashboard" icon={LayoutDashboard}>Recruiter Dashboard</NavLink>
              )}
              
              <NavLink to="/chat" icon={MessageSquare}>Messages</NavLink>
              
              {user ? (
                <div className="flex items-center gap-2 pl-4 ml-4 border-l border-slate-200">
                  <NotificationDropdown />
                  <NavLink to={`/profile/${user._id}`} icon={User}>Profile</NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors duration-300"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 pl-4 ml-4 border-l border-slate-200">
                   <Link to="/login" className="px-5 py-2.5 text-slate-700 font-bold hover:text-blue-600 transition-colors">
                      Sign In
                   </Link>
                   <Link to="/register" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95">
                      Sign Up
                   </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              {user && <NotificationDropdown />}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-slate-200 bg-white"
            >
              <div className="px-4 pt-2 pb-6 space-y-1 shadow-lg">
                <NavLink to="/jobs" icon={Briefcase}>Browse Jobs</NavLink>
                {user?.type === 'rookie' && (
                  <NavLink to="/dashboard" icon={LayoutDashboard}>My Dashboard</NavLink>
                )}
                {user?.type === 'recruiter' && (
                  <NavLink to="/recruiter-dashboard" icon={LayoutDashboard}>Recruiter Dashboard</NavLink>
                )}
                <NavLink to="/chat" icon={MessageSquare}>Messages</NavLink>
                
                {user ? (
                  <>
                    <div className="h-px bg-slate-100 my-2"></div>
                    <NavLink to={`/profile/${user._id}`} icon={User}>Profile</NavLink>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors duration-300"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="h-px bg-slate-100 my-2"></div>
                    <Link to="/login" onClick={closeMenu} className="flex items-center gap-2 px-4 py-3 text-slate-700 font-bold hover:bg-slate-50 rounded-xl transition-colors w-full">
                       Sign In
                    </Link>
                    <Link to="/register" onClick={closeMenu} className="flex items-center gap-2 px-4 py-3 text-blue-600 font-bold hover:bg-blue-50 rounded-xl transition-colors w-full">
                       Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content Area */}
      <main className={location.pathname === '/' ? "flex-grow w-full" : "flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Premium Footer */}
      <footer className="bg-white border-t border-slate-200/60 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Rocket size={20} className="text-blue-600" />
              <span className="text-lg font-bold text-slate-800">RookieRise</span>
            </div>
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} RookieRise. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-blue-600 transition-colors">About</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
