
import React, { useState } from 'react';
import { Property } from '../data/properties';
import BookingForm from './BookingForm';

interface PropertyDetailsProps {
  property: Property;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="container-custom py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column - Property Details */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-serif font-medium mb-4">{property.title}</h1>
          
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-700">
              {property.location}
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span className="text-gray-700">{property.rating} ({property.reviews} reviews)</span>
            </div>
          </div>
          
          {/* Image Gallery */}
          <div className="mb-8">
            <div className="h-[400px] mb-2 rounded-lg overflow-hidden">
              <img 
                src={property.images[activeImage]} 
                alt={`${property.title} - View ${activeImage + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {property.images.map((image, index) => (
                <div 
                  key={index}
                  className={`w-24 h-20 rounded overflow-hidden cursor-pointer ${activeImage === index ? 'ring-2 ring-moroccan-blue' : ''}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`${property.title} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Property Stats */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 bg-gray-50 rounded-lg p-6 mb-8">
            <div className="text-center">
              <div className="text-gray-500 text-sm mb-1">Bedrooms</div>
              <div className="font-medium">{property.bedrooms}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 text-sm mb-1">Bathrooms</div>
              <div className="font-medium">{property.bathrooms}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 text-sm mb-1">Guests</div>
              <div className="font-medium">{property.capacity}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 text-sm mb-1">Price</div>
              <div className="font-medium text-moroccan-gold">${property.price}/{property.priceUnit}</div>
            </div>
          </div>
          
          {/* Property Description */}
          <div className="mb-8">
            <h2 className="text-xl font-serif font-medium mb-4">About this property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{property.description}</p>
          </div>
          
          {/* Amenities */}
          <div className="mb-8">
            <h2 className="text-xl font-serif font-medium mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Location */}
          <div>
            <h2 className="text-xl font-serif font-medium mb-4">Location</h2>
            <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
              {/* In a real application, this would be a map */}
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <div className="text-gray-500">Map of {property.location}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Booking Form */}
        <div>
          <BookingForm 
            propertyId={property.id}
            propertyTitle={property.title}
            price={property.price}
            priceUnit={property.priceUnit}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
