import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="glass-panel not-found-panel">
        <h1 className="glitch-text">404</h1>
        <h2>Signal Lost</h2>
        <p>The frequency you are searching for does not exist in this space.</p>
        <Link to="/" className="not-found-btn">
          <Home size={18} style={{ marginRight: '8px' }} />
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
