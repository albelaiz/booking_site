import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../hooks/use-toast';
import { Search, MapPin, Calendar, Users, Plus, Minus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const SearchBar = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const locationOptions = [
    { value: 'martil', label: 'Martil - Beach Paradise' },
    { value: 'cabo-negro', label: 'Cabo Negro - Coastal Resort' },
    { value: 'mdiq', label: "M'diq - Fishing Village Charm" },
    { value: 'tetouan', label: 'Tetouan - Andalusian Heritage' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!location) {
      toast({
        title: "Location required",
        description: "Please select a location to search.",
        variant: "destructive",
      });
      return;
    }

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (checkInDate >= checkOutDate) {
        toast({
          title: "Invalid dates",
          description: "Check-out date must be after check-in date.",
          variant: "destructive",
        });
        return;
      }
    }

    // Navigate with search params
    const searchParams = new URLSearchParams();
    const selectedLocation = locationOptions.find(opt => opt.value === location);
    if (selectedLocation) searchParams.set('location', selectedLocation.label);
    if (checkIn) searchParams.set('checkIn', checkIn);
    if (checkOut) searchParams.set('checkOut', checkOut);
    searchParams.set('guests', guests.toString());

    toast({
      title: "Search started",
      description: `Searching for properties in ${selectedLocation?.label || location}`,
    });

    // Navigate to properties page with search params
    navigate(`/properties?${searchParams.toString()}`);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-2 sm:p-4 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {/* Location */}
        <div className="relative p-3 border border-gray-200 rounded-lg sm:border-0 sm:p-4">
          <label className="flex items-center text-xs font-medium text-gray-500 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            Where
          </label>
          <select 
            value={location} 
            onChange={(e) => setLocation(e.target.value)}
            className="w-full text-gray-900 focus:outline-none text-base sm:text-sm min-h-[44px] sm:min-h-auto"
          >
            {locationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="p-3 border-b md:border-b-0 md:border-r border-gray-200">
          <label className="flex items-center text-xs font-medium text-gray-500 mb-1">
            <Calendar className="w-3.5 h-3.5 mr-1 text-moroccan-blue" />
            Check-in Date
          </label>
          <input
            type="date"
            className="w-full text-gray-900 focus:outline-none"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split('T')[0]} // Today's date as minimum
          />
        </div>

        <div className="p-3 border-b md:border-b-0 md:border-r border-gray-200">
          <label className="flex items-center text-xs font-medium text-gray-500 mb-1">
            <Calendar className="w-3.5 h-3.5 mr-1 text-moroccan-blue" />
            Check-out Date
          </label>
          <input
            type="date"
            className="w-full text-gray-900 focus:outline-none"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="flex items-center space-x-3 p-3">
          <div className="flex-1">
            <label className="flex items-center text-xs font-medium text-gray-500 mb-1">
              <Users className="w-3.5 h-3.5 mr-1 text-moroccan-blue" />
              Guests
            </label>
            <div className="guest-counter-container">
              <button
                type="button"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                disabled={guests <= 1}
                className="guest-counter-button guest-selector-button"
                aria-label="Decrease guests"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="guest-counter-display guest-selector-display">
                {guests} Guest{guests !== 1 ? 's' : ''}
              </span>
              <button
                type="button"
                onClick={() => setGuests(Math.min(10, guests + 1))}
                disabled={guests >= 10}
                className="guest-counter-button guest-selector-button"
                aria-label="Increase guests"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="h-full flex items-center space-x-2 bg-moroccan-blue hover:bg-moroccan-blue/90 text-white px-5 py-3 rounded-lg transition duration-300 shadow-button"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;