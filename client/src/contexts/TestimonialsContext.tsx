import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
  propertyStayed?: string;
}

interface TestimonialsContextType {
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void;
  updateTestimonial: (id: number, updates: Partial<Testimonial>) => void;
  deleteTestimonial: (id: number) => void;
  loading: boolean;
  error: string | null;
}

const TestimonialsContext = createContext<TestimonialsContextType | undefined>(undefined);

// Initial testimonials data
const initialTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    rating: 5,
    comment: "Absolutely magical experience! The Mediterranean views were breathtaking and the luxury amenities exceeded all expectations. TamudaStay truly offers the perfect blend of Moroccan culture and coastal elegance.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    propertyStayed: "Oceanview Villa Martil"
  },
  {
    id: 2,
    name: "Ahmed Al-Rashid",
    location: "Dubai, UAE",
    rating: 5,
    comment: "The authenticity combined with modern luxury is unmatched. Every detail was carefully curated, from the traditional Moroccan décor to the world-class service. Highly recommended for discerning travelers.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    propertyStayed: "Luxury Riad Tetouan"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    location: "Barcelona, Spain",
    rating: 5,
    comment: "A hidden gem on Morocco's coast! The property was immaculate, the location perfect for exploring both beach and culture. The booking process was seamless and the host was incredibly welcoming.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    propertyStayed: "Seaside Apartment M'diq"
  }
];

export const TestimonialsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load testimonials from localStorage or use initial data
  useEffect(() => {
    try {
      const savedTestimonials = localStorage.getItem('testimonials');
      if (savedTestimonials) {
        setTestimonials(JSON.parse(savedTestimonials));
      } else {
        setTestimonials(initialTestimonials);
        localStorage.setItem('testimonials', JSON.stringify(initialTestimonials));
      }
    } catch (err) {
      console.error('Error loading testimonials:', err);
      setError('Failed to load testimonials');
      setTestimonials(initialTestimonials);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save testimonials to localStorage whenever they change
  useEffect(() => {
    if (!loading && testimonials.length > 0) {
      try {
        localStorage.setItem('testimonials', JSON.stringify(testimonials));
      } catch (err) {
        console.error('Error saving testimonials:', err);
        setError('Failed to save testimonials');
      }
    }
  }, [testimonials, loading]);

  const addTestimonial = (newTestimonial: Omit<Testimonial, 'id'>) => {
    try {
      const testimonial: Testimonial = {
        ...newTestimonial,
        id: Date.now(), // Simple ID generation
      };
      setTestimonials(prev => [...prev, testimonial]);
      setError(null);
    } catch (err) {
      console.error('Error adding testimonial:', err);
      setError('Failed to add testimonial');
    }
  };

  const updateTestimonial = (id: number, updates: Partial<Testimonial>) => {
    try {
      setTestimonials(prev => 
        prev.map(testimonial => 
          testimonial.id === id 
            ? { ...testimonial, ...updates }
            : testimonial
        )
      );
      setError(null);
    } catch (err) {
      console.error('Error updating testimonial:', err);
      setError('Failed to update testimonial');
    }
  };

  const deleteTestimonial = (id: number) => {
    try {
      setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      setError('Failed to delete testimonial');
    }
  };

  const value: TestimonialsContextType = {
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    loading,
    error,
  };

  return (
    <TestimonialsContext.Provider value={value}>
      {children}
    </TestimonialsContext.Provider>
  );
};

export const useTestimonials = (): TestimonialsContextType => {
  const context = useContext(TestimonialsContext);
  if (context === undefined) {
    throw new Error('useTestimonials must be used within a TestimonialsProvider');
  }
  return context;
};
