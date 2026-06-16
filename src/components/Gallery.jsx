import React, { useEffect, useRef } from 'react';
import './Gallery.css';

const Gallery = ({ items }) => {
  const galleryRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = document.querySelectorAll('.gallery-item');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  // Items are now passed via props

  return (
    <section id="gallery" className="gallery-section section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Techy Y2K floating geometric glass shapes */}
      <div className="tech-shape tech-ring-1"></div>
      <div className="tech-shape tech-pill-1"></div>
      
      <div className="container">
        <div className="gallery-header slide-up">
          <h2>Selected Works</h2>
          <p>A curated selection of our recent photography projects.</p>
        </div>
        
        <div className="gallery-grid" ref={galleryRef}>
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className={`gallery-item item-${item.size} ${item.type === 'text' ? 'text-block' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate rotation (max 10 degrees)
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
              }}
            >
              {item.type === 'image' ? (
                <>
                  <div className="img-placeholder">
                    <img 
                      src={item.src} 
                      alt={item.title} 
                      className="gallery-image" 
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="placeholder-content">IMAGE_{item.id}</div>
                  </div>
                  <div className="item-overlay">
                    <span>{item.title}</span>
                  </div>
                </>
              ) : (
                <div className="text-content-block">
                  <h3>{item.title}</h3>
                  <p>{item.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
