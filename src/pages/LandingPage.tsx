import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Hero } from '../components/landing/Hero';
import { HowItWorks } from '../components/landing/HowItWorks';
import { HostelSection } from '../components/landing/HostelSection';
import { SmartMessSection } from '../components/landing/SmartMessSection';
import { MaintenanceSection } from '../components/landing/MaintenanceSection';
import { Features } from '../components/landing/Features';
import { AboutUs } from '../components/landing/AboutUs';
import { Testimonials } from '../components/landing/Testimonials';
import { ContactUs } from '../components/landing/ContactUs';

export const LandingPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#ffffff' }}>
      <Navbar />
      <main style={{ flexGrow: 1 }}>
        {/* 1. Hero */}
        <Hero />

        {/* 2. How It Works (4-Step Flow) */}
        <HowItWorks />

        {/* 3. Dedicated Hostel Management Section */}
        <HostelSection />

        {/* 4. Dedicated Smart Mess Management Section */}
        <SmartMessSection />

        {/* 5. Dedicated Maintenance Management Section & AI Classifier */}
        <MaintenanceSection />

        {/* 6. Key Features */}
        <Features />

        {/* 7. Product Purpose & Architecture */}
        <AboutUs />

        {/* 8. User Perspectives & What Users Need */}
        <Testimonials />

        {/* 9. Helpdesk & Contact Us */}
        <ContactUs />
      </main>
      <Footer />
    </div>
  );
};
