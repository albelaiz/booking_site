const API_BASE_URL = '/api';

export interface HostStats {
  totalRevenue: number;
  totalBookings: number;
  averageRating: number;
  occupancyRate: number;
  activeProperties: number;
  pendingBookings: number;
  monthlyGrowth: number;
  totalViews: number;
  conversionRate: number;
  averageBookingValue: number;
  responseTime: number;
}

export interface HostProperty {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  priceUnit: string;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  rating: number;
  reviewCount: number;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  amenities: string[];
  bookings: number;
  revenue: number;
  occupancyRate: number;
  lastBooked: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface HostBooking {
  id: number;
  propertyId: number;
  propertyTitle: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  propertyId?: number;
  createdAt: string;
}

export interface AnalyticsData {
  period: string;
  revenue: number;
  bookings: number;
  views: number;
  date: string;
}

// Simple API utility
const api = {
  get: async (url: string) => {
    const headers: HeadersInit = {};
    const userRole = localStorage.getItem('userRole');
    
    // Add auth token for authenticated requests
    if (userRole === 'admin' || userRole === 'staff' || userRole === 'owner') {
      headers.Authorization = `Bearer ${userRole}-token`;
    }
    
    const response = await fetch(`${API_BASE_URL}${url}`, { headers });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
  
  post: async (url: string, data: any) => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    const userRole = localStorage.getItem('userRole');
    
    // Add auth token for authenticated requests
    if (userRole === 'admin' || userRole === 'staff' || userRole === 'owner') {
      headers.Authorization = `Bearer ${userRole}-token`;
    }
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
  
  put: async (url: string, data: any) => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    const userRole = localStorage.getItem('userRole');
    
    // Add auth token for authenticated requests
    if (userRole === 'admin' || userRole === 'staff' || userRole === 'owner') {
      headers.Authorization = `Bearer ${userRole}-token`;
    }
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  delete: async (url: string) => {
    const headers: HeadersInit = {};
    const userRole = localStorage.getItem('userRole');
    
    // Add auth token for authenticated requests
    if (userRole === 'admin' || userRole === 'staff' || userRole === 'owner') {
      headers.Authorization = `Bearer ${userRole}-token`;
    }
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }
};

export class HostService {
  // Dashboard Stats
  static async getDashboardStats(ownerId: number, period: string = '30'): Promise<HostStats> {
    try {
      return await api.get(`/hosts/${ownerId}/stats?period=${period}`);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return mock data for demo
      return {
        totalRevenue: 12450,
        totalBookings: 89,
        averageRating: 4.8,
        occupancyRate: 78,
        activeProperties: 5,
        pendingBookings: 7,
        monthlyGrowth: 15.2,
        totalViews: 1234,
        conversionRate: 3.2,
        averageBookingValue: 540,
        responseTime: 2.3
      };
    }
  }

  // Property Management
  static async getHostProperties(ownerId: number): Promise<HostProperty[]> {
    try {
      return await api.get(`/properties/owner/${ownerId}`);
    } catch (error) {
      console.error('Error fetching host properties:', error);
      return [];
    }
  }

  static async createProperty(propertyData: Partial<HostProperty>): Promise<HostProperty> {
    try {
      return await api.post('/properties', propertyData);
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  static async updateProperty(propertyId: number, updateData: Partial<HostProperty>): Promise<HostProperty> {
    try {
      return await api.put(`/properties/${propertyId}`, updateData);
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }

  static async deleteProperty(propertyId: number): Promise<boolean> {
    try {
      await api.delete(`/properties/${propertyId}`);
      return true;
    } catch (error) {
      console.error('Error deleting property:', error);
      return false;
    }
  }

  static async togglePropertyFeatured(propertyId: number, featured: boolean): Promise<HostProperty> {
    try {
      return await api.put(`/properties/${propertyId}`, { featured });
    } catch (error) {
      console.error('Error toggling property featured status:', error);
      throw error;
    }
  }

  // Booking Management
  static async getHostBookings(ownerId: number, filters?: {
    status?: string;
    propertyId?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<HostBooking[]> {
    try {
      const query = new URLSearchParams();
      if (filters?.status) query.append('status', filters.status);
      if (filters?.propertyId) query.append('propertyId', filters.propertyId.toString());
      if (filters?.startDate) query.append('startDate', filters.startDate);
      if (filters?.endDate) query.append('endDate', filters.endDate);
      
      return await api.get(`/hosts/${ownerId}/bookings?${query.toString()}`);
    } catch (error) {
      console.error('Error fetching host bookings:', error);
      return [];
    }
  }

  static async updateBookingStatus(bookingId: number, status: string): Promise<HostBooking> {
    try {
      return await api.put(`/bookings/${bookingId}`, { status });
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  static async getBookingDetails(bookingId: number): Promise<HostBooking> {
    try {
      return await api.get(`/bookings/${bookingId}`);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  }

  // Calendar Management
  static async getPropertyCalendar(propertyId: number, startDate: string, endDate: string) {
    try {
      return await api.get(`/properties/${propertyId}/calendar?start=${startDate}&end=${endDate}`);
    } catch (error) {
      console.error('Error fetching property calendar:', error);
      return [];
    }
  }

  static async blockDates(propertyId: number, dates: { start: string; end: string; reason?: string }) {
    try {
      return await api.post(`/properties/${propertyId}/block-dates`, dates);
    } catch (error) {
      console.error('Error blocking dates:', error);
      throw error;
    }
  }

  static async unblockDates(propertyId: number, blockId: number) {
    try {
      return await api.delete(`/properties/${propertyId}/block-dates/${blockId}`);
    } catch (error) {
      console.error('Error unblocking dates:', error);
      throw error;
    }
  }

  // Messages
  static async getHostMessages(ownerId: number, status?: string): Promise<Message[]> {
    try {
      const query = status ? `?status=${status}` : '';
      return await api.get(`/hosts/${ownerId}/messages${query}`);
    } catch (error) {
      console.error('Error fetching host messages:', error);
      return [];
    }
  }

  static async markMessageAsRead(messageId: number): Promise<Message> {
    try {
      return await api.put(`/messages/${messageId}`, { status: 'read' });
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  static async replyToMessage(messageId: number, reply: string): Promise<boolean> {
    try {
      await api.post(`/messages/${messageId}/reply`, { message: reply });
      return true;
    } catch (error) {
      console.error('Error replying to message:', error);
      return false;
    }
  }

  // Analytics
  static async getAnalyticsData(ownerId: number, period: string, propertyId?: number): Promise<AnalyticsData[]> {
    try {
      const query = new URLSearchParams({ period });
      if (propertyId) query.append('propertyId', propertyId.toString());
      
      return await api.get(`/hosts/${ownerId}/analytics?${query.toString()}`);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      return [];
    }
  }

  static async getRevenueAnalytics(ownerId: number, period: string) {
    try {
      return await api.get(`/hosts/${ownerId}/analytics/revenue?period=${period}`);
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      return [];
    }
  }

  static async getBookingSourceAnalytics(ownerId: number, period: string) {
    try {
      return await api.get(`/hosts/${ownerId}/analytics/booking-sources?period=${period}`);
    } catch (error) {
      console.error('Error fetching booking source analytics:', error);
      return [];
    }
  }

  // Reviews
  static async getPropertyReviews(propertyId: number) {
    try {
      return await api.get(`/properties/${propertyId}/reviews`);
    } catch (error) {
      console.error('Error fetching property reviews:', error);
      return [];
    }
  }

  static async respondToReview(reviewId: number, response: string) {
    try {
      return await api.post(`/reviews/${reviewId}/respond`, { response });
    } catch (error) {
      console.error('Error responding to review:', error);
      throw error;
    }
  }

  // Financial Reports
  static async generateFinancialReport(ownerId: number, startDate: string, endDate: string, format: 'pdf' | 'csv' = 'pdf') {
    try {
      const response = await fetch(`${API_BASE_URL}/hosts/${ownerId}/reports/financial?start=${startDate}&end=${endDate}&format=${format}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `financial-report-${startDate}-${endDate}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error generating financial report:', error);
      throw error;
    }
  }

  static async generateBookingReport(ownerId: number, startDate: string, endDate: string, format: 'pdf' | 'csv' = 'pdf') {
    try {
      const response = await fetch(`${API_BASE_URL}/hosts/${ownerId}/reports/bookings?start=${startDate}&end=${endDate}&format=${format}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `booking-report-${startDate}-${endDate}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error generating booking report:', error);
      throw error;
    }
  }

  // Pricing Optimization
  static async getPricingSuggestions(propertyId: number) {
    try {
      return await api.get(`/properties/${propertyId}/pricing-suggestions`);
    } catch (error) {
      console.error('Error fetching pricing suggestions:', error);
      return null;
    }
  }

  static async updatePricing(propertyId: number, pricing: { basePrice: number; seasonalRates?: any[] }) {
    try {
      return await api.put(`/properties/${propertyId}/pricing`, pricing);
    } catch (error) {
      console.error('Error updating pricing:', error);
      throw error;
    }
  }

  // Utility functions
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  static formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  static formatDateRange(checkIn: string | Date, checkOut: string | Date): string {
    const start = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
    const end = typeof checkOut === 'string' ? new Date(checkOut) : checkOut;
    
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric' 
    };
    
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  }

  static calculateNights(checkIn: string | Date, checkOut: string | Date): number {
    const start = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
    const end = typeof checkOut === 'string' ? new Date(checkOut) : checkOut;
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  static getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'approved':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  static getOccupancyColor(rate: number): string {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  static getRatingStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
  }
}
