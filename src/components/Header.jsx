import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Image, Mail, Phone, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from './AudioProvider';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const { isEnabled, toggleAudio, playHoverChime, playClickPulse } = useAudio();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isPortfolio = location.pathname === '/portfolio';

  const handleLinkClick = () => {
    playClickPulse();
  };

  const handleLinkHover = () => {
    playHoverChime();
  };

  return (
    <div className={`header-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <header className="header">
        {!isMobile && <Link to="/" className="logo" onClick={handleLinkClick} onMouseEnter={handleLinkHover}>EFECTO</Link>}
        
        <nav className="nav-links">
          {isMobile && (
            <Link to="/" title="Main Menu" onClick={handleLinkClick} onMouseEnter={handleLinkHover}>
              <Home size={22} strokeWidth={1.5} />
            </Link>
          )}
          
          <a href={isPortfolio ? "#partners" : "#services"} title={isPortfolio ? "Partners" : "Services"} onClick={handleLinkClick} onMouseEnter={handleLinkHover}>
            {isMobile ? <Sparkles size={22} strokeWidth={1.5} /> : (isPortfolio ? 'Partners' : 'Services')}
          </a>
          
          <a href="#gallery" title={isPortfolio ? "Archive" : "Gallery"} onClick={handleLinkClick} onMouseEnter={handleLinkHover}>
            {isMobile ? <Image size={22} strokeWidth={1.5} /> : (isPortfolio ? 'Archive' : 'Gallery')}
          </a>
          
          <a href="#contact" title="Contact" onClick={handleLinkClick} onMouseEnter={handleLinkHover}>
            {isMobile ? <Mail size={22} strokeWidth={1.5} /> : 'Contact'}
          </a>

          {isMobile && (
            <a href="tel:+15044534617" title="Call Us" onClick={handleLinkClick} onMouseEnter={handleLinkHover}>
              <Phone size={22} strokeWidth={1.5} />
            </a>
          )}
          
          <button 
            onClick={() => { toggleAudio(); playClickPulse(); }} 
            onMouseEnter={handleLinkHover}
            className="audio-toggle-btn" 
            title="Toggle Sound" 
          >
            {isEnabled ? <Volume2 size={22} strokeWidth={1.5} /> : <VolumeX size={22} strokeWidth={1.5} />}
          </button>
        </nav>
        
        {!isMobile && (
          <a href="tel:+15044534617" className="nav-cta" onClick={handleLinkClick} onMouseEnter={handleLinkHover}>
            <span className="nav-cta-text">Let's Talk</span>
            <Phone className="nav-cta-icon" size={18} strokeWidth={2} />
          </a>
        )}
      </header>
    </div>
  );
};

export default Header;
