import React, { useState } from 'react';
import Hero from '../components/Hero';
import Gallery from '../components/Gallery';
import Footer from '../components/Footer';
import StatusModal from '../components/StatusModal';
import { useAudio } from '../components/AudioProvider';
import '../components/RegistrationInfo.css';
import '../components/Contact.css';

const weddingItems = [
  { id: 1, type: 'image', src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', size: 'large', title: 'The Ceremony' },
  { id: 2, type: 'image', src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', size: 'small', title: 'Intimate Moments' },
  { id: 't1', type: 'text', size: 'small', title: 'SPECIAL MOMENTS CAPTURED', content: 'Crafting pixel-perfect imagery that captures the raw emotion of your moments.' },
  { id: 3, type: 'image', src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', size: 'medium', title: 'The Details' },
  { id: 4, type: 'image', src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80', size: 'medium', title: 'The Celebration' },
  { id: 't2', type: 'text', size: 'small', title: 'FEATURED INSTANTS', content: 'Lenses that capture more than light; they capture pure emotion.' },
  { id: 't3', type: 'text', size: 'small', title: 'ETHEREAL PORTRAITS', content: 'Uncompromising attention to detail in every single frame.' },
  { id: 5, type: 'image', src: 'https://images.unsplash.com/photo-1532712938736-59c7ea0e2831?auto=format&fit=crop&w=1200&q=80', size: 'large', title: 'The Reception' },
  { id: 6, type: 'image', src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80', size: 'medium', title: 'Romantic Escapes' },
  { id: 't4', type: 'text', size: 'medium', title: 'ETHEREAL MEMORIES', content: 'Pushing the boundaries of modern visual storytelling.' },
  { id: 7, type: 'image', src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80', size: 'wide', title: 'The Journey' },
];

const Weddings = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const { playSuccessTrill, playClickPulse, playHoverChime } = useAudio();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    playClickPulse();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'Wedding Inquiry' })
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      setStatus('success');
      playSuccessTrill();
      setFormData({ name: '', email: '', message: '' });
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
    <>
      <StatusModal status={status} successMsg="Transmission complete. We will be in touch shortly." errorMsg="Signal disrupted. Please try again." />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero 
          title="ETHEREAL MEMORIES" 
          subtitle="WEDDING PHOTOGRAPHY BY EFECTO" 
          info="We capture light, emotion, and the raw beauty of your most important day." 
        />
        
        {/* Merged Contact Section using RegistrationInfo grid */}
        <section id="registration-info" className="registration-info-wrapper">
          <div className="registration-info section-padding container">
            <div className="info-grid">
              <div className="info-content">
                <h2>Your Story, Immortalized</h2>
                <p style={{marginBottom: '2rem'}}>
                  We believe your wedding day is a living, breathing work of art. 
                  Our approach combines avant-garde aesthetics with deeply emotional storytelling. 
                  We don't just document events; we capture the sensory experience, the fleeting glances, 
                  and the ethereal beauty of your celebration.
                </p>
                <p>Fill out the form to reserve your date and start crafting your visual legacy.</p>
              </div>
              
              <div className="registration-box" style={{textAlign: 'left'}}>
                <h3 style={{marginBottom: '1.5rem', fontSize: '1.5rem'}}>Reserve Your Date</h3>
                <form className="main-contact-form" onSubmit={handleSubmit}>
                  <div className="form-group" style={{marginBottom: '1.2rem'}}>
                    <label htmlFor="name" style={{display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', opacity: 0.7}}>Full Name</label>
                    <input type="text" id="name" placeholder="Jane & John Doe" value={formData.name} onChange={handleChange} required style={{width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#111', borderRadius: '8px'}} />
                  </div>
                  <div className="form-group" style={{marginBottom: '1.2rem'}}>
                    <label htmlFor="email" style={{display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', opacity: 0.7}}>Email Address</label>
                    <input type="email" id="email" placeholder="jane@wedding.com" value={formData.email} onChange={handleChange} required style={{width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#111', borderRadius: '8px'}}/>
                  </div>
                  <div className="form-group" style={{marginBottom: '1.5rem'}}>
                    <label htmlFor="message" style={{display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', opacity: 0.7}}>Wedding Details (Date, Venue, Vision)</label>
                    <textarea id="message" rows="4" placeholder="Tell us about your special day..." value={formData.message} onChange={handleChange} required style={{width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#111', borderRadius: '8px'}}></textarea>
                  </div>
                  
                  <button type="submit" className="btn btn-primary" disabled={status === 'loading'} style={{width: '100%'}} onMouseEnter={() => playHoverChime()}>
                    {status === 'loading' ? 'Sending Request...' : 'Submit Inquiry'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <div style={{ marginTop: '4rem' }}>
          <Gallery items={weddingItems} />
        </div>
        
        {/* Liquid Glass View Full Portfolio Button */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '4rem 0 8rem 0' }}>
          <a 
            href="https://efectophotography.pic-time.com/portfolio" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              display: 'inline-block',
              padding: '1.2rem 3.5rem', 
              fontSize: '1.1rem', 
              borderRadius: '100px', 
              background: 'rgba(255, 255, 255, 0.3)', 
              backdropFilter: 'blur(32px) saturate(180%)', 
              WebkitBackdropFilter: 'blur(32px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.6)', 
              color: '#000',
              textDecoration: 'none',
              fontWeight: '600',
              letterSpacing: '0.05em',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.45)';
              e.target.style.transform = 'scale(1.05)';
              playHoverChime();
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'scale(1)';
            }}
            onClick={() => playClickPulse()}
          >
            VIEW FULL WEDDING PORTFOLIO
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Weddings;
