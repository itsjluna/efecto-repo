import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-logo">EFECTO AGENCY</h1>
        <p className="landing-subtitle">SELECT YOUR EXPERIENCE</p>
        
        <div className="landing-options">
          <Link to="/photography" className="btn btn-primary landing-btn">
            PHOTOGRAPHY
          </Link>
          <Link to="/marketing" className="btn btn-primary landing-btn">
            MARKETING
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
