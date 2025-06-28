import React, { useState } from 'react';
import { Property } from '../data/properties';
import { useToast } from '../hooks/use-toast';
import { Plus, Trash2, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface PropertyFormProps {
  property?: Property;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ property, onSubmit, onCancel }) => {
  const { toast } = useToast();

  // Simple form state
  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    price: property?.price || '',
    location: property?.location || '',
    bedrooms: property?.bedrooms || 1,
    bathrooms: property?.bathrooms || 1,
    capacity: property?.capacity || 2,
    featured: property?.featured || false, // Added featured property state
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    property?.amenities || []
  );

  const [images, setImages] = useState<string[]>(
    property?.images || []
  );
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<string>('');

  // Simple amenities list
  const popularAmenities = [
    'WiFi', 'Kitchen', 'Air conditioning', 'Heating', 'TV',
    'Pool', 'Parking', 'Garden', 'Balcony', 'Pet friendly'
  ];

    // City and places data with proper typing
    const cityPlaces: Record<string, string[]> = {
      'Martil': [
        'Martil Beach',
        'Martil Center',
        'Cabo Negro',
        'Marina Smir',
        'Restinga Beach',
        'Martil Port Area',
        'Palm Resort Area',
        'Saidia Road',
        'Downtown Martil',
        'Beachfront Promenade'
      ],
      'Tetouan': [
        'Medina of Tetouan',
        'Ensanche',
        'Sania Ramel',
        'M\'diq Road',
        'University Area',
        'Hassan II Avenue',
        'Dersa',
        'Zitoune',
        'Mallaliene',
        'Industrial Zone'
      ],
      'Tangier': [
        'Medina of Tangier',
        'Ville Nouvelle',
        'Malabata',
        'Boulevard Pasteur',
        'Kasbah',
        'Ibn Batouta Airport Area',
        'Tangier Bay',
        'California',
        'Boukhalef',
        'City Center'
      ],
      'Chefchaouen': [
        'Blue Pearl Medina',
        'Spanish Mosque Area',
        'Ras El Ma',
        'Plaza Uta el-Hammam',
        'Kasbah Museum Area',
        'Atlas Mountains View',
        'Traditional Quarters',
        'Mountain Slopes',
        'Valley View',
        'Historic Center'
      ],
      'Casablanca': [
        'Hassan II Mosque Area',
        'Corniche',
        'City Center',
        'Maarif',
        'Anfa',
        'Old Medina',
        'Twin Center',
        'Racine',
        'Bourgogne',
        'Sidi Belyout'
      ],
      'Rabat': [
        'Medina of Rabat',
        'Hassan Tower Area',
        'Agdal',
        'Souissi',
        'Hay Riad',
        'Kasbah of the Udayas',
        'Ville Nouvelle',
        'Temara Beach',
        'Aviation',
        'Orangeraie'
      ]
    };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedPlace(''); // Reset place when city changes

    // Update location in form data
    if (city) {
      handleInputChange('location', `${city}, Morocco`);
    } else {
      handleInputChange('location', '');
    }
  };

  const handlePlaceChange = (place: string) => {
    setSelectedPlace(place);

    // Update location in form data with full address
    if (place && selectedCity) {
      handleInputChange('location', `${place}, ${selectedCity}, Morocco`);
    } else if (selectedCity) {
      handleInputChange('location', `${selectedCity}, Morocco`);
    }
  };

  const handleImageUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;

    fileInput.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        Array.from(target.files).forEach(file => {
          const reader = new FileReader();
          reader.onload = (loadEvent) => {
            const result = loadEvent.target?.result as string;
            setImages(prev => [...prev, result]);
          };
          reader.readAsDataURL(file);
        });
        toast({
          title: "Images uploaded",
          description: `${target.files.length} image(s) added successfully.`,
        });
      }
    });

    fileInput.click();
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!formData.title || !formData.description || !selectedCity || !selectedPlace || !formData.price) {
      toast({
        title: "Missing information",
        description: "Please fill in the title, description, city, place and price.",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Add photos",
        description: "Please add at least one photo of your property.",
        variant: "destructive",
      });
      return;
    }

    const propertyData = {
      ...formData,
      price: Number(formData.price),
      priceUnit: 'night',
      amenities: selectedAmenities,
      images: images,
      featured: formData.featured, // Included featured property data
    };

    onSubmit(propertyData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-medium mb-2">
          {property ? 'Update your listing' : 'List your place'}
        </h1>
        <p className="text-gray-600">
          Share some basic info about your place
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About your place</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                What's your place called?
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g. Cozy apartment in city center"
                className="text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                The city
              </label>
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Select a city</option>
                {Object.keys(cityPlaces).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {selectedCity && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Choose your place
                </label>
                <select
                  value={selectedPlace}
                  onChange={(e) => handlePlaceChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select a place</option>
                  {cityPlaces[selectedCity]?.map((place: string) => (
                    <option key={place} value={place}>{place}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Describe your place
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="What makes your place special?"
                rows={4}
                className="text-base"
              />
            </div>

             {/* Featured Property Toggle */}
             <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured || false}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="w-4 h-4 text-moroccan-blue bg-gray-100 border-gray-300 rounded focus:ring-moroccan-blue focus:ring-2"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Featured Property
              </label>
            </div>

          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Property details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bedrooms</label>
                <select
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bathrooms</label>
                <select
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  {[1,2,3,4,5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Max guests</label>
                <select
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What amenities do you offer?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {popularAmenities.map(amenity => (
                <label key={amenity} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="h-4 w-4 text-moroccan-blue focus:ring-moroccan-blue border-gray-300 rounded"
                  />
                  <span className="text-sm">{amenity}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add some photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                type="button"
                onClick={handleImageUpload}
                variant="outline"
                className="w-full h-32 border-dashed"
              >
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <span>Upload photos</span>
                </div>
              </Button>

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Set your price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-lg">$</span>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="100"
                className="text-lg"
              />
              <span className="text-gray-600">per night</span>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-moroccan-blue hover:bg-moroccan-blue/90">
            {property ? 'Update listing' : 'Publish listing'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
