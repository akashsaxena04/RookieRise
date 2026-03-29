import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { notificationsAPI } from '../services/api';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || (process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:5000');

function NotificationDropdown() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!user || (!user._id && !user.id)) return;
        const userId = user._id || user.id;

        const fetchInitial = async () => {
            const result = await notificationsAPI.getNotifications(userId);
            if (result.success !== false) {
                const data = result.notifications || result;
                if (Array.isArray(data)) {
                    setNotifications(data);
                    setUnreadCount(data.filter(n => !n.read).length);
                }
            }
        };

        fetchInitial();

        const socket = io(SOCKET_URL);
        socket.on('connect', () => {
            socket.emit('join_room', userId);
        });

        socket.on('new_notification', (notification) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        return () => {
            socket.close();
        };

    }, [user]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (notificationId) => {
        const result = await notificationsAPI.markAsRead(notificationId);
        if (result.success !== false) {
            setNotifications(prev => 
                prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const toggleDropdown = () => setIsOpen(!isOpen);

    if (!user) return null;

    return (
        <div className="notification-wrapper" ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
            <button 
               onClick={toggleDropdown} 
               className="nav-link bg-transparent border-0 cursor-pointer flex items-center"
               style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px' }}
            >
                <span role="img" aria-label="notifications" style={{ fontSize: '1.2rem' }}>🔔</span>
                {unreadCount > 0 && (
                    <span 
                        className="badge" 
                        style={{ 
                            background: 'red', 
                            color: 'white', 
                            borderRadius: '50%', 
                            padding: '2px 6px', 
                            fontSize: '0.7rem',
                            position: 'absolute',
                            top: '5px',
                            right: '5px'
                        }}
                    >
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div 
                    className="notification-dropdown" 
                    style={{ 
                        position: 'absolute', 
                        right: 0, 
                        top: '100%', 
                        width: '300px', 
                        maxHeight: '400px', 
                        overflowY: 'auto', 
                        background: 'white', 
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
                        borderRadius: '8px', 
                        zIndex: 1000,
                        border: '1px solid #eee'
                    }}
                >
                    <div style={{ padding: '10px 15px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
                        Notifications
                    </div>
                    {notifications.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                            No notifications yet
                        </div>
                    ) : (
                        notifications.map(n => (
                            <div 
                                key={n._id} 
                                onClick={() => !n.read && markAsRead(n._id)}
                                style={{ 
                                    padding: '12px 15px', 
                                    borderBottom: '1px solid #f5f5f5',
                                    background: n.read ? 'white' : '#f0f7ff',
                                    cursor: n.read ? 'default' : 'pointer',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <p style={{ fontSize: '0.9rem', margin: 0, color: '#333' }}>{n.message}</p>
                                <span style={{ fontSize: '0.7rem', color: '#888', marginTop: '4px', display: 'block' }}>
                                    {new Date(n.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))
                    )}
                    <div style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid #eee' }}>
                        <Link to="/notifications" style={{ fontSize: '0.85rem', color: '#0066cc', textDecoration: 'none' }}>
                            View All
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationDropdown;
