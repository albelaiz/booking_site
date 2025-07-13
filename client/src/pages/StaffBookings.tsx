
import React, { useState } from 'react';
import { Building, Filter, Search } from 'lucide-react';
import { useToast } from "../hooks/use-toast";
import { useBookings } from "../contexts/BookingsContext";
import StaffLayout from '../components/StaffLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const StaffBookings = () => {
  const { toast } = useToast();
  const { bookings, updateBookingStatus, loading } = useBookings();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter bookings by search term and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    updateBookingStatus(id, newStatus as any);
    
    toast({
      title: "Booking Status Updated",
      description: `Booking #${id} has been marked as ${newStatus}.`,
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <StaffLayout title="Bookings Management" currentPath="/staff/bookings">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-moroccan-blue">{bookings.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">Pending Bookings</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {bookings.filter(b => b.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-moroccan-gold">
            ${bookings.reduce((sum, booking) => sum + booking.amount, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search bookings..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-moroccan-blue focus:border-moroccan-blue w-full md:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">Status:</span>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-moroccan-blue focus:border-moroccan-blue"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking Details</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="text-sm font-medium text-gray-900">
                      Booking #{booking.id}
                    </div>
                    <div className="text-xs text-gray-500">
                      {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'} • ${booking.amount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-gray-900">
                      {booking.guestName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {booking.guestEmail}
                    </div>
                    {booking.phone && (
                      <div className="text-xs text-gray-500">
                        {booking.phone}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900 max-w-[250px] truncate">
                      {booking.propertyName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      <div>{formatDate(booking.checkIn)}</div>
                      <div>{formatDate(booking.checkOut)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <select 
                      className="text-sm border border-gray-300 rounded-md px-2 py-1"
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirm</option>
                      <option value="completed">Complete</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Empty state */}
        {filteredBookings.length === 0 && (
          <div className="py-12 text-center">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {loading ? "Loading bookings..." : 
                searchTerm 
                  ? `No bookings match "${searchTerm}"` 
                  : filterStatus !== 'all' 
                    ? `No ${filterStatus} bookings found`
                    : 'No bookings have been made yet.'}
            </p>
          </div>
        )}
      </div>
    </StaffLayout>
  );
};

export default StaffBookings;
