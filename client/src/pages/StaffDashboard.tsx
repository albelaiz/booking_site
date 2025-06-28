import React from 'react';
import StaffLayout from '../components/StaffLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Building, Calendar, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProperties } from '../contexts/PropertiesContext';
import { useBookings } from '../contexts/BookingsContext';

const StaffDashboard = () => {
  const { bookings } = useBookings();
  const { properties } = useProperties();

  // Calculate stats
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const totalProperties = properties.length;
  const pendingProperties = properties.filter(p => p.status === 'pending').length;

  const stats = [
    {
      title: 'Total Bookings',
      value: totalBookings,
      icon: Calendar,
      link: '/staff/bookings',
      color: 'text-blue-600'
    },
    {
      title: 'Pending Bookings',
      value: pendingBookings,
      icon: Calendar,
      link: '/staff/bookings',
      color: 'text-yellow-600'
    },
    {
      title: 'Total Properties',
      value: totalProperties,
      icon: Building,
      link: '/staff/properties',
      color: 'text-green-600'
    },
    {
      title: 'Pending Properties',
      value: pendingProperties,
      icon: Building,
      link: '/staff/properties',
      color: 'text-orange-600'
    }
  ];

  return (
    <StaffLayout title="Staff Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Staff Portal</h2>
          <p className="text-gray-600">Manage properties and bookings from your staff dashboard.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.color}`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/staff/properties"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Building className="h-6 w-6 text-moroccan-blue mr-3" />
              <div>
                <p className="font-medium">Manage Properties</p>
                <p className="text-sm text-gray-500">Review and approve property listings</p>
              </div>
            </Link>
            <Link
              to="/staff/bookings"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="h-6 w-6 text-moroccan-blue mr-3" />
              <div>
                <p className="font-medium">Manage Bookings</p>
                <p className="text-sm text-gray-500">Handle booking requests and confirmations</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffDashboard;