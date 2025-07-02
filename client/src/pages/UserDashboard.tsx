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
      
      <main className="flex-grow relative py-16 overflow-hidden">
        {/* Beach Paradise Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-blue-300 to-cyan-400"></div>
        
        {/* Ocean Waves SVG Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q25 0 50 10 T100 10 V20 H0 Z' fill='%23ffffff' fill-opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat-x',
          backgroundPosition: '0 80%',
          animation: 'wave 15s ease-in-out infinite'
        }}></div>
        
        {/* Floating Beach Elements */}
        <div className="absolute top-20 right-16 w-64 h-64 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
        <div className="absolute top-32 left-20 w-48 h-48 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-bounce-slow"></div>
        <div className="absolute bottom-20 right-32 w-56 h-56 bg-gradient-to-br from-teal-200 to-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-35 animate-float"></div>
        
        {/* Beach Sand Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-yellow-100 via-yellow-50 to-transparent opacity-60"></div>
        
        {/* Seashell Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23075985' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Cpath d='M20 15 Q15 18 20 25 Q25 18 20 15 Z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        {/* Coastal Breeze Animation */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-white/20 to-blue-100/20 rounded-full mix-blend-screen filter blur-3xl animate-drift"></div>
        
        <div className="container-custom relative z-10">
          {/* Welcome Section */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-serif font-medium mb-2 text-white drop-shadow-lg">Welcome back, {userName}!</h1>
            <p className="text-white/90 text-lg drop-shadow">Manage your bookings and discover new coastal properties in beautiful Martil.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Bookings */}
              <Card className="backdrop-blur-sm bg-white/90 border-white/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Calendar className="h-5 w-5 text-cyan-600" />
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
                      <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                        <Link to="/properties">Browse Properties</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recommended Properties */}
              <Card className="backdrop-blur-sm bg-white/90 border-white/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Star className="h-5 w-5 text-yellow-500" />
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
                    <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                      <Link to="/properties">Explore Properties</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="backdrop-blur-sm bg-white/90 border-white/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-slate-800">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                    <Link to="/properties">Browse Properties</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full border-cyan-200 text-cyan-700 hover:bg-cyan-50">
                    <Link to="/contact">Contact Support</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full border-teal-200 text-teal-700 hover:bg-teal-50">
                    <Link to="/become-host">List Your Property</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Account Info */}
              <Card className="backdrop-blur-sm bg-white/90 border-white/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <User className="h-5 w-5 text-cyan-600" />
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