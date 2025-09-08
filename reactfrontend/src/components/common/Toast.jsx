import React from 'react';

const Toast = ({ message, type, onClose }) => {
    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-content">
                {type === 'success' && <span className="toast-icon success">✓</span>}
                {type === 'error' && <span className="toast-icon error">✗</span>}
                {type === 'warning' && <span className="toast-icon warning">⚠</span>}
                {type === 'info' && <span className="toast-icon info">i</span>}
                <span className="toast-message">{message}</span>
            </div>
            <button className="toast-close" onClick={onClose}>
                &times;
            </button>
        </div>
    );
};

export default Toast;