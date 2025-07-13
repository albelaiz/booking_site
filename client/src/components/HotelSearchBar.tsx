import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

interface HotelSearchBarProps {
  onSearch?: (searchData: {
    destination: string;
    checkIn: string;
    checkOut: string;
    travelers: number;
  }) => void;
  className?: string;
}

const HotelSearchBar: React.FC<HotelSearchBarProps> = ({ onSearch, className = '' }) => {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [travelers, setTravelers] = useState(1);

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        destination,
        checkIn,
        checkOut,
        travelers
      });
    }
  };

  return (
    <div className={`w-full bg-gray-100 p-4 rounded-2xl ${className}`}>
      <div className="bg-white rounded-xl shadow-lg p-2 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-1 items-stretch lg:items-center">
          
          {/* Destination Field */}
          <div className="flex-1 min-w-0">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
                <MapPin className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search for a destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-0 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none text-gray-900 placeholder-gray-500 bg-gray-50 hover:bg-gray-100 focus:bg-white transition-all duration-200 text-base font-medium"
              />
            </div>
          </div>

          {/* Date Fields */}
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-1 flex-1">
            {/* Check-in Date */}
            <div className="flex-1 min-w-0">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
                  <Calendar className="h-5 w-5" />
                </div>
                <input
                  type="date"
                  placeholder="Check-in"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-0 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none text-gray-900 placeholder-gray-500 bg-gray-50 hover:bg-gray-100 focus:bg-white transition-all duration-200 text-base font-medium"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Check-out Date */}
            <div className="flex-1 min-w-0">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
                  <Calendar className="h-5 w-5" />
                </div>
                <input
                  type="date"
                  placeholder="Check-out"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-0 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none text-gray-900 placeholder-gray-500 bg-gray-50 hover:bg-gray-100 focus:bg-white transition-all duration-200 text-base font-medium"
                  min={checkIn || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          {/* Travelers Field */}
          <div className="flex-1 lg:flex-initial lg:min-w-[200px]">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
                <Users className="h-5 w-5" />
              </div>
              <select
                value={travelers}
                onChange={(e) => setTravelers(parseInt(e.target.value))}
                className="w-full pl-12 pr-8 py-4 border-0 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none text-gray-900 bg-gray-50 hover:bg-gray-100 focus:bg-white transition-all duration-200 text-base font-medium appearance-none cursor-pointer"
              >
                <option value={1}>1 Traveler</option>
                <option value={2}>2 Travelers</option>
                <option value={3}>3 Travelers</option>
                <option value={4}>4 Travelers</option>
                <option value={5}>5 Travelers</option>
                <option value={6}>6 Travelers</option>
                <option value={7}>7 Travelers</option>
                <option value={8}>8+ Travelers</option>
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex-shrink-0">
            <button
              onClick={handleSearch}
              className="w-full lg:w-14 h-14 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-pink-500/30 touch-friendly"
              aria-label="Search hotels"
            >
              <Search className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelSearchBar;
