import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSection from './components/HeroSection';
import FeatureGrid from './components/FeatureGrid';
import TrustSection from './components/TrustSection';
import CTASection from './components/CTASection';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/merchant-onboarding');
  };

  const handleViewDocs = () => {
    navigate('/documentation');
  };

  const handleContactSales = () => {
    navigate('/contact');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      {/* Hero Section */}
      <HeroSection 
        onGetStarted={handleGetStarted}
        onViewDocs={handleViewDocs}
      />
      {/* Feature Grid */}
      <FeatureGrid />
      {/* Trust & Security Section */}
      <TrustSection />
      {/* Call to Action Section */}
      <CTASection 
        onGetStarted={handleGetStarted}
        onContactSales={handleContactSales}
      />
    </motion.div>
  );
};

export default HomePage;