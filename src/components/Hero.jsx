import React, { useEffect, useState } from 'react';
import './Hero.css';

const Hero = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="hero">
      <div className="container section-padding">
        <div className={`hero-content ${loaded ? 'animate-in' : ''}`}>
          <div className="hero-logo-placeholder slide-up-1">
            <h1>EFECTO AGENCY</h1>
          </div>
          
          <h2 className="hero-subtitle slide-up-2">
            ELEVATING VISUAL NARRATIVES
          </h2>
          
          <p className="hero-info slide-up-3">
            We are a premium photography agency dedicated to capturing striking imagery 
            for modern corporate environments. From structural minimalism to dynamic 
            portraits, our aesthetic defines the future of your brand.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
