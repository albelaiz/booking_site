import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Wifi, Car, UtensilsCrossed, Home, Heart, Eye } from 'lucide-react';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    location: string;
    price: number;
    rating: number;
    images: string[];
    amenities: string[];
    type: string;
    reviews?: number;
    isNew?: boolean;
  };
  className?: string;
  showQuickView?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = memo(({ 
  property, 
  className = '',
  showQuickView = true 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const amenityIcons: { [key: string]: React.ComponentType<any> } = {
    wifi: Wifi,
    parking: Car,
    kitchen: UtensilsCrossed,
    'pool': Home,
  };

const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group ${className}`}>
      <div className="relative h-48 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img 
          src={property.images[0]} 
          alt={property.title}
          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        {/* Property Type Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-700">
          {property.type}
        </div>

        {/* New Badge */}
        {property.isNew && (
          <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full px-2 py-1 text-xs font-medium">
            New
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleFavoriteToggle}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors duration-200 ${
              isFavorited 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          {showQuickView && (
            <Link
              to={`/property/${property.id}`}
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition-colors duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-moroccan-blue transition-colors duration-200">
            {property.title}
          </h3>
          {property.isNew && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              New
            </span>
          )}
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{property.rating}</span>
            {property.reviews && (
              <span className="text-sm text-gray-500 ml-1">({property.reviews})</span>
            )}
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-moroccan-blue">${property.price}</span>
            <span className="text-sm text-gray-500">/night</span>
          </div>
        </div>

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex items-center gap-3 mb-4">
            {property.amenities.slice(0, 4).map((amenity, index) => {
              const IconComponent = amenityIcons[amenity.toLowerCase()] || Home;
              return (
                <div key={index} className="flex items-center text-gray-600">
                  <IconComponent className="w-4 h-4" />
                </div>
              );
            })}
            {property.amenities.length > 4 && (
              <span className="text-sm text-gray-500">+{property.amenities.length - 4} more</span>
            )}
          </div>
        )}

        {/* Action Button */}
        <Link
          to={`/property/${property.id}`}
          className="block w-full bg-moroccan-blue text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
});

export default PropertyCard;