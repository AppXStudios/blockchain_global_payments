import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PricingCard = ({ plan, index, isPopular }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (plan?.isEnterprise) {
      navigate('/contact');
    } else {
      navigate('/merchant-onboarding');
    }
  };

  const handleContactSales = () => {
    navigate('/contact');
  };

  const handleViewFeatures = () => {
    navigate('/documentation');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative glassmorphism rounded-2xl p-8 border transition-all duration-300 hover:shadow-elevation-lg ${
        isPopular 
          ? 'border-accent shadow-glow bg-accent/5' : 'border-border hover:border-accent/30'
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium">
            Most Popular
          </div>
        </div>
      )}
      {/* Plan Header */}
      <div className="text-center space-y-4 mb-8">
        <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${plan?.gradient || 'from-accent to-cyan-400'} p-4`}>
          <Icon name={plan?.icon || 'Package'} size={32} color="white" />
        </div>
        
        <div>
          <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
            {plan?.name}
          </h3>
          <p className="text-muted-foreground">
            {plan?.description}
          </p>
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <div className="text-4xl font-bold text-foreground">
            {plan?.price}
            {plan?.period && (
              <span className="text-lg font-normal text-muted-foreground">
                {plan?.period}
              </span>
            )}
          </div>
          {plan?.fee && (
            <div className="text-lg text-accent font-semibold">
              {plan?.fee} transaction fee
            </div>
          )}
        </div>
      </div>
      {/* Features */}
      <div className="space-y-4 mb-8">
        {plan?.features?.map((feature, idx) => (
          <div key={idx} className="flex items-start space-x-3">
            <Icon 
              name="Check" 
              size={20} 
              color="var(--color-accent)" 
              className="mt-0.5 flex-shrink-0" 
            />
            <span className="text-sm text-muted-foreground leading-relaxed">
              {feature}
            </span>
          </div>
        ))}
      </div>
      {/* Limits */}
      {plan?.limits && (
        <div className="bg-muted/30 rounded-lg p-4 mb-6 space-y-2">
          {Object.entries(plan?.limits)?.map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-muted-foreground capitalize">
                {key?.replace(/([A-Z])/g, ' $1')?.toLowerCase()}
              </span>
              <span className="text-foreground font-medium">{value}</span>
            </div>
          ))}
        </div>
      )}
      {/* CTA Buttons */}
      <div className="space-y-3">
        {plan?.name === 'Enterprise' ? (
          <>
            <Button
              variant="default"
              fullWidth
              size="lg"
              onClick={handleContactSales}
              iconName="MessageCircle"
              iconPosition="left"
              className={isPopular ? 'gradient-primary text-white' : ''}
            >
              Contact Sales
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={handleViewFeatures}
              iconName="Eye"
              iconPosition="left"
              className="text-sm"
            >
              View Features
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="default"
              fullWidth
              size="lg"
              onClick={handleGetStarted}
              iconName="ArrowRight"
              iconPosition="right"
              className={isPopular ? 'gradient-primary text-white' : ''}
            >
              Get Started
            </Button>
            <Button
              variant="ghost"
              fullWidth
              onClick={handleViewFeatures}
              className="text-sm text-muted-foreground hover:text-accent"
            >
              View all features
            </Button>
          </>
        )}
      </div>
      {/* Additional Info */}
      {plan?.additionalInfo && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            {plan?.additionalInfo}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default PricingCard;