import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AudioContextData = createContext(null);

export const useAudio = () => useContext(AudioContextData);

const CHORD_MAP = {
  '/': [65.41, 98.00, 146.83, 261.63], // Csus2 (Ethereal, open)
  '/portfolio': [87.31, 110.00, 130.81, 196.00], // Fmaj9 (Warm, nostalgic)
  '/marketing': [110.00, 130.81, 146.83, 196.00], // Am11 (Deep, focused)
  '/photography': [98.00, 123.47, 146.83, 220.00] // G6/9 (Bright, clear)
};

export const AudioProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const audioCtx = useRef(null);
  const ambientMasterRef = useRef(null);
  const scrollFilterRef = useRef(null);
  const oscRefs = useRef([]);
  const location = useLocation();

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
        scrollFilterRef.current.frequency.value = 250; 
        scrollFilterRef.current.Q.value = 1.5; 
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
    window.addEventListener('scroll', initAudio, { once: true }); 
    
    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
      window.removeEventListener('scroll', initAudio);
    };
  }, []);

  const startAmbientDrone = () => {
    if (!audioCtx.current || !scrollFilterRef.current) return;

    const currentChord = CHORD_MAP[window.location.pathname] || CHORD_MAP['/'];
    
    // We create 4 generative voices
    const voices = currentChord.map((freq, i) => {
      const osc = audioCtx.current.createOscillator();
      osc.type = i === 3 ? 'triangle' : 'sine'; // Highest note gets a triangle for glassy shimmer
      osc.frequency.value = freq;

      // LFO for volume swelling (non-repetitive breathing)
      const lfo = audioCtx.current.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.02 + (Math.random() * 0.05); // Very slow, random rate per voice (0.02 to 0.07 Hz)

      // LFO goes from -1 to 1, we scale it to 0 to 0.15 volume range
      const lfoGain = audioCtx.current.createGain();
      lfoGain.gain.value = 0.075; 
      lfo.connect(lfoGain);

      const voiceGain = audioCtx.current.createGain();
      voiceGain.gain.value = 0.075; // Base volume
      
      // Connect LFO output to voiceGain's gain parameter (modulates volume)
      lfoGain.connect(voiceGain.gain);

      osc.connect(voiceGain);
      voiceGain.connect(scrollFilterRef.current);

      osc.start();
      lfo.start();
      
      return osc;
    });

    oscRefs.current = voices;

    if (isEnabled) {
      ambientMasterRef.current.gain.setTargetAtTime(1.0, audioCtx.current.currentTime, 3.0); // 3 sec fade in
    }
  };

  // Handle Route Changes (Chord shifting)
  useEffect(() => {
    if (!audioCtx.current || oscRefs.current.length === 0) return;
    
    const targetChord = CHORD_MAP[location.pathname] || CHORD_MAP['/'];
    const now = audioCtx.current.currentTime;
    
    oscRefs.current.forEach((osc, i) => {
      if (targetChord[i]) {
        // Smoothly glide to the new note over 4 seconds
        osc.frequency.setTargetAtTime(targetChord[i], now, 2.0);
      }
    });
  }, [location.pathname]);

  // Handle Mute Toggle Fade In/Out
  useEffect(() => {
    if (audioCtx.current && ambientMasterRef.current) {
      if (isEnabled) {
        ambientMasterRef.current.gain.setTargetAtTime(1.0, audioCtx.current.currentTime, 1.5);
      } else {
        ambientMasterRef.current.gain.setTargetAtTime(0.001, audioCtx.current.currentTime, 1.5);
      }
    }
  }, [isEnabled]);

  // Handle Scroll Modulation
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollFilterRef.current || !audioCtx.current) return;
      const scrollY = window.scrollY;
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const scrollPercent = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      
      const minFreq = 250;
      const maxFreq = 3000;
      const targetFreq = minFreq * Math.pow(maxFreq / minFreq, scrollPercent);
      
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

  const playHoverChime = () => createOscillator(880, 'sine', 0.4, 0.03);

  const playClickPulse = () => {
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
