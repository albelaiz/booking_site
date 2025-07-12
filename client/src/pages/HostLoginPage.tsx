
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from '../hooks/use-toast';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { authApi } from '../lib/api';
import { 
  Home, 
  Eye, 
  EyeOff, 
  DollarSign, 
  Star, 
  Shield,
  User,
  Lock
} from 'lucide-react';

// Define the schema for the host login form
const hostLoginSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

type HostLoginFormValues = z.infer<typeof hostLoginSchema>;

const HostLoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Define the form with React Hook Form and Zod validation
  const form = useForm<HostLoginFormValues>({
    resolver: zodResolver(hostLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: HostLoginFormValues) => {
    setIsLoading(true);
    
    try {
      const response = await authApi.login(data.username, data.password);
      
      if (response.user) {
        // Check if user is a host/owner or can be upgraded
        if (response.user.role !== 'owner' && response.user.role !== 'admin') {
          // Upgrade regular user to host
          localStorage.setItem("userRole", "owner");
          toast({
            title: "Welcome to hosting!",
            description: "Your account has been upgraded to host status.",
          });
        }

        // Store user authentication data
        localStorage.setItem("userRole", response.user.role === 'admin' ? 'admin' : 'owner');
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", response.user.name);
        localStorage.setItem("userEmail", response.user.email);
        localStorage.setItem("loginMethod", "host-credentials");
        
        toast({
          title: "Host login successful",
          description: `Welcome to your hosting dashboard, ${response.user.name}!`,
        });
        
        // Always redirect to owner dashboard for hosts
        navigate("/owner-dashboard");
      }
    } catch (error) {
      console.error('Host login error:', error);
      toast({
        title: "Login failed",
        description: "Invalid credentials or you don't have host access. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-moroccan-blue via-moroccan-blue/95 to-moroccan-blue/90">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-white hover:text-moroccan-gold transition-colors">
            <div className="bg-white text-moroccan-blue p-2 rounded-lg">
              <span className="font-serif text-lg font-bold">T</span>
            </div>
            <div className="font-serif text-xl">
              <span>Tamuda</span>
              <span className="text-moroccan-gold">Stay</span>
            </div>
          </Link>
        </div>

        <div className="max-w-md mx-auto">
          {/* Host Benefits Card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8 text-white">
            <div className="text-center mb-6">
              <Home className="w-12 h-12 text-moroccan-gold mx-auto mb-3" />
              <h1 className="text-2xl font-serif font-bold mb-2">Host Portal</h1>
              <p className="text-white/90">Access your property management dashboard</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <DollarSign className="w-5 h-5 text-moroccan-gold mx-auto mb-1" />
                <div className="font-semibold">$3,500</div>
                <div className="text-xs text-white/80">avg/month</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <Shield className="w-5 h-5 text-moroccan-gold mx-auto mb-1" />
                <div className="font-semibold">$1M</div>
                <div className="text-xs text-white/80">protection</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <Star className="w-5 h-5 text-moroccan-gold mx-auto mb-1" />
                <div className="font-semibold">4.9★</div>
                <div className="text-xs text-white/80">rating</div>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Host Login</h2>
              <p className="text-gray-600">Sign in to manage your properties and bookings</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username or Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            placeholder="Enter your username or email" 
                            className="pl-10"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter your password"
                            className="pl-10 pr-10"
                            {...field} 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-moroccan-blue hover:bg-moroccan-blue/90 text-white font-semibold py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Access Host Dashboard"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Don't have a host account yet?
              </p>
              <Link 
                to="/become-host" 
                className="text-moroccan-blue hover:text-moroccan-blue/80 font-semibold"
              >
                Start Your Hosting Journey →
              </Link>
            </div>

            <div className="mt-8 text-center">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-2 font-semibold">Demo Host Credentials:</p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><span className="font-medium">Username:</span> owner</p>
                  <p><span className="font-medium">Password:</span> password123</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link 
                to="/" 
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to main site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostLoginPage;
