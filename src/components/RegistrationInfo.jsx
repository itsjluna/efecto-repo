import React, { useState } from 'react';
import { useAudio } from './AudioProvider';
import StatusModal from './StatusModal';
import './RegistrationInfo.css';

const RegistrationInfo = ({ title, desc, actionText = "Book a Session" }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const { playSuccessTrill, playClickPulse } = useAudio();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setStatus('loading');
    playClickPulse();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'Newsletter Subscription' })
      });

      if (!response.ok) throw new Error('Failed to subscribe');
      
      setStatus('success');
      playSuccessTrill();
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <>
      <StatusModal status={status} successMsg="Subscription established." errorMsg="Connection failed. Try again." />
      <section id="registration-info" className="registration-info-wrapper">
        <div className="registration-info section-padding container">
          <div className="info-grid">
            <div className="info-content">
              <h2>{title}</h2>
              <p>{desc}</p>
              <div className="contact-actions">
                <a href="#contact" className="btn btn-primary">{actionText}</a>
              </div>
            </div>
            
            <div className="registration-box">
              <h3>Stay Updated</h3>
              <p>Subscribe to our newsletter for the latest visual trends and exclusive offers.</p>
              <form className="email-form" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
                <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
                  {status === 'loading' ? '...' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegistrationInfo;
