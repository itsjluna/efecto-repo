import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AudioContextData = createContext(null);

export const useAudio = () => useContext(AudioContextData);

const CHORD_MAP = {
  '/': [130.81, 196.00, 261.63, 392.00], 
  '/portfolio': [174.61, 220.00, 261.63, 329.63], 
  '/marketing': [220.00, 261.63, 293.66, 392.00], 
  '/photography': [196.00, 246.94, 293.66, 440.00],
  '/weddings': [261.63, 329.63, 392.00, 523.25] // C Major (romantic, bright, calm)
};

export const AudioProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const audioCtx = useRef(null);
  const ambientMasterRef = useRef(null);
  const muteNodeRef = useRef(null);
  const reverbNodeRef = useRef(null);
  const echoDelayRef = useRef(null);
  const pingIntervals = useRef([null, null]);
  const swellIntervals = useRef([null, null]);
  const droneRef = useRef({ oscs: [], filter: null });
  const location = useLocation();
  const seqStates = useRef([
    { notesLeftInPhrase: 0, lastNoteIndex: 0 },
    { notesLeftInPhrase: 0, lastNoteIndex: 0 }
  ]);

  useEffect(() => {
    const initAudio = () => {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
        
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

        const muteNode = audioCtx.current.createGain();
        muteNode.gain.value = 1.0;
        muteNodeRef.current = muteNode;

        ambientMasterRef.current.connect(masterFilter);
        masterFilter.connect(muteNode);
        muteNode.connect(limiter);
        limiter.connect(audioCtx.current.destination);

        reverbNodeRef.current = createReverb(audioCtx.current);
        reverbNodeRef.current.output.connect(ambientMasterRef.current);

        const echo = audioCtx.current.createDelay(2.0);
        echo.delayTime.value = 0.85; 
        
        const echoFeedback = audioCtx.current.createGain();
        echoFeedback.gain.value = 0.45; 
        
        const echoFilter = audioCtx.current.createBiquadFilter();
        echoFilter.type = 'lowpass';
        echoFilter.frequency.value = 1500; 
        
        echo.connect(echoFilter);
        echoFilter.connect(echoFeedback);
        echoFeedback.connect(echo);
        
        echo.connect(reverbNodeRef.current.input);
        echoDelayRef.current = echo;

        startGenerativeEngine();
      }
      if (audioCtx.current.state === 'suspended') {
        audioCtx.current.resume();
      }
    };

    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('keydown', initAudio, { once: true });
    window.addEventListener('touchstart', initAudio, { once: true, passive: true });
    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
      window.removeEventListener('touchstart', initAudio);
    };
  }, []);

  const createReverb = (ctx) => {
    const input = ctx.createGain();
    const output = ctx.createGain();
    
    const delays = [0.0297, 0.0371, 0.0411, 0.0437];
    const feedbacks = [0.62, 0.58, 0.55, 0.5]; 

    delays.forEach((dTime, i) => {
      const delay = ctx.createDelay(1.0);
      delay.delayTime.value = dTime;
      
      const feedback = ctx.createGain();
      feedback.gain.value = feedbacks[i];
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 900; 
      
      input.connect(delay);
      delay.connect(filter);
      filter.connect(feedback);
      feedback.connect(delay);
      
      delay.connect(output);
    });
    
    input.connect(output);
    return { input, output };
  };

  const startDrone = () => {
    const ctx = audioCtx.current;
    if (!ctx) return;
    
    const chord = CHORD_MAP[window.location.pathname] || CHORD_MAP['/'];
    const root = chord[0] / 4; // deep octave

    const droneGain = ctx.createGain();
    droneGain.gain.value = 0;
    droneGain.gain.setTargetAtTime(0.05, ctx.currentTime, 4.0);

    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = 400;

    [0, 7].forEach(detune => { 
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = root;
      osc.detune.value = detune;
      osc.connect(droneFilter);
      osc.start();
      droneRef.current.oscs.push(osc);
    });

    // Slow filter LFO for movement ("breathing")
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.02; // ~50s cycle
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 150;
    
    lfo.connect(lfoGain);
    lfoGain.connect(droneFilter.frequency);
    lfo.start();

    droneFilter.connect(droneGain);
    droneGain.connect(ambientMasterRef.current);
    droneRef.current.filter = droneFilter;
  };

  const startGenerativeEngine = () => {
    // Layer 0 (Primary)
    triggerPing(0);
    triggerSwell(0);
    
    // Layer 1 (Secondary, offset to create polyrhythmic depth)
    setTimeout(() => triggerPing(1), 3200);
    setTimeout(() => triggerSwell(1), 7500);

    startDrone();
    if (audioCtx.current) {
      ambientMasterRef.current.gain.setTargetAtTime(1.0, audioCtx.current.currentTime, 3.0);
    }
  };

  const triggerSwell = (layer = 0) => {
    if (!audioCtx.current) return;
    
    if (isEnabled) {
      const ctx = audioCtx.current;
      const currentChord = CHORD_MAP[window.location.pathname] || CHORD_MAP['/'];
      const isWeddings = window.location.pathname === '/weddings';
      
      const root = currentChord[0] / 2;
      const fifth = currentChord[1] / 2;
      
      [root, fifth].forEach((freq, index) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine'; 
        osc.frequency.value = freq;
        
        const panner = ctx.createStereoPanner();
        panner.pan.value = index === 0 ? -0.2 : 0.2;
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.03 * (isWeddings ? 0.6 : 1.0), ctx.currentTime + (isWeddings ? 6.0 : 4.0)); 
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (isWeddings ? 16.0 : 12.0)); 
        
        osc.connect(panner);
        panner.connect(gain);
        
        if (reverbNodeRef.current) {
           gain.connect(reverbNodeRef.current.input);
        }
        
        osc.start();
        osc.stop(ctx.currentTime + 12.0);
        osc.onended = () => {
          osc.disconnect();
          panner.disconnect();
          gain.disconnect();
        };
      });
    }

    const isWeddings = window.location.pathname === '/weddings';
    const nextTime = (8000 + (Math.random() * 6000)) * (isWeddings ? 2.0 : 1.0);
    clearTimeout(swellIntervals.current[layer]);
    swellIntervals.current[layer] = setTimeout(() => triggerSwell(layer), nextTime);
  };

  const playGenerativeNote = (ctx, freq, decayTime = 4.0, volume = 0.06) => {
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + decayTime);

    // Gentle per-note lowpass so higher octaves don't sound glassy/harsh
    const voiceFilter = ctx.createBiquadFilter();
    voiceFilter.type = 'lowpass';
    voiceFilter.frequency.value = freq < 800 ? 6000 : 3200;
    voiceFilter.Q.value = 0.3;

    // Unison: 2 detuned oscillators, panned apart, for warmth/width
    const detunes = [-6, 6]; 
    const pans = [-0.35, 0.35];
    
    detunes.forEach((cents, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.detune.value = cents;

      const panner = ctx.createStereoPanner();
      panner.pan.value = pans[i];

      osc.connect(panner);
      panner.connect(voiceFilter);
      osc.start();
      osc.stop(ctx.currentTime + decayTime);
      osc.onended = () => { 
        osc.disconnect(); 
        panner.disconnect(); 
      };
    });

    voiceFilter.connect(gain);
    
    if (reverbNodeRef.current) gain.connect(reverbNodeRef.current.input);
    if (echoDelayRef.current) gain.connect(echoDelayRef.current);
  };

  const triggerPing = (layer = 0) => {
    if (!audioCtx.current) return;
    
    const ctx = audioCtx.current;
    const currentChord = CHORD_MAP[window.location.pathname] || CHORD_MAP['/'];
    const maxIndex = currentChord.length - 1;
    const state = seqStates.current[layer];
    
    if (state.notesLeftInPhrase <= 0) {
      state.notesLeftInPhrase = Math.floor(Math.random() * 3) + 2; 
    }

    let nextIndex = state.lastNoteIndex;
    if (Math.random() < 0.7) {
       const step = Math.random() > 0.5 ? 1 : -1;
       nextIndex += step;
       if (nextIndex < 0) nextIndex = 1;
       if (nextIndex > maxIndex) nextIndex = maxIndex - 1;
    } else {
       nextIndex = Math.floor(Math.random() * currentChord.length);
    }
    
    state.lastNoteIndex = nextIndex;
    const baseNote = currentChord[nextIndex];

    const multipliers = [1, 2, 2, 4];
    const octaveMultiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
    const freq = baseNote * octaveMultiplier;

    const isWeddings = window.location.pathname === '/weddings';
    const volMultiplier = isWeddings ? 0.6 : 1.0;

    if (isEnabled) {
      playGenerativeNote(ctx, freq, 4.0, 0.06 * volMultiplier);

      if (Math.random() < 0.2) {
         const clusterFreq = freq * (Math.random() > 0.5 ? 1.5 : 2); 
         playGenerativeNote(ctx, clusterFreq, 5.0, 0.03 * volMultiplier); 
      }
    }
    
    state.notesLeftInPhrase -= 1;
    
    let nextTime;
    if (state.notesLeftInPhrase > 0) {
      nextTime = 1200 + (Math.random() * 1500); 
    } else {
      nextTime = 6000 + (Math.random() * 6000); 
    }
    nextTime *= (isWeddings ? 1.8 : 1.0);

    clearTimeout(pingIntervals.current[layer]);
    pingIntervals.current[layer] = setTimeout(() => triggerPing(layer), nextTime);
  };

  useEffect(() => {
    if (audioCtx.current && muteNodeRef.current) {
      const now = audioCtx.current.currentTime;
      muteNodeRef.current.gain.cancelScheduledValues(now);
      muteNodeRef.current.gain.setValueAtTime(muteNodeRef.current.gain.value, now);
      if (isEnabled) {
        muteNodeRef.current.gain.linearRampToValueAtTime(1.0, now + 1.0);
      } else {
        muteNodeRef.current.gain.linearRampToValueAtTime(0.0, now + 0.1);
      }
    }
  }, [isEnabled]);

  // React to route changes: glide drone root + retrigger a swell
  useEffect(() => {
    if (!audioCtx.current || !droneRef.current.oscs.length) return;
    const chord = CHORD_MAP[location.pathname] || CHORD_MAP['/'];
    const newRoot = chord[0] / 4;
    droneRef.current.oscs.forEach(osc =>
      osc.frequency.setTargetAtTime(newRoot, audioCtx.current.currentTime, 3.0)
    );
    triggerSwell(0);
    triggerSwell(1);
  }, [location.pathname]);

  const createOscillator = (freq, type, duration, gainValue = 0.1) => {
    if (!isEnabled || !audioCtx.current) return;
    
    // Duck the ambient music temporarily (Sidechain compression effect)
    if (ambientMasterRef.current) {
      const now = audioCtx.current.currentTime;
      ambientMasterRef.current.gain.cancelScheduledValues(now);
      ambientMasterRef.current.gain.setValueAtTime(ambientMasterRef.current.gain.value, now);
      ambientMasterRef.current.gain.linearRampToValueAtTime(0.4, now + 0.05);
      ambientMasterRef.current.gain.linearRampToValueAtTime(1.0, now + duration + 0.5);
    }
    
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
    osc.onended = () => {
      osc.disconnect();
      gainNode.disconnect();
    };
  };

  const playHoverChime = () => createOscillator(880, 'sine', 0.4, 0.06);

  const playClickPulse = () => {
    createOscillator(1200, 'sine', 0.15, 0.08); 
    setTimeout(() => createOscillator(1600, 'sine', 0.2, 0.04), 40); 
  };

  const playSuccessTrill = () => {
    if (!isEnabled || !audioCtx.current) return;
    [440, 554.37, 659.25, 880].forEach((freq, i) => {
      setTimeout(() => {
        createOscillator(freq, 'sine', 1.0, 0.08);
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


