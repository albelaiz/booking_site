
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyForm from '../components/PropertyForm';
import { useProperties } from '../contexts/PropertiesContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Property } from '../data/properties';
import { Pencil, Plus, Trash2, Eye, Home, DollarSign, Calendar, MapPin, Users, Star, TrendingUp, Settings } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { properties, addProperty, updateProperty, deleteProperty } = useProperties();
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  
  // Get authenticated user data
  const userName = localStorage.getItem('userName') || 'Property Owner';
  const userRole = localStorage.getItem('userRole') || 'owner';
  const ownerId = localStorage.getItem('userId') || '3'; // Default to owner ID from database
  
  // Filter properties for the current user
  const ownerProperties = properties.filter(p => p.ownerId === ownerId);
  
  // Calculate dashboard stats
  const totalProperties = ownerProperties.length;
  const activeProperties = ownerProperties.filter(p => p.status === 'approved').length;
  const pendingProperties = ownerProperties.filter(p => p.status === 'pending').length;
  const totalRevenue = ownerProperties.reduce((sum, p) => sum + (parseFloat(p.price.toString()) * 30), 0); // Estimated monthly
  
  const handleAddProperty = (propertyData: any) => {
    addProperty({
      ...propertyData,
      ownerId: ownerId, // Add authenticated owner ID to the property
      status: 'pending', // New listings start as pending
      createdAt: new Date().toISOString(),
    });
    
    setIsAddingProperty(false);
    toast({
      title: "Property submitted",
      description: "Your property listing has been submitted for review.",
    });
  };
  
  const handleUpdateProperty = (propertyData: any) => {
    if (editingProperty) {
      updateProperty(editingProperty.id, {
        ...propertyData,
        updatedAt: new Date().toISOString(),
      });
      
      setEditingProperty(null);
      toast({
        title: "Property updated",
        description: "Your property listing has been updated.",
      });
    }
  };
  
  const handleDeleteProperty = (id: string) => {
    if (window.confirm("Are you sure you want to delete this property listing?")) {
      deleteProperty(id);
      toast({
        title: "Property deleted",
        description: "Your property listing has been deleted.",
      });
    }
  };
  
  // Render property form modal or property listings
  if (isAddingProperty || editingProperty) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 py-16">
          <div className="container-custom">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddingProperty(false);
                  setEditingProperty(null);
                }}
              >
                Back to Dashboard
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
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <main className="flex-grow py-16">
        <div className="container-custom max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="mb-10">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Welcome back, {userName}!
                  </h1>
                  <p className="text-lg text-gray-600">
                    Manage your properties and grow your rental business
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="bg-gradient-to-r from-moroccan-blue to-moroccan-gold p-4 rounded-xl">
                    <Home className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Properties</p>
                      <p className="text-3xl font-bold">{totalProperties}</p>
                    </div>
                    <Home className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Active Listings</p>
                      <p className="text-3xl font-bold">{activeProperties}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm font-medium">Pending Review</p>
                      <p className="text-3xl font-bold">{pendingProperties}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-yellow-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Est. Monthly</p>
                      <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Tabs defaultValue="properties" className="mb-10">
            <TabsList className="grid w-full grid-cols-3 bg-white rounded-lg shadow-sm">
              <TabsTrigger value="properties" className="data-[state=active]:bg-moroccan-blue data-[state=active]:text-white">
                <Home className="h-4 w-4 mr-2" />
                My Properties
              </TabsTrigger>
              <TabsTrigger value="bookings" className="data-[state=active]:bg-moroccan-blue data-[state=active]:text-white">
                <Calendar className="h-4 w-4 mr-2" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-moroccan-blue data-[state=active]:text-white">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties" className="pt-8">
              <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Property Portfolio</h2>
                  <p className="text-gray-600 mt-1">Manage and monitor your rental properties</p>
                </div>
                <Button 
                  onClick={() => setIsAddingProperty(true)}
                  className="bg-gradient-to-r from-moroccan-blue to-moroccan-gold hover:from-moroccan-blue/90 hover:to-moroccan-gold/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add New Property
                </Button>
              </div>
              
              {ownerProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {ownerProperties.map((property) => (
                    <Card key={property.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
                      <div className="relative">
                        <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          {property.images && property.images.length > 0 ? (
                            <img 
                              src={property.images[0]} 
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Home className="h-16 w-16 text-gray-400" />
                          )}
                        </div>
                        <div className="absolute top-4 right-4">
                          <Badge 
                            className={`${
                              property.status === 'approved' 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : property.status === 'pending'
                                ? 'bg-yellow-500 hover:bg-yellow-600'
                                : 'bg-red-500 hover:bg-red-600'
                            } text-white border-0 shadow-md`}
                          >
                            {property.status === 'approved' ? 'Active' : 
                             property.status === 'pending' ? 'Pending' : 'Rejected'}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardHeader className="pb-4">
                        <div className="space-y-2">
                          <CardTitle className="text-xl group-hover:text-moroccan-blue transition-colors">{property.title}</CardTitle>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            <CardDescription className="text-sm">{property.location}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-moroccan-blue">
                              ${property.price}
                              <span className="text-sm font-normal text-gray-500">/{property.priceUnit}</span>
                            </span>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {property.capacity}
                              </div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                                {property.rating || 0}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-gray-50 rounded-lg p-2">
                              <div className="text-lg font-semibold text-gray-900">{property.bedrooms}</div>
                              <div className="text-xs text-gray-600">Bedrooms</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                              <div className="text-lg font-semibold text-gray-900">{property.bathrooms}</div>
                              <div className="text-xs text-gray-600">Bathrooms</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                              <div className="text-lg font-semibold text-gray-900">{property.capacity}</div>
                              <div className="text-xs text-gray-600">Guests</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-4 border-t bg-gray-50/50">
                        <div className="flex gap-2 w-full">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/property/${property.id}`)}
                            className="flex-1 hover:bg-gray-100"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingProperty(property)}
                            className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteProperty(property.id)}
                            className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12 border-2 border-dashed border-gray-300">
                  <CardContent>
                    <Home className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties yet</h3>
                    <p className="text-gray-600 mb-6">Start building your rental portfolio by adding your first property.</p>
                    <Button 
                      onClick={() => setIsAddingProperty(true)}
                      className="bg-gradient-to-r from-moroccan-blue to-moroccan-gold hover:from-moroccan-blue/90 hover:to-moroccan-gold/90 text-white"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Property
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="bookings" className="pt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Recent Bookings
                  </CardTitle>
                  <CardDescription>
                    Track reservations and guest activity across your properties
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600">Bookings will appear here once guests start reserving your properties.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="pt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your profile and account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <div className="mt-1 p-3 border rounded-lg bg-gray-50">{userName}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Role</label>
                      <div className="mt-1 p-3 border rounded-lg bg-gray-50 capitalize">{userRole}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Member Since</label>
                      <div className="mt-1 p-3 border rounded-lg bg-gray-50">
                        {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OwnerDashboard;
