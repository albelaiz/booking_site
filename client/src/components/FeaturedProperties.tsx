
import React from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from './PropertyCard';
import { useProperties } from '../contexts/PropertiesContext';

const FeaturedProperties: React.FC = () => {
  const { properties, loading } = useProperties();
  
  // Filter for featured properties that are approved
  const featuredProperties = properties.filter(property => 
    property.featured && property.status === 'approved'
  );
  
  if (loading) {
    return (
      <section className="py-16 bg-moroccan-white">
        <div className="container-custom">
          <div className="text-center">
            <div className="animate-pulse">Loading featured properties...</div>
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
          Discover our handpicked selection of the most stunning properties in Martil, each offering a unique experience of luxury and comfort.
        </p>
        
        {featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured properties available at the moment.</p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link to="/properties" className="btn-outline">
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
