
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
      className="group relative bg-white rounded-xl overflow-hidden cursor-pointer property-card"
      onClick={() => navigate(`/property/${property.id}`)}
    >
      {/* Professional Featured Badge */}
      {property.featured && (
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
            Featured
          </span>
        </div>
      )}
      
      {/* Professional Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Professional Price Badge */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-white/95 backdrop-blur-sm text-slate-800 font-semibold text-base px-3 py-2 rounded-lg shadow-lg">
            ${property.price}
            <span className="text-sm text-slate-600 font-normal">/{property.priceUnit}</span>
          </div>
        </div>
      </div>
      
      {/* Professional Property Details */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-amber-500 mr-1" />
            <span className="text-sm font-semibold text-slate-800">{property.rating}</span>
            <span className="text-xs text-slate-600 ml-1">({property.reviews} reviews)</span>
          </div>
        </div>
        
        <h3 className="text-lg font-serif font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
          {property.title}
        </h3>
        
        <p className="text-slate-600 text-sm flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
          {property.location}
        </p>
        
        {/* Professional Features Grid */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
              <Home className="w-4 h-4 text-slate-700" />
            </div>
            <span className="text-xs font-semibold text-slate-800">{property.bedrooms}</span>
            <span className="text-xs text-slate-500">Beds</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
              <Bath className="w-4 h-4 text-slate-700" />
            </div>
            <span className="text-xs font-semibold text-slate-800">{property.bathrooms}</span>
            <span className="text-xs text-slate-500">Baths</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-slate-700" />
            </div>
            <span className="text-xs font-semibold text-slate-800">{property.capacity}</span>
            <span className="text-xs text-slate-500">Guests</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
