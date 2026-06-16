import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ServicesList from '../components/ServicesList';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

// Combined portfolio items representing the best work across divisions
const portfolioItems = [
  { id: 1, type: 'image', src: '/gallery7.jpg', size: 'large', title: 'Global Brand Campaign' },
  { id: 2, type: 'image', src: '/gallery2.jpg', size: 'small', title: 'Tech Summit Event' },
  { id: 't1', type: 'text', size: 'small', title: 'THE ARCHIVE', content: 'A curated showcase of our most impactful collaborations.' },
  { id: 3, type: 'image', src: '/gallery3.jpg', size: 'medium', title: 'Luxury Real Estate' },
  { id: 4, type: 'image', src: '/gallery4.jpg', size: 'medium', title: 'Fintech Web Platform' },
  { id: 't2', type: 'text', size: 'small', title: 'SCALE', content: 'We build digital ecosystems that scale globally.' },
  { id: 't3', type: 'text', size: 'small', title: 'PRECISION', content: 'Pixel-perfect execution from concept to deployment.' },
  { id: 5, type: 'image', src: '/gallery5.jpg', size: 'large', title: 'Fashion Editorial' },
  { id: 6, type: 'image', src: '/gallery1.jpg', size: 'medium', title: 'Corporate Identity' },
  { id: 't4', type: 'text', size: 'medium', title: 'IMPACT', content: 'Transforming visions into measurable market dominance.' },
  { id: 7, type: 'image', src: '/gallery6.jpg', size: 'wide', title: 'Product Launch Series' },
];

// Prestigious client list to pass into the marquee
const clientList = [
  "LVMH",
  "APPLE INC",
  "TESLA",
  "NIKE",
  "SONY MUSIC",
  "A24 FILMS",
  "PORSCHE"
];

const Portfolio = () => {
  return (
    <>
      <Header />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero 
          title="THE ARCHIVE" 
          subtitle="OUR LEGACY" 
          info="A curated collection of our most impactful collaborations, spanning cutting-edge digital platforms, global marketing campaigns, and striking visual narratives." 
        />
        {/* Reusing the dynamic marquee for a sleek client list! */}
        <ServicesList services={clientList} title="TRUSTED BY" />
        <Gallery items={portfolioItems} />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Portfolio;
