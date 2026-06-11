import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="contact" className="footer container">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="logo-text">EFECTO AGENCY</span>
          <p className="footer-desc text-secondary">
            Elevating visual narratives for modern brands.
          </p>
        </div>

        <div className="footer-links">
          <div className="link-column">
            <a href="#registration-info">About Us</a>
            <a href="#gallery">Portfolio</a>
            <a href="#contact">Contact</a>
          </div>
          
          <div className="link-column">
            <span>contact@efecto.agency</span>
            <span>Texas, US</span>
            <span>+1 555 0199 42</span>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="copyright">
          &copy; 2026 Efecto Agency. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
