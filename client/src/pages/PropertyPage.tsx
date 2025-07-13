
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperties } from '../contexts/PropertiesContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyDetails from '../components/PropertyDetails';
import PropertyCard from '../components/PropertyCard';
import { Property } from '../data/properties';

const PropertyPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties } = useProperties();
  const [property, setProperty] = useState<Property | undefined>();
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (!id || !properties.length) return;
    
    // Convert id to number for comparison since database IDs are numbers
    const propertyId = parseInt(id);
    
    // Find the current property by comparing numeric IDs
    const currentProperty = properties.find(p => p.id === propertyId);
    
    console.log('Looking for property ID:', propertyId);
    console.log('Available properties:', properties.map(p => ({ id: p.id, title: p.title })));
    console.log('Found property:', currentProperty);
    
    setProperty(currentProperty);
    
    // Find similar properties (same location or similar number of bedrooms)
    if (currentProperty) {
      const similar = properties
        .filter(p => 
          p.id !== propertyId && 
          (p.location === currentProperty.location || 
           Math.abs(p.bedrooms - currentProperty.bedrooms) <= 1)
        )
        .slice(0, 3);
      
      setSimilarProperties(similar);
    }
  }, [id, properties]);

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container-custom py-16 text-center">
          <h2 className="text-2xl font-serif">Property not found</h2>
          <p className="text-gray-600 mt-4">The property you're looking for doesn't exist or has been removed.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <PropertyDetails property={property} />
        
        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <section className="py-16 bg-moroccan-white">
            <div className="container-custom">
              <h2 className="section-title text-center mx-auto">Similar Properties You Might Like</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {similarProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertyPage;
