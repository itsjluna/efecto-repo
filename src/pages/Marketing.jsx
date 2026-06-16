import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import RegistrationInfo from '../components/RegistrationInfo';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const marketingItems = [
  { id: 1, type: 'image', src: '/gallery5.jpg', size: 'large', title: 'Brand Strategy' },
  { id: 2, type: 'image', src: '/gallery3.jpg', size: 'small', title: 'Social Media Management' },
  { id: 't1', type: 'text', size: 'small', title: 'OUR APPROACH', content: 'Data-driven marketing strategies that amplify your brand\'s reach and engagement.' },
  { id: 3, type: 'image', src: '/gallery1.jpg', size: 'medium', title: 'SEO & Analytics' },
  { id: 4, type: 'image', src: '/gallery7.jpg', size: 'medium', title: 'Digital Campaigns' },
  { id: 't2', type: 'text', size: 'small', title: 'IMPACT', content: 'We don\'t just chase metrics; we drive meaningful growth and brand loyalty.' },
  { id: 't3', type: 'text', size: 'small', title: 'STRATEGY', content: 'Tailored roadmaps designed specifically for your industry landscape.' },
  { id: 5, type: 'image', src: '/gallery4.jpg', size: 'large', title: 'Content Creation' },
  { id: 6, type: 'image', src: '/gallery2.jpg', size: 'medium', title: 'PPC Advertising' },
  { id: 't4', type: 'text', size: 'medium', title: 'RESULTS', content: 'Transparent reporting and continuous optimization to maximize your ROI.' },
  { id: 7, type: 'image', src: '/gallery6.jpg', size: 'wide', title: 'Market Research' },
];

const Marketing = () => {
  return (
    <>
      <Header />
      <main>
        <div className="top-fold" style={{ position: 'relative' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Hero 
              title="EFECTO MARKETING" 
              subtitle="DRIVING DIGITAL EXCELLENCE" 
              info="We are a cutting-edge marketing agency focused on delivering measurable results. From comprehensive SEO strategies to explosive digital campaigns, our data-driven approach ensures your brand dominates the market." 
            />
            <RegistrationInfo 
              title="Efecto Marketing Services" 
              desc="We amplify your brand's voice across the digital landscape. Our services include full-scale SEO optimization, targeted PPC advertising, dynamic social media management, and strategic content creation designed to convert." 
              actionText="Request an Audit"
            />
          </div>
        </div>
        <Gallery items={marketingItems} />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Marketing;
