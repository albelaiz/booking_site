import { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import PropertyForm from '../components/PropertyForm';
import { useProperties } from '../contexts/PropertiesContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Check, X, Eye, Plus, Edit, Star, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Property } from '../data/properties';

const AdminProperties = () => {
  const { properties, updateProperty, addProperty, approveProperty, rejectProperty } = useProperties();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Filter properties based on search term
  const filteredProperties = properties.filter(property => 
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.id.toString().includes(searchTerm.toLowerCase())
  );

  // Group properties by status
  const pendingProperties = filteredProperties.filter(p => p.status === 'pending');
  const approvedProperties = filteredProperties.filter(p => p.status === 'approved');
  const rejectedProperties = filteredProperties.filter(p => p.status === 'rejected');

  const handleApproveProperty = async (id: string) => {
    try {
      await approveProperty(id);
      toast({
        title: "Property approved",
        description: "The property listing has been published and is now visible to visitors.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve property. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRejectProperty = async (id: string) => {
    try {
      await rejectProperty(id);
      toast({
        title: "Property rejected",
        description: "The property listing has been rejected and hidden from visitors.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject property. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddProperty = (propertyData: any) => {
    const newProperty = {
      ...propertyData,
      id: Date.now().toString(),
      status: 'approved', // Admin-created properties are auto-approved
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId: 'admin',
      rating: 0,
      reviews: 0
    };

    addProperty(newProperty);
    setIsAddingProperty(false);
    toast({
      title: "Property added",
      description: "New property has been created successfully.",
    });
  };

  const handleUpdateProperty = (propertyData: any) => {
    if (editingProperty) {
      updateProperty(editingProperty.id, {
        ...propertyData,
        updatedAt: new Date().toISOString()
      });
      setEditingProperty(null);
      toast({
        title: "Property updated",
        description: "Property has been updated successfully.",
      });
    }
  };

  // Render property form if adding or editing
  if (isAddingProperty || editingProperty) {
    return (
      <AdminLayout title={editingProperty ? "Edit Property" : "Add New Property"}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddingProperty(false);
                setEditingProperty(null);
              }}
            >
              ← Back to Properties
            </Button>
          </div>

          <PropertyForm
            property={editingProperty || undefined}
            onSubmit={editingProperty ? handleUpdateProperty : handleAddProperty}
            onCancel={() => {
              setIsAddingProperty(false);
              setEditingProperty(null);
            }}
          />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Property Management">
      <div className="space-y-6">
        {/* Header with Add Property button */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full sm:max-w-sm">
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="featured" />
              <label htmlFor="featured" className="text-sm font-medium">
                Featured only
              </label>
            </div>
          </div>

          <Button 
            onClick={() => setIsAddingProperty(true)}
            className="bg-moroccan-blue hover:bg-moroccan-blue/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Property
          </Button>
        </div>

        {/* Featured Properties Management Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Featured Properties Management
              </span>
              <div className="text-sm text-gray-500">
                {properties.filter(p => p.featured && p.status === 'approved').length} of {properties.filter(p => p.status === 'approved').length} approved properties featured
              </div>
            </CardTitle>
            <CardDescription>
              Select which approved properties should be featured on the home page. Featured properties get prime visibility to visitors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Featured Properties Guidelines</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Only approved properties can be featured</li>
                  <li>• Featured properties appear on the home page</li>
                  <li>• Recommended: 6-8 featured properties for optimal display</li>
                  <li>• Choose properties with high-quality images and complete information</li>
                </ul>
              </div>
              
              {approvedProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {approvedProperties.map(property => (
                    <Card key={property.id} className={`cursor-pointer transition-all ${property.featured ? 'ring-2 ring-yellow-400 bg-yellow-50' : 'hover:shadow-md'}`}>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{property.title}</h4>
                            <p className="text-xs text-gray-500">{property.location}</p>
                            <p className="text-xs text-gray-600 mt-1">${property.price}/{property.priceUnit}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {property.featured && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                            <Button
                              size="sm"
                              variant={property.featured ? "default" : "outline"}
                              className={property.featured ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""}
                              onClick={() => {
                                updateProperty(property.id, { featured: !property.featured });
                                toast({
                                  title: property.featured ? "Property unfeatured" : "Property featured",
                                  description: property.featured 
                                    ? "Property removed from featured section" 
                                    : "Property added to featured section",
                                });
                              }}
                            >
                              {property.featured ? "Unfeature" : "Feature"}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 text-xs">
                          <span className="px-2 py-1 bg-gray-100 rounded">{property.bedrooms} bed</span>
                          <span className="px-2 py-1 bg-gray-100 rounded">{property.bathrooms} bath</span>
                          <span className="px-2 py-1 bg-gray-100 rounded">{property.capacity} guests</span>
                          {property.rating && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">⭐ {property.rating}</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Building className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No approved properties available to feature</p>
                  <p className="text-sm">Properties must be approved before they can be featured</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Properties organized by tabs */}
        <Tabs defaultValue="pending">
          <TabsList className="mb-6">
            <TabsTrigger value="pending">
              Pending Review
              {pendingProperties.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-red-500 text-white rounded-full">
                  {pendingProperties.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All Properties</TabsTrigger>
          </TabsList>

          {/* Pending properties tab */}
          <TabsContent value="pending">
            <h2 className="text-lg font-medium mb-4">Properties Pending Review</h2>
            {pendingProperties.length > 0 ? (
              <div className="space-y-4">
                {pendingProperties.map(property => (
                  <Card key={property.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {property.images && property.images.length > 0 && (
                        <div className="w-full md:w-48 h-40">
                          <img 
                            src={property.images[0]} 
                            alt={property.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="flex-1 p-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium text-lg">{property.title}</h3>
                            <p className="text-gray-500 text-sm">{property.location}</p>
                          </div>
                          <div className="text-sm text-gray-500 mt-2 md:mt-0">
                            ID: {property.id}
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm line-clamp-2">{property.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4 text-xs">
                          <span className="px-2 py-1 bg-gray-100 rounded-full">{property.bedrooms} bedrooms</span>
                          <span className="px-2 py-1 bg-gray-100 rounded-full">{property.bathrooms} bathrooms</span>
                          <span className="px-2 py-1 bg-gray-100 rounded-full">${property.price}/{property.priceUnit}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="text-xs text-gray-500">
                            Submitted: {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'Unknown'}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              asChild
                            >
                              <Link to={`/property/${property.id}`}>
                                <Eye className="mr-1 h-4 w-4" />
                                View
                              </Link>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleApproveProperty(property.id)}
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => handleRejectProperty(property.id)}
                            >
                              <X className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-lg border">
                <p className="text-gray-500">No pending properties to review</p>
              </div>
            )}
          </TabsContent>

          {/* Approved properties tab */}
          <TabsContent value="approved">
            <h2 className="text-lg font-medium mb-4">Approved Properties</h2>
            {approvedProperties.length > 0 ? (
              <div className="space-y-4">
                {approvedProperties.map(property => (
                  <Card key={property.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {property.images && property.images.length > 0 && (
                        <div className="w-full md:w-48 h-40">
                          <img 
                            src={property.images[0]} 
                            alt={property.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="flex-1 p-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium text-lg">{property.title}</h3>
                            <p className="text-gray-500 text-sm">{property.location}</p>
                          </div>
                          <div className="text-sm text-gray-500 mt-2 md:mt-0">
                            ID: {property.id}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4 text-xs">
                          <span className="px-2 py-1 bg-gray-100 rounded-full">{property.bedrooms} bedrooms</span>
                          <span className="px-2 py-1 bg-gray-100 rounded-full">{property.bathrooms} bathrooms</span>
                          <span className="px-2 py-1 bg-gray-100 rounded-full">${property.price}/{property.priceUnit}</span>
                          {property.featured && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">Featured</span>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="text-xs text-gray-500">
                            Approved: {property.updatedAt ? new Date(property.updatedAt).toLocaleDateString() : 'Unknown'}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              asChild
                            >
                              <Link to={`/property/${property.id}`}>
                                <Eye className="mr-1 h-4 w-4" />
                                View
                              </Link>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingProperty(property)}
                            >
                              <Edit className="mr-1 h-4 w-4" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => handleRejectProperty(property.id)}
                            >
                              <X className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-lg border">
                <p className="text-gray-500">No approved properties</p>
              </div>
            )}
          </TabsContent>

          {/* Rejected properties tab */}
          <TabsContent value="rejected">
            <h2 className="text-lg font-medium mb-4">Rejected Properties</h2>
            {rejectedProperties.length > 0 ? (
              <div className="space-y-4">
                {rejectedProperties.map(property => (
                  <Card key={property.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {property.images && property.images.length > 0 && (
                        <div className="w-full md:w-48 h-40">
                          <img 
                            src={property.images[0]} 
                            alt={property.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="flex-1 p-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium text-lg">{property.title}</h3>
                            <p className="text-gray-500 text-sm">{property.location}</p>
                          </div>
                          <div className="text-sm text-gray-500 mt-2 md:mt-0">
                            ID: {property.id}
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm line-clamp-2">{property.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4 text-xs">
                          <span className="px-2 py-1 bg-gray-100 rounded-full">{property.bedrooms} bedrooms</span>
                          <span className="px-2 py-1 bg-gray-100 rounded-full">{property.bathrooms} bathrooms</span>
                          <span className="px-2 py-1 bg-gray-100 rounded-full">${property.price}/{property.priceUnit}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="text-xs text-gray-500">
                            Rejected: {property.updatedAt ? new Date(property.updatedAt).toLocaleDateString() : 'Unknown'}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              asChild
                            >
                              <Link to={`/property/${property.id}`}>
                                <Eye className="mr-1 h-4 w-4" />
                                View
                              </Link>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleApproveProperty(property.id)}
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className={property.featured ? "text-yellow-600 border-yellow-600 hover:bg-yellow-50" : "text-blue-600 border-blue-600 hover:bg-blue-50"}
                              onClick={() => updateProperty(property.id, { featured: !property.featured })}
                            >
                              {property.featured ? "Unfeature" : "Feature"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-lg border">
                <p className="text-gray-500">No rejected properties</p>
              </div>
            )}
          </TabsContent>

          {/* All properties tab */}
          <TabsContent value="all">
            <h2 className="text-lg font-medium mb-4">All Properties ({filteredProperties.length})</h2>
            {filteredProperties.length > 0 ? (
              <div className="space-y-4">
                {filteredProperties.map(property => (
                  <Card key={property.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {property.images && property.images.length > 0 && (
                        <div className="w-full md:w-48 h-40">
                          <img 
                            src={property.images[0]} 
                            alt={property.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="flex-1 p-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium text-lg">{property.title}</h3>
                            <p className="text-gray-500 text-sm">{property.location}</p>
                            <div className={`mt-1 inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                              property.status === 'approved' ? 'bg-green-100 text-green-800' : 
                              property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {property.status}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 mt-2 md:mt-0">
                            ID: {property.id}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4 text-xs">
                          <span className="px-2 py-1 bg-gray-100 rounded-full">{property.bedrooms} bedrooms</span>
                          <span className="px-2 py-1 bg-gray-100 rounded-full">{property.bathrooms} bathrooms</span>
                          <span className="px-2 py-1 bg-gray-100 rounded-full">${property.price}/{property.priceUnit}</span>
                          {property.featured && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">Featured</span>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="text-xs text-gray-500">
                            {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'Unknown'}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              asChild
                            >
                              <Link to={`/property/${property.id}`}>
                                <Eye className="mr-1 h-4 w-4" />
                                View
                              </Link>
                            </Button>
                            {property.status !== 'approved' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => handleApproveProperty(property.id)}
                              >
                                <Check className="mr-1 h-4 w-4" />
                                Approve
                              </Button>
                            )}
                            {property.status !== 'rejected' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => handleRejectProperty(property.id)}
                              >
                                <X className="mr-1 h-4 w-4" />
                                Reject
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-lg border">
                <p className="text-gray-500">No properties found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminProperties;
