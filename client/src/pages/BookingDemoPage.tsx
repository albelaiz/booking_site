import React, { useState } from 'react';
import EnhancedBookingForm from '../components/EnhancedBookingForm';
import { Button } from '../components/ui/button';

const BookingDemoPage: React.FC = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Demo property data
  const demoProperty = {
    id: 1,
    title: "Luxury Beach Villa in Morocco",
    price: 150,
    priceUnit: "night",
    capacity: 6
  };

  const handleBookingSuccess = (booking: any) => {
    console.log('Booking successful:', booking);
    setShowBookingForm(false);
    alert(`Booking created successfully! Booking ID: ${booking.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Enhanced Booking System Demo
          </h1>

          {/* Property Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img 
                  src="/placeholder.svg" 
                  alt={demoProperty.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {demoProperty.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  Experience the perfect blend of luxury and comfort in this stunning beachfront villa. 
                  With breathtaking ocean views and modern amenities, it's ideal for families and groups 
                  looking for an unforgettable vacation.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-lg font-semibold text-moroccan-gold">
                    ${demoProperty.price} per {demoProperty.priceUnit}
                  </p>
                  <p className="text-gray-600">
                    Capacity: {demoProperty.capacity} guests
                  </p>
                </div>
                
                {!showBookingForm && (
                  <Button 
                    onClick={() => setShowBookingForm(true)}
                    className="bg-moroccan-gold hover:bg-moroccan-gold/90 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Book This Property
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Booking Form */}
          {showBookingForm && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <EnhancedBookingForm
                property={demoProperty}
                onBookingSuccess={handleBookingSuccess}
                onClose={() => setShowBookingForm(false)}
              />
            </div>
          )}

          {/* Features Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Enhanced Booking System Features
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">For Registered Users:</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• One booking per property (updates existing)</li>
                  <li>• Automatic booking history tracking</li>
                  <li>• Seamless booking updates</li>
                  <li>• Profile-based pre-filled forms</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Smart Availability:</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Real-time availability checking</li>
                  <li>• Overlap prevention system</li>
                  <li>• Visual booked dates display</li>
                  <li>• Instant conflict resolution</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Test the System:</h4>
              <ol className="text-blue-700 space-y-1">
                <li>1. Try booking dates that overlap with existing bookings</li>
                <li>2. See how the system shows booked dates when conflicts occur</li>
                <li>3. Test with different date ranges to see availability checking</li>
                <li>4. Notice real-time price calculation and validation</li>
              </ol>
            </div>
          </div>

          {/* API Endpoints Documentation */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Available API Endpoints
            </h3>
            
            <div className="space-y-4">
              <div>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  GET /api/properties/{'{id}'}/availability?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD
                </code>
                <p className="text-gray-600 text-sm mt-1">Check if property is available for given dates</p>
              </div>
              
              <div>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  GET /api/properties/{'{id}'}/booked-dates
                </code>
                <p className="text-gray-600 text-sm mt-1">Get all booked date ranges for a property</p>
              </div>
              
              <div>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  POST /api/bookings
                </code>
                <p className="text-gray-600 text-sm mt-1">Create or update booking (smart logic based on user)</p>
              </div>
              
              <div>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  GET /api/users/{'{id}'}/bookings
                </code>
                <p className="text-gray-600 text-sm mt-1">Get all bookings for a specific user</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDemoPage;
