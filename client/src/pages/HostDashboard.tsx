import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Home, 
  TrendingUp, 
  Settings, 
  MessageCircle, 
  Star,
  Eye,
  Edit3,
  Plus,
  Filter,
  Download,
  Bell,
  MapPin,
  Clock
} from 'lucide-react';
import { Button } from '../components/ui/button';

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  priceUnit: string;
  status: string;
  featured: boolean;
  rating: number;
  reviewCount: number;
  images: string[];
  bookings: number;
  revenue: number;
  occupancyRate: number;
  lastBooked: string;
}

interface Booking {
  id: number;
  propertyId: number;
  propertyTitle: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  amount: number;
  status: string;
  createdAt: string;
}

interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  averageRating: number;
  occupancyRate: number;
  activeProperties: number;
  pendingBookings: number;
  monthlyGrowth: number;
  totalViews: number;
}

const HostDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalBookings: 0,
    averageRating: 0,
    occupancyRate: 0,
    activeProperties: 0,
    pendingBookings: 0,
    monthlyGrowth: 0,
    totalViews: 0
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days

  // Sample data - replace with API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalRevenue: 12450,
        totalBookings: 89,
        averageRating: 4.8,
        occupancyRate: 78,
        activeProperties: 5,
        pendingBookings: 7,
        monthlyGrowth: 15.2,
        totalViews: 1234
      });

      setProperties([
        {
          id: 1,
          title: "Luxury Beach Villa",
          location: "Agadir, Morocco",
          price: 200,
          priceUnit: "night",
          status: "approved",
          featured: true,
          rating: 4.9,
          reviewCount: 24,
          images: ["/placeholder.svg"],
          bookings: 28,
          revenue: 5600,
          occupancyRate: 85,
          lastBooked: "2024-06-28"
        },
        {
          id: 2,
          title: "Traditional Riad",
          location: "Marrakech, Morocco",
          price: 150,
          priceUnit: "night",
          status: "approved",
          featured: false,
          rating: 4.7,
          reviewCount: 18,
          images: ["/placeholder.svg"],
          bookings: 22,
          revenue: 3300,
          occupancyRate: 72,
          lastBooked: "2024-06-25"
        }
      ]);

      setBookings([
        {
          id: 1,
          propertyId: 1,
          propertyTitle: "Luxury Beach Villa",
          guestName: "John Smith",
          guestEmail: "john@example.com",
          checkIn: "2024-07-15",
          checkOut: "2024-07-20",
          guests: 4,
          amount: 1000,
          status: "confirmed",
          createdAt: "2024-06-30"
        },
        {
          id: 2,
          propertyId: 2,
          propertyTitle: "Traditional Riad",
          guestName: "Sarah Johnson",
          guestEmail: "sarah@example.com",
          checkIn: "2024-07-10",
          checkOut: "2024-07-14",
          guests: 2,
          amount: 600,
          status: "pending",
          createdAt: "2024-06-29"
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'properties', label: 'Properties', icon: Home },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const StatCard: React.FC<{ title: string; value: string; change?: string; icon: React.ReactNode; color: string }> = 
    ({ title, value, change, icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${parseFloat(change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {parseFloat(change) >= 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const PropertyCard: React.FC<{ property: Property }> = ({ property }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        {property.featured && (
          <div className="absolute top-2 left-2 bg-moroccan-gold text-white px-2 py-1 rounded-md text-xs font-medium">
            Featured
          </div>
        )}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium ${
          property.status === 'approved' ? 'bg-green-100 text-green-800' :
          property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {property.status}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{property.title}</h3>
        <p className="text-sm text-gray-600 mb-2 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {property.location}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-moroccan-gold">
            ${property.price}/{property.priceUnit}
          </span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium ml-1">{property.rating}</span>
            <span className="text-sm text-gray-500 ml-1">({property.reviewCount})</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center mb-4">
          <div>
            <p className="text-sm font-medium text-gray-900">{property.bookings}</p>
            <p className="text-xs text-gray-600">Bookings</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">${property.revenue}</p>
            <p className="text-xs text-gray-600">Revenue</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{property.occupancyRate}%</p>
            <p className="text-xs text-gray-600">Occupancy</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Edit3 className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </div>
    </div>
  );

  const BookingRow: React.FC<{ booking: Booking }> = ({ booking }) => (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-gray-900">{booking.guestName}</p>
          <p className="text-sm text-gray-600">{booking.guestEmail}</p>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm font-medium text-gray-900">{booking.propertyTitle}</p>
      </td>
      <td className="px-6 py-4">
        <div>
          <p className="text-sm text-gray-900">{booking.checkIn}</p>
          <p className="text-sm text-gray-600">to {booking.checkOut}</p>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm text-gray-900">{booking.guests} guests</p>
      </td>
      <td className="px-6 py-4">
        <p className="font-medium text-gray-900">${booking.amount}</p>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {booking.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <Button variant="outline" size="sm">
          Manage
        </Button>
      </td>
    </tr>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Revenue"
                value={`$${stats.totalRevenue.toLocaleString()}`}
                change="15.2"
                icon={<DollarSign className="h-6 w-6 text-white" />}
                color="bg-green-500"
              />
              <StatCard
                title="Total Bookings"
                value={stats.totalBookings.toString()}
                change="8.1"
                icon={<Calendar className="h-6 w-6 text-white" />}
                color="bg-blue-500"
              />
              <StatCard
                title="Average Rating"
                value={stats.averageRating.toFixed(1)}
                icon={<Star className="h-6 w-6 text-white" />}
                color="bg-yellow-500"
              />
              <StatCard
                title="Occupancy Rate"
                value={`${stats.occupancyRate}%`}
                change="5.3"
                icon={<TrendingUp className="h-6 w-6 text-white" />}
                color="bg-purple-500"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="bg-moroccan-gold hover:bg-moroccan-gold/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Calendar
                </Button>
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Messages
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.slice(0, 5).map((booking) => (
                      <BookingRow key={booking.id} booking={booking} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'properties':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
              <Button className="bg-moroccan-gold hover:bg-moroccan-gold/90">
                <Plus className="h-4 w-4 mr-2" />
                Add New Property
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        );

      case 'bookings':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Bookings Management</h2>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <BookingRow key={booking.id} booking={booking} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
                <option value="365">Last year</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Views"
                value={stats.totalViews.toLocaleString()}
                change="12.5"
                icon={<Eye className="h-6 w-6 text-white" />}
                color="bg-blue-500"
              />
              <StatCard
                title="Conversion Rate"
                value="3.2%"
                change="0.8"
                icon={<TrendingUp className="h-6 w-6 text-white" />}
                color="bg-green-500"
              />
              <StatCard
                title="Avg Booking Value"
                value="$540"
                change="7.1"
                icon={<DollarSign className="h-6 w-6 text-white" />}
                color="bg-purple-500"
              />
              <StatCard
                title="Response Time"
                value="2.3 hrs"
                change="-15.2"
                icon={<Clock className="h-6 w-6 text-white" />}
                color="bg-orange-500"
              />
            </div>

            {/* Placeholder for charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Revenue chart will be displayed here</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Sources</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Booking sources chart will be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{activeTab}</h3>
            <p className="text-gray-600">Content for {activeTab} tab will be implemented here.</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moroccan-gold mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Host Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-moroccan-gold rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">H</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Host Name</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-moroccan-gold text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default HostDashboard;
