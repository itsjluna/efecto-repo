import React, { useEffect, useRef } from 'react';
import './Contact.css';

const Contact = () => {
  const formRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.2 }
    );

    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact-form" className="contact-section section-padding container">
      <div className="contact-grid" ref={formRef}>
        <div className="contact-text">
          <h2>Let's create something extraordinary.</h2>
          <p>
            Ready to elevate your brand's visual identity? Fill out the form, 
            and our team will be in touch within 24 hours.
          </p>
        </div>
        <div className="contact-form-wrapper">
          <form className="main-contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" placeholder="Jane Doe" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="jane@company.com" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Project Details</label>
              <textarea id="message" rows="5" placeholder="Tell us about your visual needs..." required></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-submit">Submit Request</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
