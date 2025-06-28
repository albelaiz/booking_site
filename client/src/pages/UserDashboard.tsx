import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar, MapPin, Star, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBookings } from '../contexts/BookingsContext';

const UserDashboard = () => {
  const { bookings } = useBookings();
  const userName = localStorage.getItem('userName') || 'User';
  
  // Filter bookings for current user (simplified - in real app would use user ID)
  const userBookings = bookings.slice(0, 3); // Show recent bookings

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-16">
        <div className="container-custom">
          {/* Welcome Section */}
          <div className="mb-10">
            <h1 className="text-3xl font-serif font-medium mb-2">Welcome back, {userName}!</h1>
            <p className="text-gray-600">Manage your bookings and discover new properties in Martil.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Your Recent Bookings
                  </CardTitle>
                  <CardDescription>
                    View and manage your upcoming stays
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userBookings.length > 0 ? (
                    <div className="space-y-4">
                      {userBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{booking.propertyName}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">{booking.guests} guests</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${booking.amount}</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No bookings yet</p>
                      <Button asChild>
                        <Link to="/properties">Browse Properties</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recommended Properties */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Recommended for You
                  </CardTitle>
                  <CardDescription>
                    Properties you might enjoy based on your preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Discover amazing properties in Martil</p>
                    <Button asChild>
                      <Link to="/properties">Explore Properties</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full">
                    <Link to="/properties">Browse Properties</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/contact">Contact Support</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/become-host">Become a Host</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Account Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Account
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Logged in as:</p>
                    <p className="font-medium">{userName}</p>
                    <p className="text-sm text-gray-500">Member since 2024</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserDashboard;