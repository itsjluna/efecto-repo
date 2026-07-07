import React from 'react';
import { Link } from 'react-router-dom';
import { useAudio } from '../components/AudioProvider';
import './Landing.css';

const Landing = () => {
  const { playHoverChime, playClickPulse } = useAudio();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-logo">EFECTO AGENCY</h1>
        <p className="landing-subtitle">SEE BEYOND</p>
        
        <div className="landing-options">
          <Link to="/portfolio" className="btn btn-primary landing-btn" onClick={playClickPulse} onMouseEnter={playHoverChime}>
            THE ARCHIVE
          </Link>
          <Link to="/photography" className="btn btn-primary landing-btn" onClick={playClickPulse} onMouseEnter={playHoverChime}>
            PHOTOGRAPHY
          </Link>
          <Link to="/marketing" className="btn btn-primary landing-btn" onClick={playClickPulse} onMouseEnter={playHoverChime}>
            MARKETING
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
