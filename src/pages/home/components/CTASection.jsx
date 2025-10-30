import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CTASection = ({ onGetStarted, onContactSales }) => {
  const navigate = useNavigate();

  const handleBookDemo = () => {
    navigate('/contact');
  };

  const handleWatchDemo = () => {
    navigate('/hosted-checkout');
  };

  const handleLearnMore = () => {
    navigate('/documentation');
  };

  const handlePricingPage = () => {
    navigate('/pricing');
  };

  const handleViewStatus = () => {
    navigate('/system-status');
  };

  const quickLinks = [
    {
      title: "API Documentation",
      description: "Complete guides and references",
      icon: "BookOpen",
      action: "View Docs",
      handler: handleLearnMore
    },
    {
      title: "Pricing Plans",
      description: "Transparent, competitive rates",
      icon: "DollarSign",
      action: "See Pricing",
      handler: handlePricingPage
    },
    {
      title: "System Status",
      description: "Real-time platform health",
      icon: "Activity",
      action: "Check Status",
      handler: handleViewStatus
    }
  ];

  const features = [
    { icon: 'Shield', text: '99.9% Uptime Guarantee' },
    { icon: 'Zap', text: '24/7 Expert Support' },
    { icon: 'Lock', text: 'Bank-Grade Security' },
    { icon: 'CheckCircle', text: 'SOC 2 Compliant' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background via-accent/5 to-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl opacity-30" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Heading */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
              Ready to Transform Your{" "}
              <span className="text-gradient bg-gradient-to-r from-accent to-cyan-400 bg-clip-text text-transparent">
                Payment Infrastructure?
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join thousands of businesses worldwide who trust our platform for secure, 
              scalable cryptocurrency payment processing. Get started in minutes, not months.
            </p>
          </div>

          {/* Trust Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8"
          >
            {features?.map((feature, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="p-3 rounded-lg bg-accent/10 text-accent">
                  <Icon name={feature?.icon} size={24} color="var(--color-accent)" />
                </div>
                <span className="text-sm font-medium text-foreground text-center">
                  {feature?.text}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              variant="default"
              size="xl"
              onClick={onGetStarted}
              iconName="ArrowRight"
              iconPosition="right"
              className="gradient-primary text-white hover:opacity-90 px-8 py-4 text-lg font-medium min-w-[200px]"
            >
              Get Started Free
            </Button>
            
            <Button
              variant="outline"
              size="xl"
              onClick={handleBookDemo}
              iconName="Calendar"
              iconPosition="left"
              className="px-8 py-4 text-lg font-medium min-w-[200px]"
            >
              Book Demo
            </Button>

            <Button
              variant="ghost"
              size="xl"
              onClick={handleWatchDemo}
              iconName="Play"
              iconPosition="left"
              className="px-8 py-4 text-lg font-medium text-accent hover:bg-accent/10 min-w-[200px]"
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            {quickLinks?.map((link, index) => (
              <motion.div
                key={link?.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="glassmorphism p-6 rounded-xl border border-border hover:border-accent/30 transition-all duration-200 group cursor-pointer"
                onClick={link?.handler}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors duration-200">
                      <Icon 
                        name={link?.icon} 
                        size={24} 
                        color="var(--color-accent)" 
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-heading font-semibold text-foreground group-hover:text-accent transition-colors duration-200 mb-2">
                      {link?.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {link?.description}
                    </p>
                    <div className="flex items-center text-accent text-sm font-medium group-hover:text-cyan-400 transition-colors duration-200">
                      <span>{link?.action}</span>
                      <Icon name="ArrowRight" size={16} className="ml-2" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-4 pt-8 border-t border-border"
          >
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Check" size={16} color="var(--color-success)" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Check" size={16} color="var(--color-success)" />
                <span>30-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Check" size={16} color="var(--color-success)" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Check" size={16} color="var(--color-success)" />
                <span>24/7 support included</span>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-4 text-sm text-muted-foreground">
              <span>Need more information?</span>
              <button
                onClick={handleLearnMore}
                className="text-accent hover:text-accent/80 font-medium transition-colors duration-200 flex items-center space-x-1"
              >
                <span>View Documentation</span>
                <Icon name="ExternalLink" size={14} color="currentColor" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;