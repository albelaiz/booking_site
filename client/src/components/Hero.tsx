
import React from 'react';
import SearchBar from './SearchBar';
import { Sun, Waves, Umbrella, Ship } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative h-[650px] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
          alt="Martil Beach" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30"></div>
        
        {/* Beach-themed Pattern Overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      {/* Beach-themed Floating Elements */}
      <div className="absolute bottom-20 left-10 text-white/20 animate-bounce">
        <Waves size={48} />
      </div>
      <div className="absolute top-32 right-20 text-white/20 animate-pulse">
        <Sun size={42} />
      </div>
      <div className="absolute bottom-40 right-16 text-white/10">
        <Ship size={36} />
      </div>
      
      {/* Hero Content */}
      <div className="container-custom relative z-10 text-white">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium mb-6 leading-tight animate-fade-up">
            Discover <span className="text-moroccan-gold">Morocco's Hidden Gems</span> - From Martil to the Atlas Mountains
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-10 animate-fade-up animate-delay-100">
            Book unique accommodations across Morocco - beachfront villas in Martil, riads in Marrakech, mountain retreats in Chefchaouen, and desert camps in Sahara
          </p>
          
          {/* Enhanced Search Bar Container with beach-themed styling */}
          <div className="bg-white/15 backdrop-blur-md p-5 rounded-xl border border-white/30 shadow-xl animate-fade-up animate-delay-200">
            <SearchBar />
          </div>
          
          {/* Enhanced Beach-themed Quick Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 text-center animate-fade-up animate-delay-300">
            <div className="bg-white/15 backdrop-blur-sm rounded-lg py-5 px-3 border border-white/20 shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-white/20">
              <Sun className="h-6 w-6 mx-auto mb-4 text-moroccan-gold" />
              <div className="text-3xl font-serif font-medium text-moroccan-gold mb-1">150+</div>
              <div className="text-sm opacity-80">Properties Across Morocco</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg py-5 px-3 border border-white/20 shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-white/20">
              <Umbrella className="h-6 w-6 mx-auto mb-4 text-moroccan-gold" />
              <div className="text-3xl font-serif font-medium text-moroccan-gold mb-1">4.9</div>
              <div className="text-sm opacity-80">Guest Satisfaction</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg py-5 px-3 border border-white/20 shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-white/20">
              <Waves className="h-6 w-6 mx-auto mb-4 text-moroccan-gold" />
              <div className="text-3xl font-serif font-medium text-moroccan-gold mb-1">5000+</div>
              <div className="text-sm opacity-80">Happy Travelers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
