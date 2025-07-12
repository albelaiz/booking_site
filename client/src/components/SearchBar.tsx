
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Calendar, Users, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
  className?: string;
  variant?: 'hero' | 'header' | 'compact';
}

interface SearchFilters {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  priceRange: [number, number];
  propertyType: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  className = '',
  variant = 'hero' 
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    priceRange: [0, 1000],
    propertyType: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const moroccanCities = [
    'Tetouan', 'Martil', 'Chefchaouen', 'Tangier', 'Rabat', 
    'Casablanca', 'Marrakech', 'Fes', 'Agadir', 'Essaouira'
  ];

  const propertyTypes = [
    { value: '', label: 'All Types' },
    { value: 'villa', label: 'Villa' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'riad', label: 'Riad' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'guesthouse', label: 'Guesthouse' }
  ];

  // Handle location input and suggestions
  const handleLocationChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, location: value }));
    
    if (value.length > 0) {
      const suggestions = moroccanCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(suggestions);
      setShowLocationDropdown(true);
    } else {
      setShowLocationDropdown(false);
    }
  }, []);

  // Handle search submission
  const handleSearch = useCallback(() => {
    if (onSearch) {
      onSearch(filters);
    } else {
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '' && !(Array.isArray(value) && value.every(v => v === 0))) {
          searchParams.set(key, Array.isArray(value) ? value.join(',') : value.toString());
        }
      });
      navigate(`/properties?${searchParams.toString()}`);
    }
  }, [filters, onSearch, navigate]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getVariantClasses = () => {
    switch (variant) {
      case 'hero':
        return 'bg-white shadow-2xl rounded-2xl p-6';
      case 'header':
        return 'bg-white shadow-lg rounded-xl p-4';
      case 'compact':
        return 'bg-white shadow-md rounded-lg p-3';
      default:
        return 'bg-white shadow-2xl rounded-2xl p-6';
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className={getVariantClasses()}>
        {/* Main Search Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
          {/* Location */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Where
            </label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleLocationChange(e.target.value)}
              placeholder="Search destinations"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {/* Location Suggestions Dropdown */}
            {showLocationDropdown && locationSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {locationSuggestions.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setFilters(prev => ({ ...prev, location: city }));
                      setShowLocationDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center"
                  >
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Check-in */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Check-in
            </label>
            <input
              type="date"
              value={filters.checkIn}
              onChange={(e) => setFilters(prev => ({ ...prev, checkIn: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Check-out */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Check-out
            </label>
            <input
              type="date"
              value={filters.checkOut}
              onChange={(e) => setFilters(prev => ({ ...prev, checkOut: e.target.value }))}
              min={filters.checkIn || new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Guests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Guests
            </label>
            <select
              value={filters.guests}
              onChange={(e) => setFilters(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </div>

          {/* Search Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="More filters"
            >
              <Filter className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleSearch}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (MAD per night)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      priceRange: [parseInt(e.target.value) || 0, prev.priceRange[1]] 
                    }))}
                    placeholder="Min"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      priceRange: [prev.priceRange[0], parseInt(e.target.value) || 1000] 
                    }))}
                    placeholder="Max"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilters({
                      location: '',
                      checkIn: '',
                      checkOut: '',
                      guests: 1,
                      priceRange: [0, 1000],
                      propertyType: ''
                    });
                    setShowFilters(false);
                  }}
                  className="flex items-center justify-center w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
