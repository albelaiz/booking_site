
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '../data/properties';
import { MapPin, Star, Home, Bath, Users } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="property-card bg-white rounded-xl overflow-hidden cursor-pointer animate-zoom-in"
      onClick={() => navigate(`/property/${property.id}`)}
    >
      {/* Featured Badge */}
      {property.featured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-moroccan-gold text-moroccan-dark text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            Featured
          </span>
        </div>
      )}
      
      {/* Property Image */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-full object-cover transition duration-700 hover:scale-110"
        />
      </div>
      
      {/* Property Details */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-moroccan-gold font-medium text-lg">
            ${property.price} <span className="text-sm text-gray-500">/ {property.priceUnit}</span>
          </div>
          
          <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{property.rating}</span>
            <span className="text-xs text-gray-500 ml-1">({property.reviews})</span>
          </div>
        </div>
        
        <h3 className="text-xl font-serif font-medium mb-2 text-gray-900">{property.title}</h3>
        <p className="text-gray-500 text-sm mb-4 flex items-center">
          <MapPin className="w-4 h-4 mr-1 text-moroccan-terracotta" />
          {property.location}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-700 pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <Home className="w-4 h-4 mr-1.5 text-moroccan-blue" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1.5 text-moroccan-blue" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1.5 text-moroccan-blue" />
            <span>{property.capacity} Guests</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
