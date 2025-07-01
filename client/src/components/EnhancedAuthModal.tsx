import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff, User, ArrowRight, ArrowLeft, CheckCircle, AlertCircle, UserPlus } from 'lucide-react';
import { authApi } from '../lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";

interface EnhancedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultMode?: 'login' | 'signup';
  suggestedRole?: 'user' | 'owner';
}

interface SignupStep {
  id: number;
  title: string;
  description: string;
}

const signupSteps: SignupStep[] = [
  { id: 1, title: "Basic Info", description: "Tell us about yourself" },
  { id: 2, title: "Account Details", description: "Choose your login credentials" },
  { id: 3, title: "Additional Info", description: "Help us personalize your experience" },
  { id: 4, title: "Verification", description: "Confirm your details" }
];

const EnhancedAuthModal: React.FC<EnhancedAuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  defaultMode = 'login',
  suggestedRole = 'user'
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'quickSignup'>(defaultMode);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    // Basic Info (Step 1)
    name: '',
    userType: suggestedRole, // 'user', 'owner'
    
    // Account Details (Step 2)
    username: '',
    password: '',
    confirmPassword: '',
    
    // Additional Info (Step 3)
    email: '',
    phone: '',
    preferences: {
      newsletter: false,
      hostUpdates: false,
      bookingReminders: true
    },
    
    // Login only
    loginField: '', // username or email
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: checked
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
    
    // Clear errors when user starts typing
    if (error) setError('');
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push("At least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("One uppercase letter (A-Z)");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("One lowercase letter (a-z)");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("One number (0-9)");
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push("One special character (!@#$%^&*)");
    }
    
    return errors;
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    switch (step) {
      case 1: // Basic Info
        if (!formData.name.trim()) {
          errors.name = 'Full name is required';
          isValid = false;
        } else if (formData.name.trim().length < 2) {
          errors.name = 'Name must be at least 2 characters long';
          isValid = false;
        }
        break;

      case 2: // Account Details
        if (!formData.username.trim()) {
          errors.username = 'Username is required';
          isValid = false;
        } else if (formData.username.trim().length < 3) {
          errors.username = 'Username must be at least 3 characters long';
          isValid = false;
        }

        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
          errors.password = 'Password does not meet requirements';
          isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
          isValid = false;
        }
        break;

      case 3: // Additional Info
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          errors.email = 'Please enter a valid email address';
          isValid = false;
        }
        // Phone is optional, no validation needed
        break;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const validateLogin = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!formData.loginField.trim()) {
      errors.loginField = 'Username or email is required';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleStepNavigation = (direction: 'next' | 'back') => {
    if (direction === 'next') {
      if (validateStep(currentStep)) {
        setCurrentStep(prev => Math.min(prev + 1, signupSteps.length));
      }
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (authMode === 'login') {
        if (!validateLogin()) {
          setLoading(false);
          return;
        }

        const response = await authApi.login(formData.loginField, formData.password);
        
        if (response.success && response.user) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userRole', response.user.role);
          localStorage.setItem('userName', response.user.name);
          localStorage.setItem('userEmail', response.user.email);
          localStorage.setItem('loginMethod', 'credentials');
          
          onSuccess();
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } else {
        // For signup, validate all steps
        let allStepsValid = true;
        for (let step = 1; step <= 3; step++) {
          if (!validateStep(step)) {
            allStepsValid = false;
            setCurrentStep(step);
            break;
          }
        }

        if (!allStepsValid) {
          setLoading(false);
          return;
        }

        const userData = {
          username: formData.username.trim(),
          name: formData.name.trim(),
          password: formData.password,
          ...(formData.email.trim() && { email: formData.email.trim() }),
          ...(formData.phone.trim() && { phone: formData.phone.trim() }),
          role: formData.userType
        };

        const response = await authApi.register(userData);
        
        if (response.success && response.user) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userRole', response.user.role);
          localStorage.setItem('userName', response.user.name);
          localStorage.setItem('userEmail', response.user.email || '');
          localStorage.setItem('loginMethod', 'credentials');
          
          onSuccess();
        } else {
          setError(response.error || 'Registration failed. Please try again.');
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      if (error.message) {
        setError(error.message);
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSignup = () => {
    setAuthMode('quickSignup');
    setCurrentStep(1);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      userType: suggestedRole,
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      phone: '',
      preferences: {
        newsletter: false,
        hostUpdates: false,
        bookingReminders: true
      },
      loginField: '',
    });
    setError('');
    setFieldErrors({});
    setCurrentStep(1);
  };

  const switchAuthMode = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    resetForm();
  };

  const renderPasswordRequirements = () => {
    const requirements = validatePassword(formData.password);
    const allRequirements = [
      "At least 8 characters long",
      "One uppercase letter (A-Z)",
      "One lowercase letter (a-z)",
      "One number (0-9)",
      "One special character (!@#$%^&*)"
    ];

    return (
      <div className="mt-2 space-y-1">
        <p className="text-xs text-gray-600">Password requirements:</p>
        <ul className="text-xs space-y-0.5">
          {allRequirements.map((req, index) => {
            const isValid = !requirements.includes(req);
            return (
              <li key={index} className={`flex items-center space-x-1 ${isValid ? 'text-green-600' : 'text-gray-400'}`}>
                {isValid ? <CheckCircle size={12} /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                <span>{req}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {signupSteps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            currentStep === step.id 
              ? 'bg-blue-600 text-white' 
              : currentStep > step.id 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-600'
          }`}>
            {currentStep > step.id ? <CheckCircle size={16} /> : step.id}
          </div>
          {index < signupSteps.length - 1 && (
            <div className={`h-0.5 w-8 ${currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderLoginForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center space-x-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="loginField">Username or Email</Label>
        <Input
          id="loginField"
          name="loginField"
          type="text"
          value={formData.loginField}
          onChange={handleInputChange}
          placeholder="Enter your username or email"
          className={fieldErrors.loginField ? "border-red-500" : ""}
        />
        {fieldErrors.loginField && (
          <p className="text-xs text-red-500">{fieldErrors.loginField}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            className={fieldErrors.password ? "border-red-500" : ""}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="text-xs text-red-500">{fieldErrors.password}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );

  const renderSignupStep = () => {
    const currentStepData = signupSteps.find(s => s.id === currentStep);
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-medium">{currentStepData?.title}</h3>
          <p className="text-sm text-gray-600">{currentStepData?.description}</p>
        </div>

        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={fieldErrors.name ? "border-red-500" : ""}
              />
              {fieldErrors.name && (
                <p className="text-xs text-red-500">{fieldErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userType">I want to</Label>
              <Select value={formData.userType} onValueChange={(value) => handleSelectChange('userType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your primary goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Book accommodations</SelectItem>
                  <SelectItem value="owner">Host guests and earn income</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Don't worry, you can always change this later or do both!
              </p>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose a unique username"
                className={fieldErrors.username ? "border-red-500" : ""}
              />
              {fieldErrors.username && (
                <p className="text-xs text-red-500">{fieldErrors.username}</p>
              )}
              <p className="text-xs text-gray-500">
                This will be used to log into your account
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a secure password"
                  className={fieldErrors.password ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-500">{fieldErrors.password}</p>
              )}
              {renderPasswordRequirements()}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={fieldErrors.confirmPassword ? "border-red-500" : ""}
              />
              {fieldErrors.confirmPassword && (
                <p className="text-xs text-red-500">{fieldErrors.confirmPassword}</p>
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address (optional but recommended)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className={fieldErrors.email ? "border-red-500" : ""}
              />
              {fieldErrors.email && (
                <p className="text-xs text-red-500">{fieldErrors.email}</p>
              )}
              <p className="text-xs text-gray-500">
                We'll use this for important account updates and booking confirmations
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (optional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
              <p className="text-xs text-gray-500">
                Helpful for urgent booking communications
              </p>
            </div>

            <div className="space-y-3">
              <Label>Preferences</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    name="preferences.newsletter"
                    checked={formData.preferences.newsletter}
                    onCheckedChange={(checked) => handleInputChange({
                      target: { name: 'preferences.newsletter', type: 'checkbox', checked }
                    } as any)}
                  />
                  <Label htmlFor="newsletter" className="text-sm">
                    Receive newsletter with travel tips and deals
                  </Label>
                </div>
                
                {formData.userType === 'owner' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hostUpdates"
                      name="preferences.hostUpdates"
                      checked={formData.preferences.hostUpdates}
                      onCheckedChange={(checked) => handleInputChange({
                        target: { name: 'preferences.hostUpdates', type: 'checkbox', checked }
                      } as any)}
                    />
                    <Label htmlFor="hostUpdates" className="text-sm">
                      Receive hosting tips and market updates
                    </Label>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bookingReminders"
                    name="preferences.bookingReminders"
                    checked={formData.preferences.bookingReminders}
                    onCheckedChange={(checked) => handleInputChange({
                      target: { name: 'preferences.bookingReminders', type: 'checkbox', checked }
                    } as any)}
                  />
                  <Label htmlFor="bookingReminders" className="text-sm">
                    Receive booking reminders and updates
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <CheckCircle className="mx-auto h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-medium text-blue-900">Ready to create your account!</h3>
              <p className="text-sm text-blue-700 mt-1">
                Please review your information and click "Create Account" to finish.
              </p>
            </div>

            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Name:</span> {formData.name}
                </div>
                <div>
                  <span className="font-medium">Type:</span> {formData.userType === 'owner' ? 'Host' : 'Guest'}
                </div>
                <div>
                  <span className="font-medium">Username:</span> {formData.username}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {formData.email || 'Not provided'}
                </div>
                {formData.phone && (
                  <div className="col-span-2">
                    <span className="font-medium">Phone:</span> {formData.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleStepNavigation('back')}
            disabled={currentStep === 1}
            className="flex items-center space-x-1"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Button>

          {currentStep < signupSteps.length ? (
            <Button
              type="button"
              onClick={() => handleStepNavigation('next')}
              className="flex items-center space-x-1"
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </Button>
          ) : (
            <Button
              type="submit"
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Create Account</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderQuickSignup = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center space-x-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="text-center p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          Quick signup - just the essentials to get you started!
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          className={fieldErrors.name ? "border-red-500" : ""}
        />
        {fieldErrors.name && (
          <p className="text-xs text-red-500">{fieldErrors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Choose a username"
          className={fieldErrors.username ? "border-red-500" : ""}
        />
        {fieldErrors.username && (
          <p className="text-xs text-red-500">{fieldErrors.username}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create a secure password"
            className={fieldErrors.password ? "border-red-500" : ""}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="text-xs text-red-500">{fieldErrors.password}</p>
        )}
        {renderPasswordRequirements()}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => switchAuthMode('signup')}
          className="text-sm text-blue-600 hover:underline"
        >
          Want more options? Use detailed signup
        </button>
      </div>
    </form>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {authMode === 'login' 
              ? 'Welcome Back' 
              : authMode === 'quickSignup'
                ? 'Quick Sign Up'
                : 'Create Your Account'
            }
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {authMode === 'login' && renderLoginForm()}
          
          {authMode === 'signup' && (
            <>
              {renderStepIndicator()}
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="flex items-center space-x-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-4">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
                {renderSignupStep()}
              </form>
            </>
          )}

          {authMode === 'quickSignup' && renderQuickSignup()}

          {/* Mode switching */}
          <div className="mt-6 pt-4 border-t">
            {authMode === 'login' ? (
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-500">
                  Don't have an account?
                </p>
                <div className="flex space-x-2 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleQuickSignup}
                    className="flex items-center space-x-1"
                  >
                    <UserPlus size={14} />
                    <span>Quick Sign Up</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => switchAuthMode('signup')}
                    className="flex items-center space-x-1"
                  >
                    <User size={14} />
                    <span>Detailed Sign Up</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-sm text-gray-500">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => switchAuthMode('login')}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Sign in
                </button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedAuthModal;
