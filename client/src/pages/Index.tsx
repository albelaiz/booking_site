import { Link } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Shield, 
  Heart, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import FeaturedProperties from '../components/FeaturedProperties';
import DestinationShowcase from '../components/DestinationShowcase';
import BookingAdvantages from '../components/BookingAdvantages';
import InstantBooking from '../components/InstantBooking';
import TestimonialsSection from '../components/TestimonialsSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        
        {/* Destination Showcase Section */}
        <DestinationShowcase />
        
        {/* Featured Properties Section */}
        <FeaturedProperties />
        
        {/* Booking Advantages Section */}
        <BookingAdvantages />
        
        {/* Professional Testimonials Section */}
        <TestimonialsSection />
        
        {/* Enhanced About BayHaven Section */}
        <section className="py-20 bg-white relative overflow-hidden">
          {/* Beautiful Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/30 via-transparent to-white"></div>
            <div className="absolute top-20 right-10 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-blob animation-delay-2000"></div>
            <div className="absolute inset-0 opacity-5 bg-mesh-pattern"></div>
          </div>
          
          <div className="container-custom relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Discover Morocco's Hidden Gem
                </div>
                
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gray-900">
                  Experience the Magic of 
                  <span className="text-blue-600 block">BayHaven</span>
                </h2>
                
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                  <p>
                    Nestled on Morocco's stunning Mediterranean coast, BayHaven is where 
                    <strong className="text-gray-900"> authentic Moroccan culture meets coastal luxury</strong>. 
                    This charming seaside destination offers pristine beaches, vibrant traditions, and an 
                    atmosphere that captures hearts instantly.
                  </p>
                  
                  <p>
                    Just minutes from historic Tetouan, BayHaven provides the perfect blend of 
                    <strong className="text-blue-600">modern comfort and timeless Moroccan hospitality</strong>. 
                    Our curated collection of properties ensures every traveler finds their perfect coastal retreat.
                  </p>
                </div>

                {/* Enhanced feature highlights */}
                <div className="grid grid-cols-2 gap-6 mt-8 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Premium Properties</div>
                      <div className="text-sm text-gray-600">Hand-picked accommodations</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Prime Locations</div>
                      <div className="text-sm text-gray-600">Beachfront & city center</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Secure Booking</div>
                      <div className="text-sm text-gray-600">Protected reservations</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Local Support</div>
                      <div className="text-sm text-gray-600">24/7 assistance</div>
                    </div>
                  </div>
                </div>
                
                <Link 
                  to="/about" 
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all duration-300 group"
                >
                  Discover Our Story
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
              
              <div className="order-1 lg:order-2 relative">
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80" 
                    alt="Marina Smir Resort" 
                    className="w-full h-[400px] object-cover"
                  />
                  
                  {/* Overlay stats card */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">4.9★</div>
                        <div className="text-xs text-gray-600">Guest Rating</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">150+</div>
                        <div className="text-xs text-gray-600">Properties</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">5K+</div>
                        <div className="text-xs text-gray-600">Happy Guests</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Instant Booking Section */}
        <InstantBooking />
        
        {/* Enhanced Testimonials Section */}
        <section className="py-20 bg-blue-50 relative overflow-hidden">
          {/* Beautiful Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/50 via-transparent to-blue-100/30"></div>
            <div className="absolute top-32 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob"></div>
            <div className="absolute bottom-20 right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.1'%3E%3Cpath d='M40 40c0-22.091-17.909-40-40-40v40h40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          
          <div className="container-custom relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-white rounded-full text-blue-700 text-sm font-medium mb-6 shadow-sm">
                <Star className="w-4 h-4 mr-2" />
                Trusted by Thousands
              </div>
              
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gray-900">
                Stories from Our 
                <span className="text-blue-600 block">Happy Travelers</span>
              </h2>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover why guests choose BayHaven for their perfect Moroccan getaway. 
                Real stories from real travelers who experienced the magic.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Enhanced Testimonial 1 */}
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                
                <div className="flex items-center mb-6">
                  <div className="flex space-x-1 mr-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-blue-600">Exceptional</span>
                </div>
                
                <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                  "BayHaven made our Morocco dream trip come true! From the luxury riad in Marrakech to the beachfront villa in Martil, every property exceeded our expectations. The booking process was seamless and the local support team was incredible."
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    S
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sophie & Pierre</h4>
                    <p className="text-gray-500 text-sm flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      Paris, France
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Testimonial 2 */}
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                
                <div className="flex items-center mb-6">
                  <div className="flex space-x-1 mr-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-blue-600">Outstanding</span>
                </div>
                
                <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                  "We booked a 10-day Morocco tour through BayHaven - staying in Fes, Chefchaouen, and ending in Essaouira. Each property was carefully selected and perfectly located. The variety of authentic accommodations made our journey unforgettable."
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    A
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ahmed & Laila</h4>
                    <p className="text-gray-500 text-sm flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      Casablanca, Morocco
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Testimonial 3 */}
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                
                <div className="flex items-center mb-6">
                  <div className="flex space-x-1 mr-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-blue-600">Perfect</span>
                </div>
                
                <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                  "Our family adventure in Morocco was perfectly planned with BayHaven. From the desert camp in Merzouga to the coastal apartment in Agadir, every stay was family-friendly with amazing amenities. The kids still talk about the camel rides and surfing lessons!"
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    J
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">John & Maria</h4>
                    <p className="text-gray-500 text-sm flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      London, UK
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-16 text-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">4.9/5</div>
                  <div className="text-gray-600 text-sm">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">12K+</div>
                  <div className="text-gray-600 text-sm">Happy Guests</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">150+</div>
                  <div className="text-gray-600 text-sm">Properties</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                  <div className="text-gray-600 text-sm">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Enhanced Call to Action Section */}
        <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
          {/* Stunning Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/20 via-transparent to-blue-900/20"></div>
            <div className="absolute top-20 right-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
            <div className="absolute top-40 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpolygon points='60 0 72 48 120 60 72 72 60 120 48 72 0 60 48 48'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          
          <div className="container-custom relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4 mr-2" />
                Start Your Morocco Adventure Today
              </div>
              
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
                Ready to Experience the
                <span className="block text-blue-100">Magic of BayHaven?</span>
              </h2>
              
              <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Join thousands of travelers who have discovered Morocco's coastal paradise. 
                Book your dream vacation property today and create memories that last a lifetime.
              </p>
              
              {/* Enhanced CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                <Link 
                  to="/properties" 
                  className="group inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl hover:bg-blue-50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Browse Properties
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                
                <Link 
                  to="/contact" 
                  className="inline-flex items-center px-8 py-4 border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  Plan My Trip
                </Link>
              </div>
              
              {/* Trust badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/20">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-2">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-blue-100">Secure Booking</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-2">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-blue-100">4.9★ Rating</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-2">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-blue-100">24/7 Support</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-2">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-blue-100">Best Locations</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
