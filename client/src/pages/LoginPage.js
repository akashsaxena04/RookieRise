import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AuthPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('password123');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      navigate('/jobs');
    } else {
      setLocalError(result.error || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-wrapper">
          <h1>Sign In to RookieRise</h1>
          <p className="auth-subtitle">Welcome back! Let's find you an amazing opportunity.</p>

          {(error || localError) && (
            <div className="error-message">
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="demo-credentials">
            <p><strong>Demo Credentials:</strong></p>
            <p>Rookie: john@example.com / password123</p>
            <p>Recruiter: recruiter@tech.com / password123</p>
          </div>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Sign up here</Link>
          </p>
        </div>

        <div className="auth-hero">
          <div className="auth-hero-content">
            <h2>Your Career Starts Here</h2>
            <p>Join thousands of rookies who found their first job on RookieRise.</p>
            <ul>
              <li>✓ Easy application process</li>
              <li>✓ Direct recruiter messaging</li>
              <li>✓ Real-time notifications</li>
              <li>✓ Career support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
