
import React from 'react';
import { Zap, Calendar, CreditCard, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstantBooking: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-moroccan-blue to-moroccan-blue/90 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-moroccan-gold rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8 text-moroccan-dark" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">Book Instantly, Travel Confidently</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Skip the wait! Many of our properties offer instant booking confirmation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-moroccan-gold" />
            <h3 className="text-xl font-semibold mb-2">Choose Your Dates</h3>
            <p className="opacity-90">Select from available dates with real-time pricing</p>
          </div>
          <div className="text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-moroccan-gold" />
            <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
            <p className="opacity-90">Pay safely with international cards or local payment methods</p>
          </div>
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-moroccan-gold" />
            <h3 className="text-xl font-semibold mb-2">Instant Confirmation</h3>
            <p className="opacity-90">Get your booking details and travel information immediately</p>
          </div>
        </div>
        
        <div className="text-center">
          <Link to="/properties" className="btn-secondary inline-flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Find Instant Book Properties
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InstantBooking;
