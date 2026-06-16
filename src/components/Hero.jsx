import React, { useEffect, useState } from 'react';
import './Hero.css';

const Hero = ({ title, subtitle, info }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="hero">
      <div className="container section-padding">
        <div className={`hero-content ${loaded ? 'animate-in' : ''}`}>
          <div className="hero-logo-placeholder slide-up-1">
            <h1>{title}</h1>
          </div>
          
          <h2 className="hero-subtitle slide-up-2">
            {subtitle}
          </h2>
          
          <p className="hero-info slide-up-3">
            {info}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
