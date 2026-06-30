import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Image, Mail, Phone, Sparkles } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();

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

  return (
    <div className={`header-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <header className="header">
        {!isMobile && <Link to="/" className="logo">EFECTO</Link>}
        
        <nav className="nav-links">
          {isMobile && (
            <Link to="/" title="Main Menu">
              <Home size={22} strokeWidth={1.5} />
            </Link>
          )}
          
          <a href={isPortfolio ? "#partners" : "#services"} title={isPortfolio ? "Partners" : "Services"}>
            {isMobile ? <Sparkles size={22} strokeWidth={1.5} /> : (isPortfolio ? 'Partners' : 'Services')}
          </a>
          
          <a href="#gallery" title={isPortfolio ? "Archive" : "Gallery"}>
            {isMobile ? <Image size={22} strokeWidth={1.5} /> : (isPortfolio ? 'Archive' : 'Gallery')}
          </a>
          
          <a href="#contact" title="Contact">
            {isMobile ? <Mail size={22} strokeWidth={1.5} /> : 'Contact'}
          </a>

          {isMobile && (
            <a href="tel:+15044534617" title="Call Us">
              <Phone size={22} strokeWidth={1.5} />
            </a>
          )}
        </nav>
        
        {!isMobile && (
          <a href="tel:+15044534617" className="nav-cta">
            Let's Talk
          </a>
        )}
      </header>
    </div>
  );
};

export default Header;
