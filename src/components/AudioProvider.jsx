import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AudioContextData = createContext(null);

export const useAudio = () => useContext(AudioContextData);

const CHORD_MAP = {
  '/': [130.81, 196.00, 261.63, 392.00], // Csus2 notes (C3, G3, C4, G4)
  '/portfolio': [174.61, 220.00, 261.63, 329.63], // Fmaj9 notes (F3, A3, C4, E4)
  '/marketing': [220.00, 261.63, 293.66, 392.00], // Am11 notes (A3, C4, D4, G4)
  '/photography': [196.00, 246.94, 293.66, 440.00] // G6/9 notes (G3, B3, D4, A4)
};

export const AudioProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const audioCtx = useRef(null);
  const ambientMasterRef = useRef(null);
  const reverbNodeRef = useRef(null);
  const droneOscRef = useRef(null);
  const pingIntervalRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const initAudio = () => {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
        
        // Master Gain
        ambientMasterRef.current = audioCtx.current.createGain();
        ambientMasterRef.current.gain.value = 0; 

        const masterFilter = audioCtx.current.createBiquadFilter();
        masterFilter.type = 'lowpass';
        masterFilter.frequency.value = 4000;

        const limiter = audioCtx.current.createDynamicsCompressor();
        limiter.threshold.value = -12;
        limiter.ratio.value = 12;
        limiter.attack.value = 0.003;
        limiter.release.value = 0.25;

        ambientMasterRef.current.connect(masterFilter);
        masterFilter.connect(limiter);
        limiter.connect(audioCtx.current.destination);

        // Schroeder Reverb
        reverbNodeRef.current = createReverb(audioCtx.current);
        reverbNodeRef.current.output.connect(ambientMasterRef.current);

        startGenerativeEngine();
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

  const createReverb = (ctx) => {
    const input = ctx.createGain();
    const output = ctx.createGain();
    
    // Schroeder delays (prime-ish)
    const delays = [0.0297, 0.0371, 0.0411, 0.0437];
    // Long feedback for huge space
    const feedbacks = [0.62, 0.58, 0.55, 0.5]; 

    delays.forEach((dTime, i) => {
      const delay = ctx.createDelay(1.0);
      delay.delayTime.value = dTime;
      
      const feedback = ctx.createGain();
      feedback.gain.value = feedbacks[i];
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 900; // Dampen highs for smoother tail
      
      input.connect(delay);
      delay.connect(filter);
      filter.connect(feedback);
      feedback.connect(delay);
      
      delay.connect(output);
    });
    
    // Dry signal mix
    input.connect(output);
    
    return { input, output };
  };

  const startGenerativeEngine = () => {
    const ctx = audioCtx.current;
    
    // 1. The Sub-Drone (Foundation)
    const drone = ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.value = 65.41; // Deep C2
    
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0; // modulated by LFO
    
    const droneOffset = ctx.createConstantSource();
    droneOffset.offset.value = 0.1; // base drone level
    droneOffset.connect(droneGain.gain);
    droneOffset.start();
    
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.05; // 20-second cycle
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.06; // now swings 0.04-0.16, always positive
    
    lfo.connect(lfoGain);
    lfoGain.connect(droneGain.gain);
    
    drone.connect(droneGain);
    droneGain.connect(ambientMasterRef.current); // Drone bypasses reverb to stay clean
    
    drone.start();
    lfo.start();
    droneOscRef.current = drone;

    // 2. The Ping Sequencer
    triggerPing();
    
    if (isEnabled) {
      ambientMasterRef.current.gain.setTargetAtTime(1.0, ctx.currentTime, 3.0);
    }
  };

  const triggerPing = () => {
    if (!audioCtx.current || !isEnabled) return;
    
    const ctx = audioCtx.current;
    const currentChord = CHORD_MAP[window.location.pathname] || CHORD_MAP['/'];
    
    // Random note from chord, spread across octaves
    const note = currentChord[Math.floor(Math.random() * currentChord.length)];
    const multipliers = [1, 2, 2, 4];
    const octaveMultiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
    const freq = note * octaveMultiplier;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    const gain = ctx.createGain();
    // Fast attack, very slow exponential decay (striking glass)
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.0);
    
    osc.connect(gain);
    
    // Connect ping to Reverb input
    if (reverbNodeRef.current) {
       gain.connect(reverbNodeRef.current.input);
    }

    osc.start();
    osc.stop(ctx.currentTime + 4.0);
    
    // Schedule next ping (Maximum minimalism: 4 to 8 seconds)
    const nextTime = 4000 + (Math.random() * 4000);
    pingIntervalRef.current = setTimeout(triggerPing, nextTime);
  };

  useEffect(() => {
    if (audioCtx.current && ambientMasterRef.current) {
      if (isEnabled) {
        ambientMasterRef.current.gain.setTargetAtTime(1.0, audioCtx.current.currentTime, 2.0);
      } else {
        ambientMasterRef.current.gain.setTargetAtTime(0.001, audioCtx.current.currentTime, 2.0);
      }
    }
  }, [isEnabled]);

  // Route change: Glide drone to new root note
  useEffect(() => {
    if (!droneOscRef.current || !audioCtx.current) return;
    const chord = CHORD_MAP[location.pathname] || CHORD_MAP['/'];
    droneOscRef.current.frequency.setTargetAtTime(chord[0] / 2, audioCtx.current.currentTime, 2.0);
  }, [location.pathname]);

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
