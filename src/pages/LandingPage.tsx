import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Hero } from '../components/landing/Hero';
import { HowItWorks } from '../components/landing/HowItWorks';
import { Features } from '../components/landing/Features';
import { AboutUs } from '../components/landing/AboutUs';
import { Testimonials } from '../components/landing/Testimonials';
import { ContactUs } from '../components/landing/ContactUs';

export const LandingPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flexGrow: 1 }}>
        <Hero />
        <HowItWorks />
        <Features />
        <AboutUs />
        <Testimonials />
        <ContactUs />
      </main>
      <Footer />
    </div>
  );
};
