import React, { useEffect, useState } from 'react';
import './Cursor.css';

const Cursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  useEffect(() => {
    const checkIsDesktop = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', checkIsDesktop);

    if (!isDesktop) return; // Don't attach listeners on mobile

    const moveCursor = (e) => {
      if (!visible) setVisible(true);
      setPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    
    // Check if hovering over clickable elements
    const handleMouseOver = (e) => {
      const isClickable = 
        e.target.tagName.toLowerCase() === 'a' || 
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.tagName.toLowerCase() === 'input' ||
        e.target.closest('a') || 
        e.target.closest('button') || 
        e.target.closest('.gallery-item');
        
      setHovered(!!isClickable);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('resize', checkIsDesktop);
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [visible, isDesktop]);

  if (!isDesktop || !visible) return null;

  return (
    <div 
      className={`custom-cursor ${clicked ? 'clicked' : ''} ${hovered ? 'hovered' : ''}`}
      style={{ 
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` 
      }}
    >
      <div className="cursor-sphere"></div>
    </div>
  );
};

export default Cursor;
