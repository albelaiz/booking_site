import React from 'react';
import { CheckCircle, Star, MapPin, Users, Wifi, Car, Waves, Coffee } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`spinner ${sizeClasses[size]} ${className}`}></div>
  );
};

interface SuccessMessageProps {
  title: string;
  message: string;
  onClose?: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ title, message, onClose }) => {
  return (
    <div className="toast-success p-4 rounded-lg flex items-start space-x-3 mb-4">
      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <h4 className="font-medium text-green-800">{title}</h4>
        <p className="text-sm text-green-700 mt-1">{message}</p>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="text-green-600 hover:text-green-800 ml-auto"
        >
          ×
        </button>
      )}
    </div>
  );
};

interface PropertyCardEnhancedProps {
  property: {
    id: number;
    title: string;
    description: string;
    price: string;
    priceUnit: string;
    images: string[];
    location: string;
    bedrooms: number;
    bathrooms: number;
    capacity: number;
    amenities: string[];
    rating: string;
    reviewCount: number;
    featured: boolean;
  };
  onBookNow?: (propertyId: number) => void;
  onViewDetails?: (propertyId: number) => void;
}

export const PropertyCardEnhanced: React.FC<PropertyCardEnhancedProps> = ({ 
  property, 
  onBookNow, 
  onViewDetails 
}) => {
  const getAmenityIcon = (amenity: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'WiFi': <Wifi className="w-4 h-4" />,
      'Parking': <Car className="w-4 h-4" />,
      'Beach Access': <Waves className="w-4 h-4" />,
      'Kitchen': <Coffee className="w-4 h-4" />,
    };
    return iconMap[amenity] || <CheckCircle className="w-4 h-4" />;
  };

  return (
    <div className="property-card interactive-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      {/* Featured Badge */}
      {property.featured && (
        <div className="absolute top-4 left-4 z-10 bg-moroccan-gold text-white px-3 py-1 rounded-full text-sm font-medium">
          Featured
        </div>
      )}

      {/* Image */}
      <div className="aspect-ratio-container h-48">
        <img 
          src={property.images[0] || '/placeholder.svg'} 
          alt={property.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Rating */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{property.title}</h3>
          {property.reviewCount > 0 && (
            <div className="flex items-center space-x-1 ml-2">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{parseFloat(property.rating).toFixed(1)}</span>
              <span className="text-sm text-gray-500">({property.reviewCount})</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{property.description}</p>

        {/* Property Details */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
          <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
          <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{property.capacity}</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {property.amenities.slice(0, 4).map((amenity, index) => (
            <div key={index} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-md text-xs">
              {getAmenityIcon(amenity)}
              <span>{amenity}</span>
            </div>
          ))}
          {property.amenities.length > 4 && (
            <span className="text-xs text-gray-500">+{property.amenities.length - 4} more</span>
          )}
        </div>

        {/* Price and Actions */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-moroccan-blue">${property.price}</span>
            <span className="text-gray-600 text-sm">/{property.priceUnit}</span>
          </div>
          <div className="flex space-x-2">
            {/* <button 
              onClick={() => onViewDetails?.(property.id)}
              className="btn-outline text-sm px-4 py-2"
            >
              View Details
            </button> */}
            <button 
              onClick={() => onBookNow?.(property.id)}
              className="btn-primary text-sm px-4 py-2"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, action }) => {
  return (
    <div className="error-state">
      <div className="error-icon">
        {icon || <MapPin className="w-16 h-16" />}
      </div>
      <h3 className="error-title">{title}</h3>
      <p className="error-message">{message}</p>
      {action && (
        <button onClick={action.onClick} className="btn-primary">
          {action.label}
        </button>
      )}
    </div>
  );
};

export default {
  LoadingSpinner,
  SuccessMessage,
  PropertyCardEnhanced,
  EmptyState
};
