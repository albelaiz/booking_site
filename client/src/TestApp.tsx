import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TestimonialsProvider } from './contexts/TestimonialsContext';
import { BookingsProvider } from './contexts/BookingsContext';
import { PropertiesProvider } from './contexts/PropertiesContext';
import { MessagesProvider } from './contexts/MessagesContext';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const TestApp = () => {
  console.log('TestApp component is rendering...');
  
  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <h1 className="text-4xl font-bold text-blue-900 mb-4">Test App Working!</h1>
      <QueryClientProvider client={queryClient}>
        <TestimonialsProvider>
          <BookingsProvider>
            <PropertiesProvider>
              <MessagesProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <div className="mt-4 p-4 bg-green-100 rounded">
                      ✅ All providers, toasters and Router loaded successfully!
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="*" element={<div>404 - Not found</div>} />
                      </Routes>
                    </div>
                  </BrowserRouter>
                </TooltipProvider>
              </MessagesProvider>
            </PropertiesProvider>
          </BookingsProvider>
        </TestimonialsProvider>
      </QueryClientProvider>
    </div>
  );
};

export default TestApp;
