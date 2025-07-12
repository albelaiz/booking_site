
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from '../hooks/use-toast';
import { 
  Home, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin,
  Eye,
  EyeOff,
  DollarSign,
  Star,
  Shield
} from 'lucide-react';
import { authApi } from '../lib/api';

interface HostAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const HostAuthModal: React.FC<HostAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    username: '',
    password: '',
    confirmPassword: '',
    propertyType: '',
    hostingExperience: 'new'
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.login(loginData.username, loginData.password);
      
      if (response.user) {
        // Check if user is a host/owner
        if (response.user.role !== 'owner' && response.user.role !== 'admin') {
          // Upgrade regular user to host
          localStorage.setItem("userRole", "owner");
          toast({
            title: "Welcome to hosting!",
            description: "Your account has been upgraded to host status.",
          });
        }

        // Store authentication data
        localStorage.setItem("userRole", response.user.role === 'admin' ? 'admin' : 'owner');
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", response.user.name);
        localStorage.setItem("userEmail", response.user.email);
        localStorage.setItem("loginMethod", "host-credentials");
        
        toast({
          title: "Host login successful",
          description: `Welcome to your hosting dashboard, ${response.user.name}!`,
        });
        
        onSuccess();
      }
    } catch (error) {
      console.error('Host login error:', error);
      toast({
        title: "Login failed",
        description: "Invalid credentials or you don't have host access.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (signupData.password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const hostSignupData = {
        name: signupData.name,
        email: signupData.email,
        phone: signupData.phone,
        location: signupData.location,
        username: signupData.username,
        password: signupData.password,
        role: 'owner', // Always create as host/owner
        propertyType: signupData.propertyType,
        hostingExperience: signupData.hostingExperience
      };

      const response = await authApi.register(hostSignupData);
      
      if (response.user) {
        // Store authentication data
        localStorage.setItem("userRole", "owner");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", response.user.name);
        localStorage.setItem("userEmail", response.user.email);
        localStorage.setItem("loginMethod", "host-credentials");
        
        toast({
          title: "Host account created successfully!",
          description: "Welcome to TamudaStay hosting! You can now list your properties.",
        });
        
        onSuccess();
      }
    } catch (error) {
      console.error('Host signup error:', error);
      toast({
        title: "Signup failed",
        description: "Failed to create host account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForms = () => {
    setLoginData({ username: '', password: '' });
    setSignupData({
      name: '',
      email: '',
      phone: '',
      location: '',
      username: '',
      password: '',
      confirmPassword: '',
      propertyType: '',
      hostingExperience: 'new'
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl font-serif text-moroccan-blue">
            <Home className="w-6 h-6 mr-2 text-moroccan-gold" />
            Host Portal
          </DialogTitle>
        </DialogHeader>

        {/* Host Benefits Banner */}
        <div className="bg-gradient-to-r from-moroccan-blue to-moroccan-blue/90 text-white rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-moroccan-gold" />
            Start Earning with Your Property
          </h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-moroccan-gold mr-1" />
              <span>$3,500/mo avg</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 text-moroccan-gold mr-1" />
              <span>$1M protection</span>
            </div>
            <div className="flex items-center">
              <Home className="w-4 h-4 text-moroccan-gold mr-1" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Host Login</TabsTrigger>
            <TabsTrigger value="signup">Become a Host</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="host-username">Username or Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="host-username"
                    type="text"
                    placeholder="Enter your username or email"
                    value={loginData.username}
                    onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="host-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="host-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-moroccan-blue hover:bg-moroccan-blue/90"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Access Host Dashboard"}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-500">
              <p>Demo Host Credentials:</p>
              <p><strong>Username:</strong> owner | <strong>Password:</strong> password123</p>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host-name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="host-name"
                      type="text"
                      placeholder="Your full name"
                      value={signupData.name}
                      onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="host-username">Username *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="host-username"
                      type="text"
                      placeholder="Choose username"
                      value={signupData.username}
                      onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="host-email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="host-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host-phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="host-phone"
                      type="tel"
                      placeholder="+212 6XX XXX XXX"
                      value={signupData.phone}
                      onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="host-location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="host-location"
                      type="text"
                      placeholder="City, Region"
                      value={signupData.location}
                      onChange={(e) => setSignupData({...signupData, location: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host-password-signup">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="host-password-signup"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 8 characters"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="host-confirm-password">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="host-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="property-type">What type of property do you want to host?</Label>
                <select
                  id="property-type"
                  value={signupData.propertyType}
                  onChange={(e) => setSignupData({...signupData, propertyType: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-moroccan-blue focus:border-transparent"
                >
                  <option value="">Select property type</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="riad">Riad</option>
                  <option value="house">House</option>
                  <option value="studio">Studio</option>
                  <option value="room">Room</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hosting-experience">Hosting Experience</Label>
                <select
                  id="hosting-experience"
                  value={signupData.hostingExperience}
                  onChange={(e) => setSignupData({...signupData, hostingExperience: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-moroccan-blue focus:border-transparent"
                >
                  <option value="new">New to hosting</option>
                  <option value="some">Some experience</option>
                  <option value="experienced">Very experienced</option>
                </select>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-moroccan-gold hover:bg-moroccan-gold/90 text-black font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Creating Host Account..." : "Start Hosting Journey"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center text-xs text-gray-500 mt-4">
          <p>By continuing, you agree to our hosting terms and conditions.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HostAuthModal;
