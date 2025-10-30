import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SocialAuthButtons = () => {
  const [loadingProvider, setLoadingProvider] = useState(null);

  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: 'Chrome',
      color: 'text-foreground'
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: 'Github',
      color: 'text-foreground'
    }
  ];

  const handleSocialAuth = async (providerId) => {
    setLoadingProvider(providerId);
    
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would redirect to OAuth provider
      alert(`${providerId?.charAt(0)?.toUpperCase() + providerId?.slice(1)} authentication would be initiated here`);
    } catch (error) {
      console.error(`${providerId} auth error:`, error);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {socialProviders?.map((provider) => (
          <Button
            key={provider?.id}
            type="button"
            variant="outline"
            onClick={() => handleSocialAuth(provider?.id)}
            loading={loadingProvider === provider?.id}
            disabled={loadingProvider !== null}
            className="flex items-center justify-center space-x-2"
          >
            <Icon 
              name={provider?.icon} 
              size={18} 
              color="currentColor"
              className={provider?.color}
            />
            <span>{provider?.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SocialAuthButtons;