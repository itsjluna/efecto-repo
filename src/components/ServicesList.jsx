import React, { useEffect, useRef, useState } from 'react';
import './ServicesList.css';

const MarqueeTrack = ({ items, speed, direction, isGlobalPaused, setGlobalPaused }) => {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const xPos = useRef(0);
  const animationRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const isTransitioning = useRef(false);

  useEffect(() => {
    // Determine a random starting position so tracks don't align statically
    // But since it relies on layout, we'll just start at 0 and let them move.
    
    const loop = () => {
      if (!isGlobalPaused && !isTransitioning.current) {
        xPos.current += speed * direction;
        
        const track = trackRef.current;
        if (track) {
          // scrollWidth / 2 gives us the width of exactly ONE set of the repeated content
          // since we duplicated it 4 times, actually scrollWidth / 2 is 2 sets.
          // Wait, if we duplicate 4 times, scrollWidth is 4x. We want to wrap seamlessly.
          // We can wrap when we traverse 1/4th of the scrollWidth.
          const contentWidth = track.scrollWidth / 4;
          
          if (direction === -1 && Math.abs(xPos.current) >= contentWidth) {
            // Reset to 0 seamlessly
            xPos.current += contentWidth;
          } else if (direction === 1 && xPos.current > 0) {
            // Reset backwards seamlessly
            xPos.current -= contentWidth;
          }
          
          track.style.transform = `translateX(${xPos.current}px)`;
        }
      }
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [speed, direction, isGlobalPaused]);

  const handleMouseEnter = (e) => {
    setGlobalPaused(true);
    setIsHovered(true);
    isTransitioning.current = true;

    // Calculate exact centering distance
    const itemRect = e.currentTarget.getBoundingClientRect();
    
    // Center of the screen
    const screenCenter = window.innerWidth / 2;
    // Current center of the hovered item
    const itemCenter = itemRect.left + itemRect.width / 2;
    
    // Offset needed to bring the item's center to the screen's center
    const deltaX = screenCenter - itemCenter;
    
    // Apply offset to tracking variable
    xPos.current += deltaX;
    
    const track = trackRef.current;
    if (track) {
      // Smoothly animate to the center
      track.style.transition = 'transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
      track.style.transform = `translateX(${xPos.current}px)`;
      
      // Remove transition after it completes so RAF can take over instantly later
      setTimeout(() => {
        if (track) track.style.transition = 'none';
      }, 600);
    }
  };

  const handleMouseLeave = () => {
    setGlobalPaused(false);
    setIsHovered(false);
    isTransitioning.current = false;
  };

  // Duplicate the array 4 times to ensure it's wide enough for a seamless loop on 4k screens
  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="marquee-container" ref={containerRef}>
      <div 
        className={`marquee-track ${isGlobalPaused && !isHovered ? 'dimmed' : ''}`} 
        ref={trackRef}
        style={{ transform: `translateX(${xPos.current}px)` }}
      >
        {repeatedItems.map((item, idx) => (
          <div 
            key={idx} 
            className="marquee-item"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="marquee-text">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ServicesList = ({ services, id = "services" }) => {
  const [isGlobalPaused, setGlobalPaused] = useState(false);
  
  // Split the services array into two asymmetrical tracks
  const mid = Math.ceil(services.length / 2);
  const row1 = services.slice(0, mid);
  const row2 = services.slice(mid);

  return (
    <section id={id} className="marquee-glass-section">
      <div className="marquee-glass-container">
        <MarqueeTrack 
          items={row1} 
          speed={1.5} 
          direction={-1} 
          isGlobalPaused={isGlobalPaused} 
          setGlobalPaused={setGlobalPaused} 
        />
        <MarqueeTrack 
          items={row2} 
          speed={1.0} 
          direction={1} 
          isGlobalPaused={isGlobalPaused} 
          setGlobalPaused={setGlobalPaused} 
        />
      </div>
    </section>
  );
};

export default ServicesList;
