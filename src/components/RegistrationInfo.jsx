import React from 'react';
import './RegistrationInfo.css';

const RegistrationInfo = () => {
  return (
    <section id="registration-info" className="registration-info-wrapper">
      <div className="registration-info section-padding container">
        <div className="info-grid">
          <div className="info-content">
            <h2>Efecto Photography Services</h2>
            <p>
              We capture the essence of your brand through high-end, dynamic, and corporate-ready photography. 
              From architectural documentation to executive portraits and dynamic lifestyle shoots, 
              our visual solutions are crafted to elevate your market presence.
            </p>
            <div className="contact-actions">
              <a href="#contact" className="btn btn-primary">Book a Session</a>
            </div>
          </div>
          
          <div className="registration-box">
            <h3>Stay Updated</h3>
            <p>Subscribe to our newsletter for the latest visual trends and exclusive offers.</p>
            <form className="email-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationInfo;
