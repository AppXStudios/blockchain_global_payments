import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SignUpForm = ({ onSwitchToSignIn }) => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    role: 'merchant'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    
    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(formData?.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const { data, error } = await signUp(
        formData?.email, 
        formData?.password,
        {
          fullName: formData?.fullName,
          companyName: formData?.companyName,
          role: formData?.role
        }
      );
      
      if (error) {
        setErrors({
          general: error?.message || 'Failed to create account. Please try again.'
        });
      } else if (data?.user) {
        // Show success message for email confirmation
        setErrors({
          general: 'Account created successfully! Please check your email to verify your account.'
        });
        
        // Optionally redirect to sign in after a delay
        setTimeout(() => {
          onSwitchToSignIn?.();
        }, 3000);
      }
    } catch (error) {
      setErrors({
        general: 'An error occurred during registration. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Terms and Privacy Policy links
  const handleTermsClick = (e) => {
    e?.preventDefault();
    window.open('/terms', '_blank');
  };

  const handlePrivacyClick = (e) => {
    e?.preventDefault();
    window.open('/privacy', '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors?.general && (
        <div className={`p-4 rounded-lg border text-sm ${
          errors?.general?.includes('successfully') 
            ? 'bg-green-50 border-green-200 text-green-700' :'bg-red-50 border-red-200 text-red-700'
        }`}>
          {errors?.general}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          value={formData?.fullName}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          error={errors?.fullName}
          required
          disabled={isLoading}
        />
        
        <Input
          label="Company Name (Optional)"
          type="text"
          name="companyName"
          value={formData?.companyName}
          onChange={handleInputChange}
          placeholder="Enter your company name"
          disabled={isLoading}
        />
      </div>
      
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData?.password}
            onChange={handleInputChange}
            placeholder="Create a password"
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
        
        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData?.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            error={errors?.confirmPassword}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
            disabled={isLoading}
          >
            <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Account Type
        </label>
        <select
          name="role"
          value={formData?.role}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
          disabled={isLoading}
        >
          <option value="merchant">Merchant</option>
          <option value="admin">Admin</option>
          <option value="operator">Operator</option>
        </select>
      </div>
      
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="terms"
          required
          className="mt-1 rounded border-border bg-input text-accent focus:ring-accent focus:ring-offset-background"
          disabled={isLoading}
        />
        <label htmlFor="terms" className="text-sm text-muted-foreground">
          I agree to the{' '}
          <button
            type="button"
            onClick={handleTermsClick}
            className="text-accent hover:text-accent/80 transition-smooth underline"
          >
            Terms of Service
          </button>{' '}
          and{' '}
          <button
            type="button"
            onClick={handlePrivacyClick}
            className="text-accent hover:text-accent/80 transition-smooth underline"
          >
            Privacy Policy
          </button>
        </label>
      </div>
      
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        className="gradient-primary text-white"
      >
        Create Account
      </Button>
      
      <div className="text-center">
        <span className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="text-accent hover:text-accent/80 transition-smooth font-medium"
            disabled={isLoading}
          >
            Sign in
          </button>
        </span>
      </div>
    </form>
  );
};

export default SignUpForm;