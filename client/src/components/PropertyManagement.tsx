import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Eye, 
  Trash2, 
  Star, 
  MapPin, 
  Users, 
  Home, 
  Calendar,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { HostService, type HostProperty } from '../lib/host-service';

interface PropertyManagementProps {
  ownerId: number;
}

const PropertyManagement: React.FC<PropertyManagementProps> = ({ ownerId }) => {
  const [properties, setProperties] = useState<HostProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<HostProperty | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<HostProperty | null>(null);

  useEffect(() => {
    loadProperties();
  }, [ownerId]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const hostProperties = await HostService.getHostProperties(ownerId);
      setProperties(hostProperties);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProperty = () => {
    setEditingProperty(null);
    setShowCreateForm(true);
  };

  const handleEditProperty = (property: HostProperty) => {
    setEditingProperty(property);
    setShowCreateForm(true);
  };

  const handleDeleteProperty = async (propertyId: number) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await HostService.deleteProperty(propertyId);
        await loadProperties();
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property');
      }
    }
  };

  const handleToggleFeatured = async (propertyId: number, featured: boolean) => {
    try {
      await HostService.togglePropertyFeatured(propertyId, !featured);
      await loadProperties();
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const PropertyCard: React.FC<{ property: HostProperty }> = ({ property }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={property.images[0] || '/placeholder.svg'} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        
        {/* Status Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium ${
          property.status === 'approved' ? 'bg-green-100 text-green-800' :
          property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {property.status}
        </div>

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-2 right-2 bg-moroccan-gold text-white px-2 py-1 rounded-md text-xs font-medium">
            Featured
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute bottom-2 right-2 flex space-x-1">
          <button
            onClick={() => setSelectedProperty(property)}
            className="bg-white/90 hover:bg-white p-2 rounded-full shadow-sm transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={() => handleEditProperty(property)}
            className="bg-white/90 hover:bg-white p-2 rounded-full shadow-sm transition-colors"
            title="Edit Property"
          >
            <Edit3 className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg">{property.title}</h3>
          <button
            onClick={() => handleToggleFeatured(property.id, property.featured)}
            className={`p-1 rounded ${property.featured ? 'text-yellow-500' : 'text-gray-300'}`}
            title={property.featured ? 'Remove from featured' : 'Make featured'}
          >
            <Star className={`h-5 w-5 ${property.featured ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {property.location}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-moroccan-gold">
            ${property.price}/{property.priceUnit}
          </span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium ml-1">{property.rating}</span>
            <span className="text-sm text-gray-500 ml-1">({property.reviewCount})</span>
          </div>
        </div>
        
        {/* Property Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{property.bookings || 0}</p>
            <p className="text-xs text-gray-600">Total Bookings</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">${property.revenue || 0}</p>
            <p className="text-xs text-gray-600">Revenue</p>
          </div>
          <div className="text-center">
            <p className={`text-lg font-semibold ${HostService.getOccupancyColor(property.occupancyRate || 0)}`}>
              {property.occupancyRate || 0}%
            </p>
            <p className="text-xs text-gray-600">Occupancy</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{property.views || 0}</p>
            <p className="text-xs text-gray-600">Views</p>
          </div>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <span className="flex items-center">
            <Home className="h-4 w-4 mr-1" />
            {property.bedrooms} bed, {property.bathrooms} bath
          </span>
          <span className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {property.capacity} guests
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => setSelectedProperty(property)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => handleEditProperty(property)}
          >
            <Edit3 className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-600 hover:text-red-700"
            onClick={() => handleDeleteProperty(property.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const PropertyForm: React.FC = () => {
    const [formData, setFormData] = useState({
      title: editingProperty?.title || '',
      description: editingProperty?.description || '',
      location: editingProperty?.location || '',
      price: editingProperty?.price || 0,
      priceUnit: editingProperty?.priceUnit || 'night',
      bedrooms: editingProperty?.bedrooms || 1,
      bathrooms: editingProperty?.bathrooms || 1,
      capacity: editingProperty?.capacity || 1,
      amenities: editingProperty?.amenities || [],
      images: editingProperty?.images || []
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);

      try {
        if (editingProperty) {
          await HostService.updateProperty(editingProperty.id, formData);
        } else {
          await HostService.createProperty({
            ...formData,
            ownerId: ownerId
          } as any);
        }
        
        await loadProperties();
        setShowCreateForm(false);
      } catch (error) {
        console.error('Error saving property:', error);
        alert('Failed to save property');
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingProperty ? 'Edit Property' : 'Add New Property'}
            </h2>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
                required
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Guests
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-moroccan-gold hover:bg-moroccan-gold/90"
              >
                {saving ? 'Saving...' : (editingProperty ? 'Update Property' : 'Create Property')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const PropertyDetails: React.FC<{ property: HostProperty }> = ({ property }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{property.title}</h2>
          <button
            onClick={() => setSelectedProperty(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <img 
                src={property.images[0] || '/placeholder.svg'} 
                alt={property.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Property Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Location:</span> {property.location}</p>
                  <p><span className="font-medium">Price:</span> ${property.price}/{property.priceUnit}</p>
                  <p><span className="font-medium">Bedrooms:</span> {property.bedrooms}</p>
                  <p><span className="font-medium">Bathrooms:</span> {property.bathrooms}</p>
                  <p><span className="font-medium">Capacity:</span> {property.capacity} guests</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${HostService.getStatusColor(property.status)}`}>
                      {property.status}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <p className="text-lg font-bold">{property.bookings || 0}</p>
                    <p className="text-sm text-gray-600">Total Bookings</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <p className="text-lg font-bold">${property.revenue || 0}</p>
                    <p className="text-sm text-gray-600">Revenue</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <p className={`text-lg font-bold ${HostService.getOccupancyColor(property.occupancyRate || 0)}`}>
                      {property.occupancyRate || 0}%
                    </p>
                    <p className="text-sm text-gray-600">Occupancy</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <p className="text-lg font-bold flex items-center justify-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      {property.rating}
                    </p>
                    <p className="text-sm text-gray-600">{property.reviewCount} reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{property.description}</p>
          </div>

          {property.amenities && property.amenities.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => handleEditProperty(property)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Property
            </Button>
            <Button
              onClick={() => {
                // Navigate to calendar/bookings view
                setSelectedProperty(null);
              }}
              className="bg-moroccan-gold hover:bg-moroccan-gold/90"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Manage Calendar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moroccan-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Property Management</h2>
        <Button 
          onClick={handleCreateProperty}
          className="bg-moroccan-gold hover:bg-moroccan-gold/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Property
        </Button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first property</p>
          <Button 
            onClick={handleCreateProperty}
            className="bg-moroccan-gold hover:bg-moroccan-gold/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Property
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {showCreateForm && <PropertyForm />}
      {selectedProperty && <PropertyDetails property={selectedProperty} />}
    </div>
  );
};

export default PropertyManagement;
