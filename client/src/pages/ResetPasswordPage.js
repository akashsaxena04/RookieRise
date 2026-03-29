import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './AuthPage.css';

function ResetPasswordPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { resetPassword, loading } = useAuth();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (password.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        const result = await resetPassword(token, password);
        
        if (result.success) {
            toast.success('Password reset successful! Please log in.');
            navigate('/login');
        } else {
            setLocalError(result.error || 'Failed to reset password.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-form-wrapper">
                    <h1>Reset Password</h1>
                    <p className="auth-subtitle">Choose a new, secure password.</p>

                    {localError && (
                        <div className="error-message">
                            {localError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="password">New Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 6 characters"
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your new password"
                                disabled={loading}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>

                    <p className="auth-footer" style={{ marginTop: '20px' }}>
                        <Link to="/login">Back to Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordPage;
