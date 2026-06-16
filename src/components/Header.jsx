import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Image, Mail } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

  return (
    <div className={`header-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <header className="header">
        {!isMobile && <Link to="/" className="logo">EFECTO</Link>}
        
        <nav className="nav-links">
          <Link to="/" title="Home">
            {isMobile ? <Home size={22} strokeWidth={1.5} /> : 'Home'}
          </Link>
          <Link to="/portfolio" title="Portfolio">
            {isMobile ? <Image size={22} strokeWidth={1.5} /> : 'Portfolio'}
          </Link>
          <a href="#contact" title="Contact">
            {isMobile ? <Mail size={22} strokeWidth={1.5} /> : 'Contact'}
          </a>
        </nav>
        
        {!isMobile && (
          <a href="#contact" className="nav-cta">
            Let's Talk
          </a>
        )}
      </header>
    </div>
  );
};

export default Header;
