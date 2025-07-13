
import React from 'react';
import SearchBar from './SearchBar';
import { Sun, Waves, Umbrella, Ship, Star, MapPin, Calendar, Crown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 to-white">
      {/* Simple Professional Background */}
      <div className="absolute inset-0 z-0">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-blue-500/5 to-transparent"></div>
        
        {/* Elegant floating shapes */}
        <div className="absolute top-20 right-20 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 container-custom">
        <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
            {/* <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
              Discover Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Moroccan Escape
              </span>
            </h1> */}

            {/* <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              Experience the magic of Morocco's Mediterranean coast with premium accommodations and 
              discover authentic Moroccan experiences across the kingdom's most captivating destinations.
            </p> */}

            {/* Professional Search Section */}
            <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl max-w-4xl mx-4 md:mx-auto mb-8 md:mb-16 border border-blue-200/30">
              <div className="mb-4 md:mb-6">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">Find Your Perfect Stay</h3>
                <p className="text-gray-600">Discover exceptional properties tailored to your preferences</p>
              </div>
              <SearchBar />
            </div>

            {/* Why Choose TamudaStay Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-blue-200/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-blue-600 mb-3">
                  <MapPin className="w-8 h-8" />
                </div>
                <div className="text-blue-600 font-medium mb-2">Prime Locations</div>
                <div className="text-gray-600 text-sm">Beachfront properties in Martil, Tamuda Bay & Tetouan's historic center</div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-blue-200/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-blue-600 mb-3">
                  <Star className="w-8 h-8" />
                </div>
                <div className="text-blue-600 font-medium mb-2">Instant Booking</div>
                <div className="text-gray-600 text-sm">Book your Mediterranean getaway in seconds with our seamless platform</div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-blue-200/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
