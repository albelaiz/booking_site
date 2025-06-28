
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useProperties } from '../contexts/PropertiesContext';
import { Property } from '../data/properties';
import PropertyCard from '../components/PropertyCard';
import PropertyMap from '../components/PropertyMap';
import { MapPin, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '../components/ui/button';

const PropertiesPage = () => {
  const { properties } = useProperties();
  const [searchParams] = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get search params
  const location = searchParams.get('location');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guestsParam = searchParams.get('guests');
  const guests = guestsParam ? parseInt(guestsParam, 10) : undefined;

  useEffect(() => {
    // Filter properties based on search params
    let filtered = [...properties];

    if (location) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (guests) {
      filtered = filtered.filter(property => property.capacity >= guests);
    }

    // Note: In a real application, you would filter by dates as well
    // This is simplified for the demo

    setFilteredProperties(filtered);
  }, [properties, location, checkIn, checkOut, guests]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-16">
        <div className="container-custom">
          {/* Search summary */}
          <div className="mb-10 animate-fade-in">
            <h1 className="text-3xl font-serif font-medium mb-3">Properties in {location || 'Martil'}</h1>
            <p className="text-gray-600">
              {filteredProperties.length} properties found
              {guests ? ` for ${guests} guests` : ''}
              {checkIn && checkOut ? ` from ${new Date(checkIn).toLocaleDateString()} to ${new Date(checkOut).toLocaleDateString()}` : ''}
            </p>
          </div>
          
          {/* View toggle and filters */}
          <div className="bg-white p-5 rounded-lg shadow-subtle mb-8 animate-fade-in">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <button 
                className="flex items-center gap-2 text-moroccan-blue font-medium hover:text-moroccan-blue/80 transition-colors"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span>Filters</span>
              </button>
              <div className="flex gap-2">
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="shadow-button"
                >
                  <List className="mr-1 h-4 w-4" />
                  List View
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="shadow-button"
                >
                  <MapPin className="mr-1 h-4 w-4" />
                  Map View
                </Button>
              </div>
            </div>
            
            {/* Expanded filter options */}
            {isFilterOpen && (
              <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                    <span className="text-gray-500">to</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                    <option value="">All Types</option>
                    <option value="villa">Villa</option>
                    <option value="apartment">Apartment</option>
                    <option value="riad">Riad</option>
                    <option value="house">House</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="pool" className="mr-1" />
                      <label htmlFor="pool" className="text-sm">Pool</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="beachAccess" className="mr-1" />
                      <label htmlFor="beachAccess" className="text-sm">Beach Access</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="wifi" className="mr-1" />
                      <label htmlFor="wifi" className="text-sm">WiFi</label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Results - Toggle between list and map views */}
          {filteredProperties.length > 0 ? (
            viewMode === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                {filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-5 rounded-lg shadow-subtle animate-fade-in">
                <PropertyMap properties={filteredProperties} />
                <p className="mt-4 text-sm text-gray-500 text-center">
                  Note: For demo purposes, property locations are approximated. In a real application, exact GPS coordinates would be used.
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gray-100 rounded-full">
                <MapPin className="h-8 w-8 text-moroccan-blue" />
              </div>
              <h2 className="text-2xl font-serif font-medium mb-3">No properties found</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your search parameters or exploring different locations to find more options.
              </p>
              <Button 
                className="mt-8 bg-moroccan-gold hover:bg-moroccan-gold/90 text-moroccan-dark"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertiesPage;
