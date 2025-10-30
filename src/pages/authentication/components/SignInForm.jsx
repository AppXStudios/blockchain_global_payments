import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import authService from '../../../services/authService';

const SignInForm = ({ onSwitchToSignUp, onForgotPassword }) => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const { data, error } = await signIn(formData?.email, formData?.password);
      
      if (error) {
        setErrors({
          general: error?.message || 'Invalid email or password. Please try again.'
        });
      } else if (data?.user) {
        // Successful login - navigate to dashboard
        navigate('/dashboard-overview');
      }
    } catch (error) {
      setErrors({
        general: 'An error occurred during sign in. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!formData?.email) {
      setErrors({ email: 'Please enter your email address first' });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const { data, error } = await authService?.sendMagicLink(formData?.email);
      
      if (error) {
        setErrors({
          general: error?.message || 'Failed to send magic link. Please try again.'
        });
      } else {
        setErrors({
          general: `Magic link sent to ${formData?.email}! Check your inbox.`
        });
      }
    } catch (error) {
      setErrors({
        general: 'Failed to send magic link. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials auto-fill handlers
  const fillAdminCredentials = () => {
    setFormData({
      email: 'admin@bgp.com',
      password: 'AdminPass123!'
    });
    setErrors({});
  };

  const fillMerchantCredentials = () => {
    setFormData({
      email: 'merchant@bgp.com', 
      password: 'MerchantPass123!'
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Demo Credentials Display */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials:</h4>
        <div className="space-y-2 text-sm text-blue-700">
          <div className="flex items-center justify-between">
            <span><strong>Admin:</strong> admin@bgp.com / AdminPass123!</span>
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="text-xs bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded transition-smooth"
            >
              Use Admin
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span><strong>Merchant:</strong> merchant@bgp.com / MerchantPass123!</span>
            <button
              type="button"
              onClick={fillMerchantCredentials}
              className="text-xs bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded transition-smooth"
            >
              Use Merchant
            </button>
          </div>
        </div>
        <p className="text-xs text-blue-600 mt-2">Click "Use Admin" or "Use Merchant" to auto-fill credentials</p>
      </div>

      {errors?.general && (
        <div className={`p-4 rounded-lg border text-sm ${
          errors?.general?.includes('sent to') 
            ? 'bg-green-50 border-green-200 text-green-700' :'bg-red-50 border-red-200 text-red-700'
        }`}>
          {errors?.general}
        </div>
      )}
      
      <div className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData?.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          error={errors?.email}
          required
          disabled={isLoading}
        />
        
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData?.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            error={errors?.password}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
            disabled={isLoading}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            className="rounded border-border bg-input text-accent focus:ring-accent focus:ring-offset-background"
            disabled={isLoading}
          />
          <span className="text-muted-foreground">Remember me</span>
        </label>
        
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-accent hover:text-accent/80 transition-smooth"
          disabled={isLoading}
        >
          Forgot password?
        </button>
      </div>
      
      <div className="space-y-3">
        <Button
          type="submit"
          variant="default"
          fullWidth
          loading={isLoading}
          className="gradient-primary text-white"
        >
          Sign In
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        
        <Button
          type="button"
          variant="outline"
          fullWidth
          onClick={handleMagicLink}
          loading={isLoading}
          iconName="Mail"
          iconPosition="left"
        >
          Send Magic Link
        </Button>
      </div>
      
      <div className="text-center">
        <span className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-accent hover:text-accent/80 transition-smooth font-medium"
            disabled={isLoading}
          >
            Sign up
          </button>
        </span>
      </div>
    </form>
  );
};

export default SignInForm;