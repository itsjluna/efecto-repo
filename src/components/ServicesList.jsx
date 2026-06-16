import React, { useEffect, useRef, useState } from 'react';
import './ServicesList.css';

const ServicesList = ({ services, title = "OUR SERVICES" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="services-kinetic-section container section-padding">
      <div className={`services-kinetic-header ${isVisible ? 'fade-in' : ''}`}>
        <h3 className="section-subtitle">{title}</h3>
      </div>
      
      <div className="services-kinetic-list">
        {services.map((service, index) => (
          <div 
            key={index} 
            className={`kinetic-item-wrapper ${isVisible ? 'slide-in' : ''}`}
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            <div className="kinetic-service-item">
              <span className="kinetic-text">{service}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesList;
