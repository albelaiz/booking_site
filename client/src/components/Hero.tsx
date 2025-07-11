
import React from 'react';
import SearchBar from './SearchBar';
import { Sun, Waves, Umbrella, Ship, Star, MapPin, Calendar, Crown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-20">
      {/* Beautiful Multi-layer Background */}
      <div className="absolute inset-0 z-0">
        {/* Main Background Image with better overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2400&q=90" 
            alt="Martil Beach Paradise" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        {/* Professional Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-200/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-white/50"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 -left-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-40 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-35 animate-blob animation-delay-4000"></div>
        
        {/* Beautiful Geometric Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232563eb' fill-opacity='0.3'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      {/* Minimal Floating Elements */}
      <div className="absolute bottom-20 left-10 text-blue-500/30 animate-float">
        <Waves size={48} className="drop-shadow-lg" />
      </div>
      <div className="absolute top-20 right-20 text-blue-400/25 animate-pulse">
        <Sun size={40} className="drop-shadow-lg" />
      </div>
      <div className="absolute bottom-32 right-16 text-blue-600/20 animate-bounce">
        <Ship size={36} className="drop-shadow-lg" />
      </div>
      
      Main Content
      <div className="relative z-20 container-custom">
        <div className="text-center text-gray-900 max-w-5xl mx-auto">
          
          
          {/* Professional Badge */}
          {/* <div className="inline-flex items-center px-6 py-3 mb-8 bg-blue-50 backdrop-blur-sm rounded-full border border-blue-200 shadow-lg">
            <Crown className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-blue-700 font-medium text-sm tracking-wide">Premium Accommodations</span>
          </div> */}
          
          {/* <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light mb-6 md:mb-8 leading-tight px-4">
            <span className="block mb-2 md:mb-4">
              <span className="text-gray-900 font-medium">
                Discover
                <span className="relative inline-block ml-2 md:ml-4">
                  Morocco
                  <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-blue-600"></div>
                </span>
              </span>
            </span>
            <span className="block text-gray-700 font-light">
              Your Perfect Coastal Escape
            </span>
          </h1> */}
          
          {/* <div className="mb-8 md:mb-12 px-4">
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-light leading-relaxed max-w-3xl mx-auto">
              Experience unparalleled comfort in carefully selected accommodations 
              along Morocco's stunning Mediterranean coastline.
            </p>
          </div> */}
          
          {/* Enhanced Search Section with Book Instantly */}
          <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl max-w-4xl mx-4 md:mx-auto mb-8 md:mb-16 border border-blue-100">
            <div className="mb-6 md:mb-8 text-center">
              {/* <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-full mb-4">
                <span className="text-blue-700 font-semibold text-sm tracking-wide">✨ Book Instantly, Travel Confidently ✨</span>
              </div> */}
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">Find Your Perfect Stay</h3>
              <p className="text-gray-600">Discover exceptional properties tailored to your preferences</p>
            </div>
            <SearchBar />
            
            {/* Trust indicators */}
            {/* <div className="mt-6 flex justify-center items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Instant Confirmation</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <span>24/7 Support</span>
              </div>
            </div> */}
          </div>
          
          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-100 shadow-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-blue-600 font-medium mb-2">Instant Booking</div>
              <div className="text-gray-600 text-sm">Book your perfect stay in just a few clicks</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-100 shadow-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-blue-600 font-medium mb-2">Best Locations</div>
              <div className="text-gray-600 text-sm">Prime spots across Morocco's coastline</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-100 shadow-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-blue-600 font-medium mb-2">24/7 Support</div>
              <div className="text-gray-600 text-sm">We're here to help whenever you need us</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
