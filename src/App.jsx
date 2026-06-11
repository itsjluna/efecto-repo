import React, { Suspense, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import RegistrationInfo from './components/RegistrationInfo';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WaveBackground from './components/WaveBackground';
import Cursor from './components/Cursor';

function App() {
  // State to track when the cinematic wave reveal finishes
  const [siteVisible, setSiteVisible] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Simulate an initial loading phase for the aesthetic
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app-container">
      <Cursor />
      
      {/* Loading Overlay */}
      <div className={`loading-overlay ${!isAppLoading ? 'fade-out' : ''}`}>
        <div className="loading-text">FOCUSING LENSES...</div>
      </div>
      
      {/* Global Fixed Wave Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
        <Suspense fallback={<div style={{width:'100%', height:'100%', background:'#f0f0f0'}}></div>}>
          <WaveBackground isAppLoading={isAppLoading} onRevealComplete={() => setSiteVisible(true)} />
        </Suspense>
      </div>

      {/* Main site content fades in only after waves rise up */}
      <div 
        style={{ 
          opacity: siteVisible ? 1 : 0, 
          transition: 'opacity 1.5s cubic-bezier(0.165, 0.84, 0.44, 1)',
          pointerEvents: siteVisible ? 'auto' : 'none' 
        }}
      >
        <Header />
        <main>
          {/* Top fold no longer has overflow hidden clipping the waves */}
          <div className="top-fold" style={{ position: 'relative' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Hero />
              <RegistrationInfo />
            </div>
          </div>
          
          <Gallery />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
