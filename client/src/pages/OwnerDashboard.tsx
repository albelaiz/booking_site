
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
import { Pencil, Plus, Trash2, Eye, Home, DollarSign, Calendar, MapPin, Users, Star, TrendingUp, Settings, MessageCircle, BarChart3, Brain, Sparkles } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import TamudaHostChatbot from '../components/HostChatbot';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { properties, addProperty, updateProperty, deleteProperty } = useProperties();
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isGeneratingReview, setIsGeneratingReview] = useState(false);
  const [reviewAnalysis, setReviewAnalysis] = useState<any>(null);
  
  // Get authenticated user data
  const userName = localStorage.getItem('userName') || 'Property Owner';
  const userRole = localStorage.getItem('userRole') || 'owner';
  const ownerId = localStorage.getItem('userId') || '3'; // Default to owner ID from database
  
  // Filter properties for the current user
  const ownerProperties = properties.filter(p => p.ownerId === parseInt(ownerId));
  
  // Calculate dashboard stats
  const totalProperties = ownerProperties.length;
  const activeProperties = ownerProperties.filter(p => p.status === 'approved').length;
  const pendingProperties = ownerProperties.filter(p => p.status === 'pending').length;
  const rejectedProperties = ownerProperties.filter(p => p.status === 'rejected').length;
  const totalRevenue = ownerProperties.reduce((sum, p) => sum + (parseFloat(p.price.toString()) * 30), 0); // Estimated monthly
  
  const handleAddProperty = async (propertyData: any) => {
    try {
      await addProperty({
        ...propertyData,
        ownerId: parseInt(ownerId), // Add authenticated owner ID to the property
        status: 'pending', // New listings start as pending
        createdAt: new Date().toISOString(),
      });
      
      setIsAddingProperty(false);
      toast({
        title: "Property submitted",
        description: "Your property listing has been submitted for admin review and will be published once approved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit property. Please try again.",
        variant: "destructive"
      });
    }
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

  const handleGenerateReviewAnalysis = async () => {
    setIsGeneratingReview(true);
    try {
      const response = await fetch('/api/review-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId: ownerId,
          properties: ownerProperties.map(p => p.id)
        }),
      });

      if (response.ok) {
        const analysis = await response.json();
        setReviewAnalysis(analysis);
        toast({
          title: "Analysis Complete",
          description: "AI review analysis has been generated successfully.",
        });
      } else {
        throw new Error('Failed to generate analysis');
      }
    } catch (error) {
      console.error('Error generating review analysis:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to generate review analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingReview(false);
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
                  <p className="text-lg text-gray-600 mb-4">
                    Manage your properties and grow your rental business
                  </p>
                  
                  {/* Host Assistant Button */}
                  <Button 
                    onClick={() => {
                      // Scroll to bottom to reveal host chatbot
                      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                      // Trigger host chatbot to open
                      setTimeout(() => {
                        const hostChatButton = document.querySelector('[data-host-chat-trigger]') as HTMLElement;
                        if (hostChatButton) {
                          hostChatButton.click();
                        }
                      }, 1000);
                    }}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3"
                  >
                    <Home className="h-5 w-5 mr-2" />
                    🤖 Get AI Host Assistant Help
                  </Button>
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
            <TabsList className="grid w-full grid-cols-4 bg-white rounded-lg shadow-sm">
              <TabsTrigger value="properties" className="data-[state=active]:bg-moroccan-blue data-[state=active]:text-white">
                <Home className="h-4 w-4 mr-2" />
                My Properties
              </TabsTrigger>
              <TabsTrigger value="bookings" className="data-[state=active]:bg-moroccan-blue data-[state=active]:text-white">
                <Calendar className="h-4 w-4 mr-2" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-moroccan-blue data-[state=active]:text-white">
                <Brain className="h-4 w-4 mr-2" />
                Reviews & AI
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

            <TabsContent value="reviews" className="pt-8">
              <div className="space-y-6">
                {/* AI Review Summarizer Header */}
                <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                      <Brain className="mr-3 h-6 w-6" />
                      AI Review Summarizer
                      <Sparkles className="ml-2 h-5 w-5 animate-pulse" />
                    </CardTitle>
                    <CardDescription className="text-purple-100">
                      Get AI-powered insights and summaries of your property reviews to improve guest satisfaction
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Review Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Overall Sentiment */}
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center text-green-800">
                        <BarChart3 className="mr-2 h-5 w-5" />
                        Overall Sentiment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
                        <p className="text-sm text-green-700">Positive Reviews</p>
                        <div className="mt-4 bg-green-200 rounded-full h-2">
                          <div className="bg-green-500 rounded-full h-2" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Most Praised Features */}
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center text-blue-800">
                        <Star className="mr-2 h-5 w-5" />
                        Most Praised
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">Location</span>
                          <span className="text-sm font-semibold text-blue-600">92%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">Cleanliness</span>
                          <span className="text-sm font-semibold text-blue-600">88%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">Host Service</span>
                          <span className="text-sm font-semibold text-blue-600">85%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700">Amenities</span>
                          <span className="text-sm font-semibold text-blue-600">82%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Areas for Improvement */}
                  <Card className="border-orange-200 bg-orange-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center text-orange-800">
                        <TrendingUp className="mr-2 h-5 w-5" />
                        Improvement Areas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-orange-700">WiFi Speed</span>
                          <span className="text-sm font-semibold text-orange-600">65%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-orange-700">Check-in Process</span>
                          <span className="text-sm font-semibold text-orange-600">72%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-orange-700">Parking</span>
                          <span className="text-sm font-semibold text-orange-600">68%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-orange-700">Noise Level</span>
                          <span className="text-sm font-semibold text-orange-600">70%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* AI-Generated Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="mr-2 h-5 w-5 text-purple-600" />
                      AI Summary & Recommendations
                    </CardTitle>
                    <CardDescription>
                      Based on analysis of your latest reviews
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">✨ Key Insights</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Your properties are consistently praised for their excellent location and cleanliness. 
                        Guests particularly love the proximity to Martil Beach and the authentic Moroccan décor. 
                        The most common positive themes include "beautiful views," "spotless accommodation," and "helpful host."
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-800 mb-2">🎯 Action Items</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• <strong>WiFi Upgrade:</strong> Consider upgrading internet speed - mentioned in 23% of reviews</li>
                        <li>• <strong>Check-in Guide:</strong> Create a digital check-in guide to streamline the process</li>
                        <li>• <strong>Parking Info:</strong> Add clear parking instructions to your listing description</li>
                        <li>• <strong>Noise Management:</strong> Consider soundproofing or quiet hours policy</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">🚀 Growth Opportunities</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Your high ratings for location and cleanliness suggest you could increase prices by 10-15% 
                        during peak season. Consider highlighting these strengths in your listing title and description 
                        to attract more bookings.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      onClick={handleGenerateReviewAnalysis}
                      disabled={isGeneratingReview}
                    >
                      {isGeneratingReview ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Analyzing Reviews...
                        </>
                      ) : (
                        <>
                          <Brain className="mr-2 h-4 w-4" />
                          Generate New Analysis
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>

                {/* Recent Reviews */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Recent Reviews
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {ownerProperties.reduce((sum, p) => sum + (p.reviewCount || 0), 0)} Total Reviews
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Latest guest feedback across all your properties
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Sample reviews - in real implementation, these would come from API */}
                      <div className="border-l-4 border-green-400 pl-4 py-2 bg-green-50 rounded-r-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="flex text-yellow-400">
                              {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-600">Villa Tamuda Bay</span>
                          </div>
                          <span className="text-xs text-gray-500">2 days ago</span>
                        </div>
                        <p className="text-sm text-gray-700 italic">
                          "Amazing location with stunning sea views! The villa was spotlessly clean and the host was incredibly helpful. 
                          Would definitely stay again when visiting Morocco."
                        </p>
                        <p className="text-xs text-gray-600 mt-1">- Sarah M. from UK</p>
                      </div>

                      <div className="border-l-4 border-blue-400 pl-4 py-2 bg-blue-50 rounded-r-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="flex text-yellow-400">
                              {[1,2,3,4].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                              <Star className="h-4 w-4 text-gray-300" />
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-600">Riad Martil</span>
                          </div>
                          <span className="text-xs text-gray-500">1 week ago</span>
                        </div>
                        <p className="text-sm text-gray-700 italic">
                          "Beautiful traditional Moroccan décor and great location. WiFi could be faster for remote work, 
                          but overall a wonderful experience."
                        </p>
                        <p className="text-xs text-gray-600 mt-1">- Ahmed K. from Spain</p>
                      </div>

                      <div className="border-l-4 border-yellow-400 pl-4 py-2 bg-yellow-50 rounded-r-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="flex text-yellow-400">
                              {[1,2,3,4].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                              <Star className="h-4 w-4 text-gray-300" />
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-600">Casa Marina</span>
                          </div>
                          <span className="text-xs text-gray-500">2 weeks ago</span>
                        </div>
                        <p className="text-sm text-gray-700 italic">
                          "Lovely apartment with great amenities. Check-in process was a bit confusing, 
                          could benefit from clearer instructions."
                        </p>
                        <p className="text-xs text-gray-600 mt-1">- Marie L. from France</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <Button variant="outline" className="border-moroccan-blue text-moroccan-blue hover:bg-moroccan-blue hover:text-white">
                        View All Reviews
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
      
      {/* Host Chatbot for Property Owners */}
      <TamudaHostChatbot />
    </div>
  );
};

export default OwnerDashboard;
