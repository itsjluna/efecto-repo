import React from 'react';
import Hero from '../components/Hero';
import RegistrationInfo from '../components/RegistrationInfo';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const weddingItems = [
  { id: 1, type: 'image', src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', size: 'large', title: 'The Ceremony' },
  { id: 2, type: 'image', src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', size: 'small', title: 'Intimate Moments' },
  { id: 't1', type: 'text', size: 'small', title: 'OUR VISION', content: 'Crafting pixel-perfect imagery that captures the raw emotion of your moments.' },
  { id: 3, type: 'image', src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', size: 'medium', title: 'The Details' },
  { id: 4, type: 'image', src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80', size: 'medium', title: 'The Celebration' },
  { id: 't2', type: 'text', size: 'small', title: 'PERSPECTIVE', content: 'Lenses that capture more than light; they capture pure ambition.' },
  { id: 't3', type: 'text', size: 'small', title: 'FOCUS', content: 'Uncompromising attention to detail in every single frame.' },
  { id: 5, type: 'image', src: 'https://images.unsplash.com/photo-1532712938736-59c7ea0e2831?auto=format&fit=crop&w=1200&q=80', size: 'large', title: 'The Reception' },
  { id: 6, type: 'image', src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80', size: 'medium', title: 'Ethereal Portraits' },
  { id: 't4', type: 'text', size: 'medium', title: 'ETHEREAL MEMORIES', content: 'Pushing the boundaries of modern visual storytelling.' },
  { id: 7, type: 'image', src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80', size: 'wide', title: 'The Journey' },
];

const Weddings = () => {
  return (
    <>
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero 
          title="ETHEREAL MEMORIES" 
          subtitle="WEDDING PHOTOGRAPHY BY EFECTO" 
          info="We capture light, emotion, and the raw beauty of your most important day." 
        />
        
        <RegistrationInfo 
          title="Your Story, Immortalized" 
          desc="We believe your wedding day is a living, breathing work of art. Our approach combines avant-garde aesthetics with deeply emotional storytelling. We don't just document events; we capture the sensory experience, the fleeting glances, and the ethereal beauty of your celebration." 
          actionText="Inquire Below"
        />
        
        <Contact />

        <div style={{ marginTop: '4rem' }}>
          <Gallery items={weddingItems} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Weddings;
