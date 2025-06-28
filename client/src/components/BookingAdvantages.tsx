
import React from 'react';
import { Shield, Clock, Award, HeadphonesIcon, CreditCard, MapPin } from 'lucide-react';

const BookingAdvantages: React.FC = () => {
  const advantages = [
    {
      icon: Shield,
      title: 'Secure Booking',
      description: 'Your payment and personal information are protected with bank-level security'
    },
    {
      icon: Clock,
      title: 'Instant Confirmation',
      description: 'Get immediate booking confirmation and detailed property information'
    },
    {
      icon: Award,
      title: 'Verified Properties',
      description: 'All accommodations are personally inspected and verified by our local team'
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Round-the-clock customer support in Arabic, French, English, and Spanish'
    },
    {
      icon: MapPin,
      title: 'Local Expertise',
      description: 'Get insider tips and recommendations from our Morocco travel specialists'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="section-title text-center mx-auto">Why Book with BayHaven?</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Experience the difference of booking with Morocco's premier accommodation platform
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <div key={advantage.title} className="text-center group animate-fade-up" style={{animationDelay: `${index * 100}ms`}}>
                <div className="w-16 h-16 bg-moroccan-blue/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-moroccan-blue/20 transition-colors duration-300">
                  <Icon className="w-8 h-8 text-moroccan-blue" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4">{advantage.title}</h3>
                <p className="text-gray-600 leading-relaxed">{advantage.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BookingAdvantages;
