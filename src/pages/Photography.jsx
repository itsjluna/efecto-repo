import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import RegistrationInfo from '../components/RegistrationInfo';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const photographyItems = [
  { id: 1, type: 'image', src: '/gallery1.jpg', size: 'large', title: 'Corporate Portraits' },
  { id: 2, type: 'image', src: '/gallery2.jpg', size: 'small', title: 'Architecture' },
  { id: 't1', type: 'text', size: 'small', title: 'OUR VISION', content: 'Crafting pixel-perfect imagery that resonates with your corporate identity.' },
  { id: 3, type: 'image', src: '/gallery3.jpg', size: 'medium', title: 'Event Coverage' },
  { id: 4, type: 'image', src: '/gallery4.jpg', size: 'medium', title: 'Product Photography' },
  { id: 't2', type: 'text', size: 'small', title: 'PERSPECTIVE', content: 'Our lenses capture more than light; they capture pure ambition.' },
  { id: 't3', type: 'text', size: 'small', title: 'FOCUS', content: 'Uncompromising attention to detail in every single frame.' },
  { id: 5, type: 'image', src: '/gallery5.jpg', size: 'large', title: 'Brand Lifestyle' },
  { id: 6, type: 'image', src: '/gallery6.jpg', size: 'medium', title: 'Studio Sessions' },
  { id: 't4', type: 'text', size: 'medium', title: 'INNOVATION', content: 'Pushing the boundaries of modern visual storytelling to elevate your brand presence.' },
  { id: 7, type: 'image', src: '/gallery7.jpg', size: 'wide', title: 'Aerial Photography' },
];

const Photography = () => {
  return (
    <>
      <Header />
      <main>
        <div className="top-fold" style={{ position: 'relative' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Hero 
              title="EFECTO AGENCY" 
              subtitle="ELEVATING VISUAL NARRATIVES" 
              info="We are a premium photography agency dedicated to capturing striking imagery for modern corporate environments. From structural minimalism to dynamic portraits, our aesthetic defines the future of your brand." 
            />
            <RegistrationInfo 
              title="Efecto Photography Services" 
              desc="We capture the essence of your brand through high-end, dynamic, and corporate-ready photography. From architectural documentation to executive portraits and dynamic lifestyle shoots, our visual solutions are crafted to elevate your market presence." 
              actionText="Book a Session"
            />
          </div>
        </div>
        <Gallery items={photographyItems} />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Photography;
