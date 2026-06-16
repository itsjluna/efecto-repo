import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import RegistrationInfo from '../components/RegistrationInfo';
import ServicesList from '../components/ServicesList';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const photographyItems = [
  { id: 1, type: 'image', src: '/gallery1.jpg', size: 'large', title: 'Weddings & Elopements' },
  { id: 2, type: 'image', src: '/gallery2.jpg', size: 'small', title: 'Corporate Events' },
  { id: 't1', type: 'text', size: 'small', title: 'OUR VISION', content: 'Crafting pixel-perfect imagery that captures the raw emotion of your moments.' },
  { id: 3, type: 'image', src: '/gallery3.jpg', size: 'medium', title: 'Brand Lifestyle' },
  { id: 4, type: 'image', src: '/gallery4.jpg', size: 'medium', title: 'Marketing Campaigns' },
  { id: 't2', type: 'text', size: 'small', title: 'PERSPECTIVE', content: 'Lenses that capture more than light; they capture pure ambition.' },
  { id: 't3', type: 'text', size: 'small', title: 'FOCUS', content: 'Uncompromising attention to detail in every single frame.' },
  { id: 5, type: 'image', src: '/gallery5.jpg', size: 'large', title: 'Editorial & Fashion' },
  { id: 6, type: 'image', src: '/gallery6.jpg', size: 'medium', title: 'Product Photography' },
  { id: 't4', type: 'text', size: 'medium', title: 'INNOVATION', content: 'Pushing the boundaries of modern visual storytelling.' },
  { id: 7, type: 'image', src: '/gallery7.jpg', size: 'wide', title: 'Live Performances' },
];

const photographyServices = [
  "WEDDINGS & ELOPEMENTS",
  "CORPORATE EVENTS",
  "BRAND LIFESTYLE",
  "EDITORIAL & FASHION",
  "PRODUCT PHOTOGRAPHY"
];

const Photography = () => {
  return (
    <>
      <Header />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero 
          title="EFECTO PHOTOGRAPHY" 
          subtitle="ELEVATING VISUAL NARRATIVES" 
          info="A premium photography studio dedicated to capturing striking imagery. From timeless weddings to dynamic marketing campaigns, our aesthetic defines your story." 
        />
        <ServicesList services={photographyServices} title="PHOTOGRAPHY EXPERTISE" />
        <RegistrationInfo 
          title="Efecto Photography Services" 
          desc="We capture the essence of your vision through high-end, dynamic photography. Our expertise spans luxury weddings, comprehensive event coverage, brand lifestyle shoots, and striking assets for marketing campaigns." 
          actionText="Book a Session"
        />
        <Gallery items={photographyItems} />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Photography;
