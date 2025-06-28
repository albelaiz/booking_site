
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

// Define the schema for the login form
const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the intended destination from state (for redirects after login)
  const from = location.state?.from?.pathname || '/dashboard';

  // Define the form with React Hook Form and Zod validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const response = await authApi.login(data.username, data.password);
      
      if (response.user) {
        // Store user authentication data
        localStorage.setItem("userRole", response.user.role);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", response.user.name);
        localStorage.setItem("userEmail", response.user.email);
        localStorage.setItem("loginMethod", "credentials");
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${response.user.name}!`,
        });
        
        // Role-based navigation with fallback to dashboard for hosts
        switch (response.user.role) {
          case "admin":
            navigate("/admin");
            break;
          case "staff":
            navigate("/staff");
            break;
          case "owner":
            navigate("/owner-dashboard");
            break;
          case "user":
          default:
            // Default to dashboard for regular users and hosts
            navigate(from);
            break;
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="bg-moroccan-blue text-white p-2 rounded">
              <span className="font-serif text-lg">M</span>
            </div>
            <div className="font-serif text-xl text-moroccan-blue">
              <span>Martil</span>
              <span className="text-moroccan-gold">Haven</span>
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">Login to Your Account</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username or email" {...field} />
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
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-moroccan-blue hover:bg-moroccan-blue/90"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Demo credentials:<br />
            <span className="font-medium">Admin:</span> admin / password123<br />
            <span className="font-medium">Staff:</span> staff / password123<br />
            <span className="font-medium">Owner:</span> owner / password123<br />
            <span className="font-medium">User:</span> user / password123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
