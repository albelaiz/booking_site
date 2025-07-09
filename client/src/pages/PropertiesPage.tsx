
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useProperties } from '../contexts/PropertiesContext';
import { Property } from '../data/properties';
import PropertyCard from '../components/PropertyCard';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '../components/ui/button';

const PropertiesPage = () => {
  const { properties } = useProperties();
  const [searchParams] = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
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
      
      <main className="flex-grow relative py-16 overflow-hidden">
        {/* Beautiful Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100"></div>
        <div className="absolute inset-0 opacity-30 bg-mesh-pattern"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="container-custom relative z-10">
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
            <div className="flex justify-start items-center">
              <button 
                className="flex items-center gap-2 text-moroccan-blue font-medium hover:text-moroccan-blue/80 transition-colors"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span>Filters</span>
              </button>
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
          
          {/* Results */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
              {filteredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gray-100 rounded-full">
                <SlidersHorizontal className="h-8 w-8 text-moroccan-blue" />
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
