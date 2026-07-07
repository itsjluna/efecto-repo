import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const AudioContextData = createContext(null);

export const useAudio = () => useContext(AudioContextData);

export const AudioProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const audioCtx = useRef(null);

  // Initialize Web Audio API on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.current.state === 'suspended') {
        audioCtx.current.resume();
      }
    };

    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('keydown', initAudio, { once: true });
    
    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
    };
  }, []);

  const createOscillator = (freq, type, duration, gainValue = 0.1) => {
    if (!isEnabled || !audioCtx.current) return;
    
    const osc = audioCtx.current.createOscillator();
    const gainNode = audioCtx.current.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
    
    // PS3 style ambient soft attack and release
    gainNode.gain.setValueAtTime(0, audioCtx.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(gainValue, audioCtx.current.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.current.destination);
    
    osc.start();
    osc.stop(audioCtx.current.currentTime + duration);
  };

  const playHoverChime = () => {
    // Airy, high frequency sine wave for hover (like sliding across XMB icons)
    createOscillator(880, 'sine', 0.4, 0.03); // A5
  };

  const playClickPulse = () => {
    // Soft, airy ambient droplet for click (PS3 XMB style)
    createOscillator(1200, 'sine', 0.15, 0.04); 
    setTimeout(() => createOscillator(1600, 'sine', 0.2, 0.02), 40); 
  };

  const playSuccessTrill = () => {
    // Ascending arpeggio for success
    const now = audioCtx.current ? audioCtx.current.currentTime : 0;
    if (!isEnabled || !audioCtx.current) return;

    [440, 554.37, 659.25, 880].forEach((freq, i) => {
      setTimeout(() => {
        createOscillator(freq, 'sine', 1.0, 0.04);
      }, i * 80);
    });
  };

  const toggleAudio = () => setIsEnabled(prev => !prev);

  return (
    <AudioContextData.Provider value={{ isEnabled, toggleAudio, playHoverChime, playClickPulse, playSuccessTrill }}>
      {children}
    </AudioContextData.Provider>
  );
};
