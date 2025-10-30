import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Check if user is authenticated (you can replace this with your auth logic)
  const isAuthenticated = location?.pathname?.includes('/dashboard') || 
                          location?.pathname?.includes('/payments') || 
                          location?.pathname?.includes('/invoice') || 
                          location?.pathname?.includes('/payout') || 
                          location?.pathname?.includes('/api-keys') || 
                          location?.pathname?.includes('/webhook') || 
                          location?.pathname?.includes('/merchant') ||
                          location?.pathname?.includes('/conversions') ||
                          location?.pathname?.includes('/subscription');

  const publicNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Docs', path: '/documentation' },
    { label: 'Status', path: '/system-status' },
    { label: 'Contact', path: '/contact' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleSignIn = () => {
    navigate('/authentication');
    setIsMobileMenuOpen(false);
  };

  const handleGetStarted = () => {
    navigate('/merchant-onboarding');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isAuthenticated) {
    return null; // Don't render public header for authenticated pages
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full glassmorphism border-b border-border">
        <div className="flex h-16 items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center space-x-2 transition-smooth hover:opacity-80"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <Icon name="Zap" size={20} color="white" />
              </div>
              <span className="font-heading text-xl font-semibold text-foreground">
                Blockchain Global Payments
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {publicNavItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`text-sm font-medium transition-smooth hover:text-accent ${
                  location?.pathname === item?.path
                    ? 'text-accent' :'text-muted-foreground'
                }`}
              >
                {item?.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleSignIn}
              className="text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Button>
            <Button
              variant="default"
              onClick={handleGetStarted}
              className="gradient-primary text-white hover:opacity-90"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-smooth"
          >
            <Icon 
              name={isMobileMenuOpen ? "X" : "Menu"} 
              size={24} 
              color="currentColor" 
            />
          </button>
        </div>
      </header>
      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer */}
          <div className="fixed left-0 top-16 z-70 h-[calc(100vh-4rem)] w-80 glassmorphism border-r border-border md:hidden animate-slide-in">
            <div className="flex flex-col p-6 space-y-6">
              {/* Navigation Items */}
              <nav className="flex flex-col space-y-4">
                {publicNavItems?.map((item) => (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-smooth hover:bg-muted ${
                      location?.pathname === item?.path
                        ? 'bg-muted text-accent' :'text-muted-foreground'
                    }`}
                  >
                    <span className="font-medium">{item?.label}</span>
                  </button>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="flex flex-col space-y-3 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handleSignIn}
                  fullWidth
                >
                  Sign In
                </Button>
                <Button
                  variant="default"
                  onClick={handleGetStarted}
                  fullWidth
                  className="gradient-primary text-white"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;