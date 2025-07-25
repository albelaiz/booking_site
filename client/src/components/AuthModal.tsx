
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { authApi } from '../lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const validatePassword = (password: string) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push("Password must contain at least one special character (!@#$%^&*)");
    }
    
    return errors;
  };

  const validateForm = () => {
    if (!isLogin) {
      // Registration validation
      if (!formData.name.trim()) {
        setError('Name is required');
        return false;
      }
      
      if (formData.name.trim().length < 2) {
        setError('Name must be at least 2 characters long');
        return false;
      }
      
      if (!formData.username.trim()) {
        setError('Username is required');
        return false;
      }
      
      if (formData.username.trim().length < 3) {
        setError('Username must be at least 3 characters long');
        return false;
      }
      
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
      
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        setError(passwordErrors[0]); // Show first error
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    } else {
      // Login validation
      if (!formData.username.trim() && !formData.email.trim()) {
        setError('Username or email is required');
        return false;
      }
      
      if (!formData.password) {
        setError('Password is required');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form before sending to server
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Login with real API
        const response = await authApi.login(formData.username || formData.email, formData.password);
        console.log('Login response:', response);
        
        if (response.success && response.user) {
          // Store user info in localStorage
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userId', response.user.id.toString());
          localStorage.setItem('userRole', response.user.role);
          localStorage.setItem('userName', response.user.name);
          localStorage.setItem('userEmail', response.user.email);
          localStorage.setItem('loginMethod', 'credentials');
          // Create a simple auth token for API calls
          localStorage.setItem('authToken', `Bearer ${response.user.role}-${response.user.id}`);
          
          onSuccess();
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } else {
        // Registration with real API and enhanced validation
        const response = await authApi.register({
          username: formData.username.trim(),
          email: formData.email.trim() || undefined,
          password: formData.password,
          name: formData.name.trim(),
          phone: formData.phone.trim() || undefined
        });

        console.log('Registration response:', response);
        
        if (response.success && response.user) {
          // Store user info in localStorage
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userId', response.user.id.toString());
          localStorage.setItem('userRole', response.user.role);
          localStorage.setItem('userName', response.user.name);
          localStorage.setItem('userEmail', response.user.email);
          localStorage.setItem('loginMethod', 'credentials');
          // Create a simple auth token for API calls
          localStorage.setItem('authToken', `Bearer ${response.user.role}-${response.user.id}`);
          
          onSuccess();
        } else {
          setError(response.error || 'Registration failed. Please try again.');
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // Handle different types of errors
      if (error.message) {
        setError(error.message);
      } else if (typeof error === 'string') {
        setError(error);
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Mock Google login
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId', '999');
    localStorage.setItem('userRole', 'customer');
    localStorage.setItem('userName', 'Google User');
    localStorage.setItem('userEmail', 'user@gmail.com');
    localStorage.setItem('loginMethod', 'google');
    localStorage.setItem('authToken', 'Bearer customer-999');
    onSuccess();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      phone: ''
    });
    setError('');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLogin}
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder={isLogin ? "Enter username or email" : "Choose a username"}
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required={!isLogin}
                placeholder="Enter your email"
              />
            </div>
          )}

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {!isLogin && (
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Password requirements:</p>
                <ul className="text-xs text-gray-500 ml-2 space-y-0.5">
                  <li className={formData.password.length >= 8 ? "text-green-600" : ""}>
                    ✓ At least 8 characters long
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? "text-green-600" : ""}>
                    ✓ One uppercase letter (A-Z)
                  </li>
                  <li className={/[a-z]/.test(formData.password) ? "text-green-600" : ""}>
                    ✓ One lowercase letter (a-z)
                  </li>
                  <li className={/[0-9]/.test(formData.password) ? "text-green-600" : ""}>
                    ✓ One number (0-9)
                  </li>
                  <li className={/[^A-Za-z0-9]/.test(formData.password) ? "text-green-600" : ""}>
                    ✓ One special character (!@#$%^&*)
                  </li>
                </ul>
              </div>
            )}
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required={!isLogin}
                placeholder="Confirm your password"
              />
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-moroccan-blue hover:bg-moroccan-blue/90"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={switchMode}
              className="font-medium text-moroccan-blue hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
