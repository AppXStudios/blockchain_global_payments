import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';

import Icon from '../../../components/AppIcon';

const ContactForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after success
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          company: '',
          subject: '',
          message: ''
        });
      }, 3000);
    }, 2000);
  };

  const handleViewDocs = () => {
    navigate('/documentation');
  };

  const handleDashboard = () => {
    navigate('/dashboard-overview');
  };

  const handleGetStarted = () => {
    navigate('/merchant-onboarding');
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 p-8 glassmorphism rounded-2xl border border-border"
      >
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <Icon name="Check" size={32} color="var(--color-success)" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground">Message Sent!</h3>
          <p className="text-muted-foreground">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
        </div>
        <div className="flex items-center justify-between pt-6">
          <div className="flex items-center space-x-4 text-sm">
            <button
              type="button"
              onClick={handleViewDocs}
              className="text-accent hover:text-accent/80 transition-smooth"
            >
              View Documentation
            </button>
            <button
              type="button"
              onClick={handleDashboard}
              className="text-accent hover:text-accent/80 transition-smooth"
            >
              Go to Dashboard
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting}
              className="gradient-primary text-white"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between pt-6">
        <div className="flex items-center space-x-4 text-sm">
          <button
            type="button"
            onClick={handleViewDocs}
            className="text-accent hover:text-accent/80 transition-smooth"
          >
            View Documentation
          </button>
          <button
            type="button"
            onClick={handleDashboard}
            className="text-accent hover:text-accent/80 transition-smooth"
          >
            Go to Dashboard
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting}
            className="gradient-primary text-white"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;