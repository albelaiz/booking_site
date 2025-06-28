
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Camera, Star } from 'lucide-react';

const DestinationShowcase: React.FC = () => {
  const destinations = [
    {
      name: 'Cabo Negro',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Pristine beaches and luxury coastal resorts with breathtaking Atlantic views',
      properties: 18,
      avgRating: 4.8
    },
    {
      name: 'Tetouan',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73999?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Rich Andalusian heritage and traditional Moroccan architecture in the heart of the Rif',
      properties: 25,
      avgRating: 4.7
    },
    {
      name: 'Marina Smir',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Luxury marina resort with stunning Mediterranean views and world-class amenities',
      properties: 22,
      avgRating: 4.9
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-moroccan-white to-gray-50">
      <div className="container-custom">
        <h2 className="section-title text-center mx-auto">Explore Morocco's Wonders</h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          From imperial cities to mountain villages, from Atlantic beaches to Sahara dunes - 
          discover authentic Moroccan experiences across the kingdom's most captivating destinations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((destination, index) => (
            <div key={destination.name} className="group cursor-pointer animate-fade-up" style={{animationDelay: `${index * 100}ms`}}>
              <Link to={`/properties?location=${destination.name}`}>
                <div className="relative overflow-hidden rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-serif font-semibold mb-2">{destination.name}</h3>
                    <p className="text-sm opacity-90 mb-3">{destination.description}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{destination.properties} properties</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                        <span>{destination.avgRating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <Camera className="w-5 h-5 text-white opacity-80" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/properties" className="btn-primary">
            Explore All Destinations
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DestinationShowcase;
