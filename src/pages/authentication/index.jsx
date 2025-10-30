import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthTabs from './components/AuthTabs';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import SocialAuthButtons from './components/SocialAuthButtons';
import Icon from '../../components/AppIcon';


const Authentication = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signin');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/dashboard-overview');
    }
  }, [navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSwitchToSignUp = () => {
    setActiveTab('signup');
  };

  const handleSwitchToSignIn = () => {
    setActiveTab('signin');
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 border border-white/20 rounded-full"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Icon name="Zap" size={28} color="white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Blockchain Global Payments</h1>
              <p className="text-white/80 text-sm">Enterprise Crypto Infrastructure</p>
            </div>
          </div>
          
          {/* Features */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Accept crypto payments\nwith enterprise-grade security
              </h2>
              <p className="text-white/90 text-lg leading-relaxed">
                Join thousands of businesses processing billions in cryptocurrency\ntransactions across 300+ currencies and 180+ countries.
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  icon: 'Shield',
                  title: 'Bank-Grade Security',
                  description: 'Multi-layer security with HMAC verification and rate limiting'
                },
                {
                  icon: 'Globe',
                  title: 'Global Coverage',
                  description: 'Accept payments from customers worldwide in 300+ cryptocurrencies'
                },
                {
                  icon: 'Zap',
                  title: 'Instant Settlement',
                  description: 'Real-time payment processing with automated conversion'
                }
              ]?.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                    <Icon name={feature?.icon} size={20} color="white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature?.title}</h3>
                    <p className="text-white/80 text-sm">{feature?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="grid grid-cols-3 gap-8">
              {[
                { value: '$2.4B+', label: 'Processed' },
                { value: '50K+', label: 'Merchants' },
                { value: '99.9%', label: 'Uptime' }
              ]?.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold">{stat?.value}</div>
                  <div className="text-white/80 text-sm">{stat?.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Right Side - Authentication Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                <Icon name="Zap" size={24} color="white" />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-foreground">BGP</h1>
                <p className="text-muted-foreground text-sm">Crypto Payments</p>
              </div>
            </div>
          </div>
          
          {/* Auth Tabs */}
          <AuthTabs activeTab={activeTab} onTabChange={handleTabChange} />
          
          {/* Auth Forms */}
          <div className="glassmorphism border border-border rounded-xl p-8">
            {activeTab === 'signin' ? (
              <SignInForm
                onSwitchToSignUp={handleSwitchToSignUp}
                onForgotPassword={handleForgotPassword}
              />
            ) : (
              <SignUpForm onSwitchToSignIn={handleSwitchToSignIn} />
            )}
            
            {/* Social Auth - Only show for sign in */}
            {activeTab === 'signin' && (
              <div className="mt-6">
                <SocialAuthButtons />
              </div>
            )}
          </div>
          
          {/* Trust Indicators */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-6 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} />
                <span className="text-xs">SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Lock" size={16} />
                <span className="text-xs">SOC 2 Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} />
                <span className="text-xs">GDPR Ready</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our{' '}
              <button className="text-accent hover:text-accent/80 transition-smooth">
                Terms of Service
              </button>{' '}
              and{' '}
              <button className="text-accent hover:text-accent/80 transition-smooth">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={handleCloseForgotPassword}
      />
    </div>
  );
};

export default Authentication;