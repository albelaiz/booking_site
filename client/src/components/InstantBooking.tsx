
import React from 'react';
import { Zap, Calendar, CreditCard, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstantBooking: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        {/* Main gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-blue-700/95 to-blue-800/90"></div>
        
        {/* Animated floating shapes */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        
        {/* Elegant pattern overlay */}
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M40 40c0-22.091-17.909-40-40-40v40h40zm0 0c0 22.091-17.909 40-40 40v-40h40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        {/* Subtle geometric accents */}
        <div className="absolute top-32 left-32 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 right-40 w-6 h-6 bg-white/10 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute top-2/3 left-1/4 w-3 h-3 bg-white/15 rounded-full animate-pulse animation-delay-3000"></div>
        
        {/* Diagonal light streaks */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent transform rotate-12"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 bg-white/10 rounded-full animate-ping"></div>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white leading-tight">
            Book Instantly, Travel Confidently
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Skip the wait! Many of our properties offer instant booking confirmation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="group text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Choose Your Dates</h3>
            <p className="text-blue-100 leading-relaxed">Select from available dates with real-time pricing</p>
          </div>
          <div className="group text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Secure Payment</h3>
            <p className="text-blue-100 leading-relaxed">Pay safely with international cards or local payment methods</p>
          </div>
          <div className="group text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Instant Confirmation</h3>
            <p className="text-blue-100 leading-relaxed">Get your booking details and travel information immediately</p>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            to="/properties" 
            className="group inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl hover:bg-blue-50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <Zap className="w-6 h-6 mr-3 group-hover:animate-pulse" />
            Find Instant Book Properties
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InstantBooking;
