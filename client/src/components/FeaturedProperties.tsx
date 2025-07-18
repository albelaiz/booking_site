import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingSpinner } from './EnhancedComponents';
import { useProperties } from '../contexts/PropertiesContext';
import { Star, MapPin, Users, Wifi, Car, Waves, Coffee, CheckCircle } from 'lucide-react';

const FeaturedProperties: React.FC = () => {
  const { properties, loading } = useProperties();
  const navigate = useNavigate();

  // Debug logging
  console.log('FeaturedProperties Debug:', {
    properties,
    loading,
    propertiesLength: properties?.length || 0
  });

  // Show only featured and approved properties
  const featuredProperties = properties.filter(property => 
    property.featured && property.status === 'approved'
  );

  console.log('Featured Properties Debug:', {
    featuredProperties,
    featuredCount: featuredProperties.length
  });

  const handleBookNow = (propertyId: number) => {
    console.log('Navigating to book property:', propertyId);
    navigate(`/property/${propertyId}?action=book`);
  };

  const handleViewDetails = (propertyId: number) => {
    console.log('Navigating to view property:', propertyId);
    navigate(`/property/${propertyId}`);
  };

  const getAmenityIcon = (amenity: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'WiFi': <Wifi className="w-4 h-4" />,
      'Parking': <Car className="w-4 h-4" />,
      'Beach Access': <Waves className="w-4 h-4" />,
      'Kitchen': <Coffee className="w-4 h-4" />,
    };
    return iconMap[amenity] || <CheckCircle className="w-4 h-4" />;
  };

  const PropertyCard = ({ property }: { property: any }) => (
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
          src={property.images?.[0] || '/placeholder.svg'} 
          alt={property.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Rating */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{property.title}</h3>
          {(property.reviewCount > 0 || property.reviews > 0) && (
            <div className="flex items-center space-x-1 ml-2">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">
                {parseFloat(property.rating || '0').toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({property.reviewCount || property.reviews || 0})
              </span>
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
          {property.amenities?.slice(0, 4).map((amenity: string, index: number) => (
            <div key={index} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-md text-xs">
              {getAmenityIcon(amenity)}
              <span>{amenity}</span>
            </div>
          ))}
          {property.amenities?.length > 4 && (
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
              onClick={() => handleViewDetails(property.id)}
              className="btn-outline text-sm px-4 py-2"
            >
              View Details
            </button> */}
            <button 
              onClick={() => handleBookNow(property.id)}
              className="btn-primary text-sm px-4 py-2"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="py-16 bg-moroccan-white">
        <div className="container-custom">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-600">Loading featured properties...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-moroccan-white">
      <div className="container-custom">
        <h2 className="section-title text-center mx-auto">Featured Properties</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Discover our handpicked selection of the most stunning properties in Morocco, each offering a unique experience of luxury and comfort.
        </p>

        {featuredProperties.length > 0 && (
          <>
            <div className="property-grid">
              {featuredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/properties" className="btn-outline">
                View All Properties
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;