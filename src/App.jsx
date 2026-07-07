import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import WaveBackground from './components/WaveBackground';
import Cursor from './components/Cursor';
import Header from './components/Header';
import Landing from './pages/Landing';

// Lazy load routes for optimal bundle splitting
const Photography = React.lazy(() => import('./pages/Photography'));
const Marketing = React.lazy(() => import('./pages/Marketing'));
const Portfolio = React.lazy(() => import('./pages/Portfolio'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Component to handle scrolling to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const location = useLocation();
  const validPaths = ['/', '/photography', '/marketing', '/portfolio'];
  const isValidRoute = validPaths.includes(location.pathname);
  
  const introSeen = sessionStorage.getItem('efecto_intro_seen') === 'true';
  const shouldSkipIntro = !isValidRoute || introSeen;
  
  const [siteVisible, setSiteVisible] = useState(false);
  // Skip the 'SEE BEYOND' intro if we are landing directly on a 404 page or if already seen this session
  const [isAppLoading, setIsAppLoading] = useState(!shouldSkipIntro);
  const [isMorphing, setIsMorphing] = useState(shouldSkipIntro);
  const [hasStarted, setHasStarted] = useState(shouldSkipIntro);

  const handleStart = () => {
    setIsMorphing(true);
    sessionStorage.setItem('efecto_intro_seen', 'true');
    setTimeout(() => {
      setIsAppLoading(false);
      setHasStarted(true);
    }, 800); // Allow morph animation to complete before revealing waves
  };

  return (
    <>
      <ScrollToTop />
      <div className="app-container">
        <Cursor />
        
        {/* Loading Overlay */}
        <div className={`loading-overlay ${!isAppLoading ? 'fade-out' : ''}`}>
          {!hasStarted && (
            <button 
              className={`see-beyond-start-btn ${isMorphing ? 'morphing' : ''}`} 
              onClick={handleStart}
            >
              SEE BEYOND
            </button>
          )}
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
            pointerEvents: siteVisible ? 'auto' : 'none',
            height: '100%',
            width: '100%'
          }}
        >
          {location.pathname !== '/' && isValidRoute && <Header />}
          <div key={location.pathname} className="page-transition-wrapper">
            <Suspense fallback={<div style={{ height: '100vh', width: '100vw' }} />}>
              <Routes location={location}>
                <Route path="/" element={<Landing />} />
                <Route path="/photography" element={<Photography />} />
                <Route path="/marketing" element={<Marketing />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
