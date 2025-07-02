import React, { useState } from 'react';
import { Property } from '../data/properties';
import { useToast } from '../hooks/use-toast';
import { Trash2, Upload, Home, Star, DollarSign, Camera, Wifi, Car, Coffee, Waves, Shield, Users } from 'lucide-react';
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

  // Enhanced amenities list with icons
  const popularAmenities = [
    { name: 'WiFi', icon: Wifi },
    { name: 'Kitchen', icon: Coffee },
    { name: 'Air conditioning', icon: Shield },
    { name: 'Heating', icon: Home },
    { name: 'TV', icon: Home },
    { name: 'Pool', icon: Waves },
    { name: 'Parking', icon: Car },
    { name: 'Garden', icon: Home },
    { name: 'Balcony', icon: Home },
    { name: 'Pet friendly', icon: Home }
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

  const handleAmenityToggle = (amenityName: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityName)
        ? prev.filter(a => a !== amenityName)
        : [...prev, amenityName]
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl mb-4">
              <Home className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {property ? 'Update your listing' : 'List your place'}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {property ? 'Update your property details to keep your listing fresh' : 'Share your space with travelers from around the world'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              About your place
            </CardTitle>
            <p className="text-gray-600">Tell us the basics about your property</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                What's your place called?
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g. Cozy apartment in city center"
                className="text-base h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose your city
              </label>
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:border-blue-500 focus:ring-0 bg-white"
              >
                <option value="">Select a city</option>
                {Object.keys(cityPlaces).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {selectedCity && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Choose your neighborhood
                </label>
                <select
                  value={selectedPlace}
                  onChange={(e) => handlePlaceChange(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:border-blue-500 focus:ring-0 bg-white"
                >
                  <option value="">Select a neighborhood</option>
                  {cityPlaces[selectedCity]?.map((place: string) => (
                    <option key={place} value={place}>{place}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Describe your place
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="What makes your place special? Mention the view, location highlights, unique features..."
                rows={4}
                className="text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-0"
              />
            </div>

             {/* Featured Property Toggle */}
             <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured || false}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="w-5 h-5 text-amber-600 bg-white border-2 border-amber-300 rounded focus:ring-amber-500 focus:ring-2"
              />
              <div>
                <label htmlFor="featured" className="text-sm font-semibold text-amber-800">
                  Featured Property
                </label>
                <p className="text-xs text-amber-700">Get more visibility and bookings</p>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Property Details */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              Property details
            </CardTitle>
            <p className="text-gray-600">Help guests know what to expect</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Bedrooms</label>
                <select
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', Number(e.target.value))}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:border-blue-500 focus:ring-0 bg-white"
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Bathrooms</label>
                <select
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', Number(e.target.value))}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:border-blue-500 focus:ring-0 bg-white"
                >
                  {[1,2,3,4,5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Max guests</label>
                <select
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', Number(e.target.value))}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:border-blue-500 focus:ring-0 bg-white"
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
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              What amenities do you offer?
            </CardTitle>
            <p className="text-gray-600">Select all that apply to make your listing stand out</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {popularAmenities.map(amenity => {
                const IconComponent = amenity.icon;
                return (
                  <label key={amenity.name} className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity.name)}
                      onChange={() => handleAmenityToggle(amenity.name)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <IconComponent className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{amenity.name}</span>
                  </label>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Camera className="h-5 w-5 text-purple-600" />
              Add some photos
            </CardTitle>
            <p className="text-gray-600">Show off your space with high-quality photos</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Button
                type="button"
                onClick={handleImageUpload}
                variant="outline"
                className="w-full h-40 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200"
              >
                <div className="text-center">
                  <Upload className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <span className="text-lg font-medium text-gray-600">Upload photos</span>
                  <p className="text-sm text-gray-500 mt-1">Drag and drop or click to browse</p>
                </div>
              </Button>

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Set your price
            </CardTitle>
            <p className="text-gray-600">Price competitively to attract more guests</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
              <span className="text-2xl font-bold text-green-600">$</span>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="100"
                className="text-2xl font-bold border-0 bg-transparent focus:ring-0 flex-1"
              />
              <span className="text-lg font-medium text-green-700">per night</span>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 <strong>Tip:</strong> Competitive pricing increases your booking chances by up to 40%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="px-8 py-3 text-base border-2 border-gray-300 hover:border-gray-400"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="px-8 py-3 text-base bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {property ? 'Update listing' : 'Publish listing'}
          </Button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;
