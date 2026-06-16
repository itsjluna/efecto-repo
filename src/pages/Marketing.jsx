import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import RegistrationInfo from '../components/RegistrationInfo';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const marketingItems = [
  { id: 1, type: 'image', src: '/gallery5.jpg', size: 'large', title: 'Brand Management' },
  { id: 2, type: 'image', src: '/gallery3.jpg', size: 'small', title: 'Graphic Design' },
  { id: 't1', type: 'text', size: 'small', title: 'OUR APPROACH', content: 'Data-driven strategies paired with world-class design to amplify your reach.' },
  { id: 3, type: 'image', src: '/gallery1.jpg', size: 'medium', title: 'Web Development' },
  { id: 4, type: 'image', src: '/gallery7.jpg', size: 'medium', title: 'Mobile App Development' },
  { id: 't2', type: 'text', size: 'small', title: 'IMPACT', content: 'We don\'t just chase metrics; we build sustainable digital ecosystems.' },
  { id: 't3', type: 'text', size: 'small', title: 'STRATEGY', content: 'Tailored roadmaps designed specifically for your industry landscape.' },
  { id: 5, type: 'image', src: '/gallery4.jpg', size: 'large', title: 'Social Media Management' },
  { id: 6, type: 'image', src: '/gallery2.jpg', size: 'medium', title: 'Website Management' },
  { id: 't4', type: 'text', size: 'medium', title: 'RESULTS', content: 'Transparent reporting and continuous optimization to maximize your ROI.' },
  { id: 7, type: 'image', src: '/gallery6.jpg', size: 'wide', title: 'Digital Branding' },
];

const Marketing = () => {
  return (
    <>
      <Header />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero 
          title="EFECTO MARKETING" 
          subtitle="DRIVING DIGITAL EXCELLENCE" 
          info="A cutting-edge agency focused on delivering measurable results and scalable digital infrastructure. From holistic brand management to robust web and mobile development, we engineer your market dominance." 
        />
        <RegistrationInfo 
          title="Efecto Marketing Services" 
          desc="We build and amplify your digital presence. Our division specializes in comprehensive branding, striking graphic design, scalable web & mobile development, and data-driven social media management." 
          actionText="Request an Audit"
        />
        <Gallery items={marketingItems} />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Marketing;
