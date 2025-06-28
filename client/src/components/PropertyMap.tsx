
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Property } from '../data/properties';
import { Link } from 'react-router-dom';
import { MapPin, Home, Bath, Users, Star } from 'lucide-react';

interface PropertyMapProps {
  properties: Property[];
  center?: { lat: number, lng: number };
  zoom?: number;
}

// Default center on Martil, Morocco
const defaultCenter = {
  lat: 35.6180, 
  lng: -5.2774
};

const containerStyle = {
  width: '100%',
  height: '550px',
  borderRadius: '12px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
};

const PropertyMap: React.FC<PropertyMapProps> = ({ 
  properties, 
  center = defaultCenter, 
  zoom = 12 
}) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [animatedMarkers, setAnimatedMarkers] = useState<string[]>([]);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Mock coordinates for demo purposes as our data doesn't have real coords
  const getPropertyCoordinates = useCallback((property: Property, index: number) => {
    // Generate mock coordinates around the center point
    // In a real app, these would come from your database
    const latVariation = (index % 5) * 0.008;
    const lngVariation = (index % 4) * 0.01;
    
    return {
      lat: center.lat + latVariation,
      lng: center.lng + lngVariation
    };
  }, [center]);

  // Add map loading effect
  useEffect(() => {
    if (mapLoaded) {
      const timer = setTimeout(() => {
        // Add markers to the animated markers array one by one
        properties.forEach((property, i) => {
          setTimeout(() => {
            setAnimatedMarkers(prev => [...prev, property.id]);
          }, i * 100);
        });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [mapLoaded, properties]);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMapLoaded(true);
  }, []);

  // Options for the map
  const mapOptions = {
    disableDefaultUI: false,
    clickableIcons: false,
    scrollwheel: true,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: 2, // dropdown style
      position: 7 // RIGHT_BOTTOM
    },
    styles: [
      {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#444444"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
          {
            "color": "#f2f2f2"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#c5e8c5"
          },
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
          {
            "saturation": -100
          },
          {
            "lightness": 45
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
          {
            "color": "#c9d6df"
          },
          {
            "visibility": "on"
          }
        ]
      }
    ]
  };

  return (
    <div className="relative rounded-xl overflow-hidden map-container">
      <div className="map-overlay"></div>
      
      <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-sm font-medium text-moroccan-blue animate-fade-in">
        {properties.length} Properties Found in Martil
      </div>
      
      <LoadScript 
        googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY"
        onLoad={() => setMapLoaded(true)}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          options={mapOptions}
          onLoad={handleMapLoad}
        >
          {properties.map((property, index) => (
            <Marker
              key={property.id}
              position={getPropertyCoordinates(property, index)}
              onClick={() => setSelectedProperty(property)}
              icon={{
                url: `data:image/svg+xml,${encodeURIComponent(
                  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36">
                    <path d="M12 0C7.31 0 3.5 3.81 3.5 8.5c0 5.79 6.45 11.93 7.57 13.05a1.49 1.49 0 002.01.04C14.04 20.44 20.5 14.27 20.5 8.5 20.5 3.81 16.69 0 12 0zm0 11a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" 
                    fill="${property.featured ? '#DAA520' : '#1A5D91'}" stroke="#FFFFFF" stroke-width="2"/>
                  </svg>`
                )}`,
                scaledSize: new window.google.maps.Size(32, 48),
                anchor: new window.google.maps.Point(16, 48),
              }}
              animation={
                animatedMarkers.includes(property.id) 
                  ? window.google.maps.Animation.DROP 
                  : undefined
              }
            />
          ))}

          {selectedProperty && (
            <InfoWindow
              position={getPropertyCoordinates(selectedProperty, properties.findIndex(p => p.id === selectedProperty.id))}
              onCloseClick={() => setSelectedProperty(null)}
            >
              <div className="p-3 max-w-[280px] rounded-lg shadow-inner">
                <div className="mb-3 overflow-hidden rounded-lg relative">
                  <img 
                    src={selectedProperty.images[0]} 
                    alt={selectedProperty.title}
                    className="w-full h-32 object-cover"
                  />
                  {selectedProperty.featured && (
                    <div className="absolute top-2 left-2 bg-moroccan-gold text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                      Featured
                    </div>
                  )}
                </div>
                
                <h3 className="font-serif font-medium text-base mb-1 text-gray-900">{selectedProperty.title}</h3>
                
                <div className="flex items-center justify-between mb-2">
                  <p className="text-moroccan-gold font-medium">
                    ${selectedProperty.price}/{selectedProperty.priceUnit}
                  </p>
                  
                  <div className="flex items-center bg-gray-50 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-yellow-500 mr-1" />
                    <span className="text-xs font-medium">{selectedProperty.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-500 text-xs mb-3 flex items-center">
                  <MapPin className="w-3 h-3 mr-1 text-moroccan-terracotta" />
                  {selectedProperty.location}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-700 pt-2 border-t border-gray-100 mb-3">
                  <div className="flex items-center">
                    <Home className="w-3 h-3 mr-1 text-moroccan-blue" />
                    <span>{selectedProperty.bedrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-3 h-3 mr-1 text-moroccan-blue" />
                    <span>{selectedProperty.bathrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1 text-moroccan-blue" />
                    <span>{selectedProperty.capacity}</span>
                  </div>
                </div>
                
                <Link 
                  to={`/property/${selectedProperty.id}`}
                  className="block w-full bg-moroccan-blue text-white text-center text-xs font-medium py-2 rounded-md hover:bg-moroccan-blue/90 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
      
      <div className="map-legend">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-moroccan-blue rounded-full mr-1.5"></span>
          Standard
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-moroccan-gold rounded-full mr-1.5"></span>
          Featured
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;
