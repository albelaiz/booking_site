
import React from 'react';
import SearchBar from './SearchBar';
import { Sun, Waves, Umbrella, Ship, Star, MapPin, Calendar, Crown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Elegant Moroccan Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80" 
          alt="Beautiful Moroccan Coast" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-800/60 to-blue-900/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-20 left-10 text-white/20 animate-pulse">
        <Waves size={48} />
      </div>
      <div className="absolute top-20 right-20 text-yellow-400/30 animate-pulse">
        <Sun size={40} />
      </div>

      {/* Main Content */}
      <div className="relative z-20 container-custom">
        <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
              Discover Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Moroccan Escape
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              Experience the magic of Morocco's Mediterranean coast with premium accommodations and 
              discover authentic Moroccan experiences across the kingdom's most captivating destinations.
            </p>

            {/* Professional Search Section */}
            <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl max-w-4xl mx-4 md:mx-auto mb-8 md:mb-16 border border-blue-100">
              <div className="mb-4 md:mb-6">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">Find Your Perfect Stay</h3>
                <p className="text-gray-600">Discover exceptional properties tailored to your preferences</p>
              </div>
              <SearchBar />
            </div>

            {/* Why Choose TamudaStay Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-100 shadow-lg">
                <div className="text-blue-600 mb-3">
                  <MapPin className="w-8 h-8" />
                </div>
                <div className="text-blue-600 font-medium mb-2">Prime Locations</div>
                <div className="text-gray-600 text-sm">Beachfront properties in Martil, Tamuda Bay & Tetouan's historic center</div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-100 shadow-lg">
                <div className="text-blue-600 mb-3">
                  <Star className="w-8 h-8" />
                </div>
                <div className="text-blue-600 font-medium mb-2">Instant Booking</div>
                <div className="text-gray-600 text-sm">Book your Mediterranean getaway in seconds with our seamless platform</div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-100 shadow-lg">
                <div className="text-blue-600 mb-3">
                  <Crown className="w-8 h-8" />
                </div>
                <div className="text-blue-600 font-medium mb-2">24/7 Support</div>
                <div className="text-gray-600 text-sm">Local concierge services and multilingual support for your comfort</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
