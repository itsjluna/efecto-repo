import React, { useEffect, useRef, useState } from 'react';
import './Contact.css';

const Contact = () => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'Project Inquiry' })
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

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
          <form className="main-contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" placeholder="Jane Doe" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="jane@company.com" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Project Details</label>
              <textarea id="message" rows="5" placeholder="Tell us about your visual needs..." value={formData.message} onChange={handleChange} required></textarea>
            </div>
            
            {status === 'success' && <p style={{ color: '#00ff88', marginBottom: '1rem', fontSize: '0.9rem' }}>Message sent successfully! We'll be in touch soon.</p>}
            {status === 'error' && <p style={{ color: '#ff4444', marginBottom: '1rem', fontSize: '0.9rem' }}>Something went wrong. Please try again later.</p>}
            
            <button type="submit" className="btn btn-primary btn-submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending Request...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
