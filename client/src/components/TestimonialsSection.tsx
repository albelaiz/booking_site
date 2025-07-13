import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote } from 'lucide-react';
import { useTestimonials } from '../contexts/TestimonialsContext';

const TestimonialsSection: React.FC = () => {
  const { testimonials, loading, error } = useTestimonials();

  if (loading) {
    return (
      <section className="section-padding bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="container-custom text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="container-custom text-center">
          <p className="text-red-600">Error loading testimonials: {error}</p>
        </div>
      </section>
    );
  }
  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Professional Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-blue-300/20 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-professional-fade-in">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 rounded-full text-blue-700 text-sm font-semibold mb-6 backdrop-blur-sm">
            <Star className="w-4 h-4 mr-2 text-blue-600" />
            Guest Experiences
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-gray-900">
            What Our Guests Say About{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 animate-premium-gradient">
              TamudaStay
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover why travelers from around the world choose TamudaStay for their 
            unforgettable Mediterranean experiences in Morocco.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="card-pro p-8 hover-lift animate-professional-slide-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <Quote className="w-8 h-8 text-blue-500/40" />
              </div>
              
              {/* Rating Stars */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current animate-professional-float" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              
              {/* Testimonial Text */}
              <p className="text-gray-700 leading-relaxed mb-6 font-medium">
                "{testimonial.comment}"
              </p>
              
              {/* Property Stayed */}
              {testimonial.propertyStayed && (
                <div className="mb-4 px-3 py-1 bg-gradient-to-r from-blue-50 to-blue-100 rounded-full inline-block">
                  <span className="text-xs text-blue-700 font-semibold">
                    Stayed at: {testimonial.propertyStayed}
                  </span>
                </div>
              )}
              
              {/* Guest Info */}
              <div className="flex items-center pt-4 border-t border-gray-100">
                <div className="relative">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-16 animate-professional-fade-in">
          <Link 
            to="/properties" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-xl shadow-luxury hover:shadow-glow transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-900"
          >
            <Star className="w-5 h-5 mr-2" />
            Join Our Happy Guests
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
