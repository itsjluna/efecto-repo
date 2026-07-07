import React from 'react';
import './StatusModal.css';

const StatusModal = ({ status, successMsg = "Transmission complete.", errorMsg = "Signal disrupted." }) => {
  if (status === 'idle') return null;

  return (
    <div className="status-modal-overlay">
      <div className={`status-modal-box ${status}`}>
        {status === 'loading' && <div className="loader-spinner"></div>}
        {status === 'success' && (
          <div className="modal-content">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <p>{successMsg}</p>
          </div>
        )}
        {status === 'error' && (
          <div className="modal-content">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <p>{errorMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusModal;
