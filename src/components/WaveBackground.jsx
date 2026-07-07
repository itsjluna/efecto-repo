import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';

const PALETTES = {
  '/': { // Cold PS3 Liquid Glass
    base: new THREE.Color(0.0, 0.5, 0.9),
    accent: new THREE.Color(0.0, 0.9, 1.0),
    highlight: new THREE.Color(0.4, 0.1, 0.8)
  },
  '/photography': { // Warm Light & Darkroom
    base: new THREE.Color(0.7, 0.2, 0.05),
    accent: new THREE.Color(0.9, 0.5, 0.1),
    highlight: new THREE.Color(0.5, 0.05, 0.1)
  },
  '/marketing': { // Digital Energy
    base: new THREE.Color(0.05, 0.7, 0.3),
    accent: new THREE.Color(0.0, 0.9, 0.8),
    highlight: new THREE.Color(0.4, 0.9, 0.1)
  },
  '/portfolio': { // The Archival Void
    base: new THREE.Color(0.15, 0.05, 0.35),
    accent: new THREE.Color(0.3, 0.1, 0.6),
    highlight: new THREE.Color(0.6, 0.6, 0.75)
  }
};

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uLoadingPulse;
  uniform float uReveal;
  
  uniform vec3 uColorBase;
  uniform vec3 uColorAccent;
  uniform vec3 uColorHighlight;
  
  varying vec2 vUv;

  const float waveWidthFactor = 1.5;

  // We return the raw intensity here, so we can colorize it later
  float calcSine(
    vec2 uv,
    float speed,
    float frequency,
    float amplitude,
    float phaseShift,
    float verticalOffset,
    float lineWidth,
    float sharpness,
    bool invertFalloff
  ) {
    // Mouse influence: slightly pinch/bend the wave near the mouse cursor
    float mouseDist = distance(uv, uMouse);
    float mouseInfluence = smoothstep(0.4, 0.0, mouseDist) * 0.08;

    // Compute wave position
    float angle = uTime * speed * frequency * -1.0 + (phaseShift + uv.x) * 2.0;
    
    // Apply mouse influence to the amplitude, and use uReveal to slide down on load
    float revealOffset = (1.0 - uReveal) * 2.5; 
    float waveY = sin(angle) * (amplitude + mouseInfluence) + verticalOffset + revealOffset;
    
    // Calculate distance and delta for the asymmetric XMB glow falloff
    float deltaY = waveY - uv.y;
    float distanceVal = abs(deltaY);

    // Amplify falloff on one side to give it a sharp edge and a glowing tail
    if (invertFalloff) {
      if (deltaY > 0.0) {
        distanceVal = distanceVal * 4.0;
      }
    } else {
      if (deltaY < 0.0) {
        distanceVal = distanceVal * 4.0;
      }
    }

    float smoothVal = smoothstep(lineWidth * waveWidthFactor, 0.0, distanceVal);
    float scaleVal  = pow(smoothVal, sharpness);

    return scaleVal;
  }

  void main() {
    vec2 uv = vUv;

    float intensity = 0.0;
    
    intensity += calcSine(uv, 0.2, 0.20, 0.2, 0.0, 0.5, 0.1, 15.0, false) * 0.9;
    intensity += calcSine(uv, 0.4, 0.40, 0.15, 0.0, 0.5, 0.1, 17.0, false) * 0.8;
    intensity += calcSine(uv, 0.3, 0.60, 0.15, 0.0, 0.5, 0.05, 23.0, false) * 0.7;
    
    intensity += calcSine(uv, 0.1, 0.26, 0.07, 0.0, 0.3, 0.1, 17.0, true) * 1.0;
    intensity += calcSine(uv, 0.3, 0.36, 0.07, 0.0, 0.3, 0.1, 17.0, true) * 0.9;
    intensity += calcSine(uv, 0.5, 0.46, 0.07, 0.0, 0.3, 0.05, 23.0, true) * 0.8;
    intensity += calcSine(uv, 0.2, 0.58, 0.05, 0.0, 0.3, 0.2, 15.0, true) * 1.0;

    // Light glow beating effect while loading
    float glowPulse = 1.0 + (sin(uTime * 6.0) * 0.4 * uLoadingPulse);
    intensity *= glowPulse;

    // Dynamic cold color shift logic
    float colorShift = sin(uTime * 0.15 + uv.x * 2.0) * 0.5 + 0.5;
    vec3 waveColor = mix(uColorBase, uColorAccent, colorShift);
    
    // Add subtle highlight hues shifting at a different rate
    float highlightShift = cos(uTime * 0.1) * 0.5 + 0.5;
    waveColor = mix(waveColor, uColorHighlight, highlightShift * 0.5); 
    
    // The background color of the site is light (#f0f0f0 or white)
    vec3 bgColor = vec3(0.96, 0.96, 0.96); // Soft white/grey
    
    // We use the intensity to blend the wave color over the background.
    // We clamp intensity to 1.0 so it doesn't blow out.
    float alpha = clamp(intensity, 0.0, 1.0);
    
    vec3 finalColor = mix(bgColor, waveColor, alpha);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const WaveMaterial = ({ isAppLoading, onRevealComplete }) => {
  const materialRef = useRef();
  const hasRevealed = useRef(false);
  const location = useLocation();
  const speedBurst = useRef(1.0);
  const accumulatedTime = useRef(0);

  // Define uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) }, // Start at center
      uLoadingPulse: { value: 1.0 }, // Starts pulsing
      uReveal: { value: 0.0 }, // Starts hidden for transition
      uColorBase: { value: PALETTES['/'].base.clone() },
      uColorAccent: { value: PALETTES['/'].accent.clone() },
      uColorHighlight: { value: PALETTES['/'].highlight.clone() },
    }),
    []
  );

  const scrollY = useRef(0);
  const targetScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      targetScrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger speed burst on route changes
  useEffect(() => {
    speedBurst.current = 15.0; 
  }, [location.pathname]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      // Smoothly decay the speed burst back to normal
      if (speedBurst.current > 1.001) {
        speedBurst.current += (1.0 - speedBurst.current) * 0.08;
      }

      // Calculate accumulated time respecting the speed burst
      accumulatedTime.current += (delta * speedBurst.current);

      // Smooth scroll interpolation
      scrollY.current += (targetScrollY.current - scrollY.current) * 0.1;
      
      // Combine accumulated time with scroll parallax
      const time = accumulatedTime.current + (scrollY.current * 0.003);
      materialRef.current.uniforms.uTime.value = time;
      
      // Cinematic slide down reveal animation
      const currentReveal = materialRef.current.uniforms.uReveal.value;
      if (currentReveal < 0.999) {
        materialRef.current.uniforms.uReveal.value += (1.0 - currentReveal) * 0.025;
      }
      
      // Loading glow beating animation
      const targetPulse = isAppLoading ? 1.0 : 0.0;
      materialRef.current.uniforms.uLoadingPulse.value += (targetPulse - materialRef.current.uniforms.uLoadingPulse.value) * 0.05;
      
      // Trigger site reveal once loading is done and pulse settles
      if (!isAppLoading && materialRef.current.uniforms.uLoadingPulse.value < 0.01 && !hasRevealed.current) {
        hasRevealed.current = true;
        if (onRevealComplete) onRevealComplete();
      }
      
      // Smoothly interpolate shader colors towards the target palette
      const targetPalette = PALETTES[location.pathname] || PALETTES['/'];
      materialRef.current.uniforms.uColorBase.value.lerp(targetPalette.base, 0.03);
      materialRef.current.uniforms.uColorAccent.value.lerp(targetPalette.accent, 0.03);
      materialRef.current.uniforms.uColorHighlight.value.lerp(targetPalette.highlight, 0.03);

      // Calculate dynamic color for CSS variables to sync the DOM buttons with the WebGL
      // We replicate the shader math for the center of the screen (uv.x = 0.5)
      const colorShift = Math.sin(time * 0.15 + 0.5 * 2.0) * 0.5 + 0.5;
      const highlightShift = Math.cos(time * 0.1) * 0.5 + 0.5;
      const mixFactor = highlightShift * 0.5;
      
      const b = materialRef.current.uniforms.uColorBase.value;
      const a = materialRef.current.uniforms.uColorAccent.value;
      const h = materialRef.current.uniforms.uColorHighlight.value;

      let r = b.r * (1 - colorShift) + a.r * colorShift;
      let g = b.g * (1 - colorShift) + a.g * colorShift;
      let blue = b.b * (1 - colorShift) + a.b * colorShift;
      
      r = (r * (1 - mixFactor) + h.r * mixFactor) * 255;
      g = (g * (1 - mixFactor) + h.g * mixFactor) * 255;
      blue = (blue * (1 - mixFactor) + h.b * mixFactor) * 255;
      
      // Sync it to the root document for CSS to use
      document.documentElement.style.setProperty('--dynamic-glow', `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(blue)}, 0.2)`);
      document.documentElement.style.setProperty('--dynamic-glow-strong', `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(blue)}, 0.35)`);
      document.documentElement.style.setProperty('--dynamic-glow-dark', `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(blue)}, 0.4)`);
      
      // state.pointer provides normalized coordinates from -1 to 1 based on mouse position.
      // We map this to 0 to 1 to match our UV coordinates in the shader.
      const targetMouseX = state.pointer.x * 0.5 + 0.5;
      const targetMouseY = state.pointer.y * 0.5 + 0.5;
      
      // Smooth interpolation for the mouse tracking
      materialRef.current.uniforms.uMouse.value.lerp(
        new THREE.Vector2(targetMouseX, targetMouseY),
        0.05
      );
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      transparent={true}
    />
  );
};

// A helper component to perfectly size the plane to the viewport
const ViewportPlane = ({ isAppLoading, onRevealComplete }) => {
  const { viewport } = useThree();
  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <WaveMaterial isAppLoading={isAppLoading} onRevealComplete={onRevealComplete} />
    </mesh>
  );
};

const WaveBackground = ({ isAppLoading, onRevealComplete }) => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <Canvas 
        camera={{ position: [0, 0, 1] }} 
        dpr={[1, 1.5]} 
        gl={{ powerPreference: 'high-performance', antialias: false, alpha: false }}
      >
        <ViewportPlane isAppLoading={isAppLoading} onRevealComplete={onRevealComplete} />
      </Canvas>
    </div>
  );
};

export default WaveBackground;
