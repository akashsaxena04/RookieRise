import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './AuthPage.css';

function ForgotPasswordPage() {
    const { forgotPassword, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        const result = await forgotPassword(email);
        if (result.success) {
            toast.success('Password reset email sent! Check your inbox.');
            setSubmitted(true);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-form-wrapper">
                    <h1>Forgot Password</h1>
                    <p className="auth-subtitle">Enter your email to reset your password.</p>

                    {submitted ? (
                        <div className="success-message" style={{ textAlign: 'center', padding: '20px' }}>
                            <p>If an account exists for {email}, we've sent instructions for resetting your password.</p>
                            <Link to="/login" className="btn-submit" style={{ display: 'inline-block', marginTop: '20px', textDecoration: 'none' }}>
                                Return to Sign In
                            </Link>
                        </div>
                    ) : (
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
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={loading || !email}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    )}

                    <p className="auth-footer" style={{ marginTop: '20px' }}>
                        Remember your password? <Link to="/login">Sign in here</Link>
                    </p>
                </div>

                <div className="auth-hero">
                    <div className="auth-hero-content">
                        <h2>Recover Your Account</h2>
                        <p>Get back to finding your dream job or the perfect candidate.</p>
                        <ul>
                            <li>✓ Secure account recovery</li>
                            <li>✓ Fast email delivery</li>
                            <li>✓ Safe password reset</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
