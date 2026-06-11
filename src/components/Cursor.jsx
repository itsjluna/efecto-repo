import React, { useEffect, useState } from 'react';
import './Cursor.css';

const Cursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div 
      className={`custom-cursor ${clicked ? 'clicked' : ''} ${hovered ? 'hovered' : ''}`}
      style={{ 
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` 
      }}
    >
      <svg className="cursor-svg" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        {/* A rounded triangle path */}
        <path 
          d="M12 2L2 20H22L12 2Z" 
          strokeLinejoin="round" 
        />
      </svg>
    </div>
  );
};

export default Cursor;
