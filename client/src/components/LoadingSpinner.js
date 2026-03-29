import React from 'react';

function LoadingSpinner({ message = 'Loading...', fullScreen = false }) {
    const containerStyle = fullScreen ? {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
    } : {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        width: '100%'
    };

    const spinnerStyle = {
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #0066cc',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '1rem'
    };

    return (
        <div style={containerStyle}>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
            <div style={spinnerStyle}></div>
            <p style={{ color: '#666', fontWeight: 500 }}>{message}</p>
        </div>
    );
}

export default LoadingSpinner;
