import React, { useEffect, useRef, useState } from 'react';
import './Gallery.css';

const ProgressiveImage = ({ src, alt, title, id }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <div className={`img-placeholder ${isLoaded ? 'loaded' : ''}`}>
        <div className="placeholder-content">IMAGE_{id}</div>
      </div>
      <img 
        src={src} 
        alt={alt} 
        className={`gallery-image ${isLoaded ? 'loaded' : ''}`} 
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          e.target.style.display = 'none';
          if (e.target.previousSibling) {
            e.target.previousSibling.classList.remove('loaded');
          }
        }}
      />
      <div className="item-overlay">
        <span>{title}</span>
      </div>
    </>
  );
};

const Gallery = ({ items }) => {
  const galleryRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            // Unobserve to prevent animations re-firing unnecessarily
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Filter out nulls and observe valid DOM nodes
    const validRefs = itemRefs.current.filter(Boolean);
    validRefs.forEach((item) => observer.observe(item));

    return () => {
      validRefs.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, [items]);

  return (
    <section id="gallery" className="gallery-section section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Techy Y2K floating geometric glass shapes */}
      <div className="tech-shape tech-ring-1"></div>
      <div className="tech-shape tech-pill-1"></div>
      
      <div className="container">
        <div className="gallery-header slide-up">
          <h2>Selected Works</h2>
          <p>A curated selection of our recent projects.</p>
        </div>
        
        <div className="gallery-grid" ref={galleryRef}>
          {items.map((item, index) => (
            <div 
              key={item.id} 
              ref={(el) => (itemRefs.current[index] = el)}
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
                <ProgressiveImage src={item.src} alt={item.title} title={item.title} id={item.id} />
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
