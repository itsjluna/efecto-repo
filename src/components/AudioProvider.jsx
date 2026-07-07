import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const AudioContextData = createContext(null);

export const useAudio = () => useContext(AudioContextData);

export const AudioProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const audioCtx = useRef(null);
  const ambientMasterRef = useRef(null);
  const scrollFilterRef = useRef(null);
  const oscRefs = useRef([]);

  // Initialize Web Audio API on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
        
        // Setup Ambient Engine
        ambientMasterRef.current = audioCtx.current.createGain();
        ambientMasterRef.current.gain.value = 0; // Start silent
        ambientMasterRef.current.connect(audioCtx.current.destination);

        scrollFilterRef.current = audioCtx.current.createBiquadFilter();
        scrollFilterRef.current.type = 'lowpass';
        scrollFilterRef.current.frequency.value = 250; // Initial dark, muffled sound
        scrollFilterRef.current.Q.value = 2; // Slight resonance for glassiness
        scrollFilterRef.current.connect(ambientMasterRef.current);

        // Start Oscillators
        startAmbientDrone();
      }
      if (audioCtx.current.state === 'suspended') {
        audioCtx.current.resume();
      }
    };

    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('keydown', initAudio, { once: true });
    window.addEventListener('scroll', initAudio, { once: true }); // Also trigger on scroll
    
    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
      window.removeEventListener('scroll', initAudio);
    };
  }, []);

  const startAmbientDrone = () => {
    if (!audioCtx.current || !scrollFilterRef.current) return;

    // Osc 1: Deep fundamental (A2)
    const osc1 = audioCtx.current.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 110.00; 

    // Osc 2: Slightly detuned fundamental for beating effect (Movement/Water)
    const osc2 = audioCtx.current.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 111.5; 

    // Osc 3: High glassy shimmer (A4)
    const osc3 = audioCtx.current.createOscillator();
    osc3.type = 'triangle'; // Triangle provides more harmonics for the filter to sweep
    osc3.frequency.value = 440.00;

    // Mix them
    const mixGain = audioCtx.current.createGain();
    mixGain.gain.value = 0.15; // Keep it ambient and background

    osc1.connect(mixGain);
    osc2.connect(mixGain);
    osc3.connect(mixGain);
    
    mixGain.connect(scrollFilterRef.current);

    osc1.start();
    osc2.start();
    osc3.start();

    oscRefs.current = [osc1, osc2, osc3];

    // Fade in if enabled
    if (isEnabled) {
      ambientMasterRef.current.gain.setTargetAtTime(1.0, audioCtx.current.currentTime, 2.0); // 2 second fade in
    }
  };

  // Handle Mute Toggle Fade In/Out
  useEffect(() => {
    if (audioCtx.current && ambientMasterRef.current) {
      if (isEnabled) {
        ambientMasterRef.current.gain.setTargetAtTime(1.0, audioCtx.current.currentTime, 1.0);
      } else {
        ambientMasterRef.current.gain.setTargetAtTime(0.001, audioCtx.current.currentTime, 1.0);
      }
    }
  }, [isEnabled]);

  // Handle Scroll Modulation
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollFilterRef.current || !audioCtx.current) return;
      const scrollY = window.scrollY;
      
      // Calculate max scroll (can change if DOM changes, so we calculate live safely)
      const maxScroll = Math.max(
        document.body.scrollHeight - window.innerHeight, 
        1 // Prevent divide by zero
      );
      
      const scrollPercent = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      
      // Filter sweep: 250Hz (deep, muffled) to 2500Hz (bright, glassy)
      const minFreq = 250;
      const maxFreq = 2500;
      // Exponential curve feels more natural for audio frequencies
      const targetFreq = minFreq * Math.pow(maxFreq / minFreq, scrollPercent);
      
      // Smoothly glide to the new frequency to avoid zipper noise
      scrollFilterRef.current.frequency.setTargetAtTime(targetFreq, audioCtx.current.currentTime, 0.1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const createOscillator = (freq, type, duration, gainValue = 0.1) => {
    if (!isEnabled || !audioCtx.current) return;
    
    const osc = audioCtx.current.createOscillator();
    const gainNode = audioCtx.current.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
    
    gainNode.gain.setValueAtTime(0, audioCtx.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(gainValue, audioCtx.current.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.current.destination);
    
    osc.start();
    osc.stop(audioCtx.current.currentTime + duration);
  };

  const playHoverChime = () => {
    createOscillator(880, 'sine', 0.4, 0.03);
  };

  const playClickPulse = () => {
    // Soft, airy ambient droplet for click
    createOscillator(1200, 'sine', 0.15, 0.04); 
    setTimeout(() => createOscillator(1600, 'sine', 0.2, 0.02), 40); 
  };

  const playSuccessTrill = () => {
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
