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
    <div className="w-full max-w-5xl mx-auto bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-2">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-0">
        {/* Location Field - Exactly 25% width on desktop */}
        <div className="flex-1 p-3 border-b md:border-b-0 md:border-r border-gray-200/50 last:border-r-0">
          <label className="flex items-center text-xs font-medium text-gray-500 mb-2">
            <MapPin className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Location
          </label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full text-gray-900 focus:outline-none border-0 p-0 h-auto">
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg">
              {locationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Check-in Field - Exactly 25% width on desktop */}
        <div className="flex-1 p-3 border-b md:border-b-0 md:border-r border-gray-200/50 last:border-r-0">
          <label className="flex items-center text-xs font-medium text-gray-500 mb-2">
            <Calendar className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Check-in Date
          </label>
          <input
            type="date"
            className="w-full text-gray-900 focus:outline-none border-0 p-0"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Check-out Field - Exactly 25% width on desktop */}
        <div className="flex-1 p-3 border-b md:border-b-0 md:border-r border-gray-200/50 last:border-r-0">
          <label className="flex items-center text-xs font-medium text-gray-500 mb-2">
            <Calendar className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Check-out Date
          </label>
          <input
            type="date"
            className="w-full text-gray-900 focus:outline-none border-0 p-0"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Guests & Search Field - Exactly 25% width on desktop */}
        <div className="flex-1 p-3 flex flex-col justify-between">
          <label className="flex items-center text-xs font-medium text-gray-500 mb-2">
            <Users className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Guests
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex items-center border border-gray-300 rounded-md flex-1">
              <button
                type="button"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                disabled={guests <= 1}
                className="p-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease guests"
              >
                <Minus className="w-3 h-3 text-gray-600" />
              </button>
              <span className="flex-1 text-center py-1 text-sm font-medium">
                {guests}
              </span>
              <button
                type="button"
                onClick={() => setGuests(Math.min(10, guests + 1))}
                disabled={guests >= 10}
                className="p-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase guests"
              >
                <Plus className="w-3 h-3 text-gray-600" />
              </button>
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-1 shadow-lg hover:shadow-xl"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline text-sm">Search</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;