import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import WaveBackground from './components/WaveBackground';
import Cursor from './components/Cursor';
import Landing from './pages/Landing';
import Photography from './pages/Photography';
import Marketing from './pages/Marketing';
import Portfolio from './pages/Portfolio';

// Component to handle scrolling to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [siteVisible, setSiteVisible] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Simulate an initial loading phase for the aesthetic
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <ScrollToTop />
      <div className="app-container">
        <Cursor />
        
        {/* Loading Overlay */}
        <div className={`loading-overlay ${!isAppLoading ? 'fade-out' : ''}`}>
          <div className="loading-text">CRYSTALLIZING INTERFACE...</div>
        </div>
        
        {/* Global Fixed Wave Background */}
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
          <Suspense fallback={<div style={{width:'100%', height:'100%', background:'#f0f0f0'}}></div>}>
            <WaveBackground isAppLoading={isAppLoading} onRevealComplete={() => setSiteVisible(true)} />
          </Suspense>
        </div>

        {/* Main site content fades in only after waves reveal initially */}
        <div 
          style={{ 
            opacity: siteVisible ? 1 : 0, 
            transition: 'opacity 1.5s cubic-bezier(0.165, 0.84, 0.44, 1)',
            pointerEvents: siteVisible ? 'auto' : 'none' 
          }}
        >
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/photography" element={<Photography />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
