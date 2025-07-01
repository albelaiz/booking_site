const API_BASE_URL = '/api';

// Simple API utility
const api = {
  get: async (url: string) => {
    const response = await fetch(`${API_BASE_URL}${url}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { data: await response.json() };
  },
  
  post: async (url: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { data: await response.json() };
  },
  
  put: async (url: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { data: await response.json() };
  }
};

export interface BookingData {
  propertyId: number;
  userId?: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  amount: number;
  comments?: string;
}

export interface BookedDate {
  checkIn: Date;
  checkOut: Date;
}

export interface AvailabilityResponse {
  available: boolean;
  bookedDates?: BookedDate[];
  message?: string;
}

export class BookingService {
  // Check if dates are available for booking
  static async checkAvailability(
    propertyId: number, 
    checkIn: string, 
    checkOut: string
  ): Promise<AvailabilityResponse> {
    try {
      const params = new URLSearchParams({
        checkIn,
        checkOut
      });
      
      const response = await api.get(`/properties/${propertyId}/availability?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw new Error('Failed to check availability');
    }
  }

  // Get all booked dates for a property
  static async getBookedDates(propertyId: number): Promise<BookedDate[]> {
    try {
      const response = await api.get(`/properties/${propertyId}/booked-dates`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booked dates:', error);
      throw new Error('Failed to fetch booked dates');
    }
  }

  // Create or update a booking
  static async createOrUpdateBooking(bookingData: BookingData) {
    try {
      // Validate dates
      const checkInDate = new Date(bookingData.checkIn);
      const checkOutDate = new Date(bookingData.checkOut);
      
      if (checkInDate >= checkOutDate) {
        throw new Error('Check-in date must be before check-out date');
      }

      if (checkInDate < new Date()) {
        throw new Error('Check-in date cannot be in the past');
      }

      // Check availability first
      const availability = await this.checkAvailability(
        bookingData.propertyId,
        bookingData.checkIn,
        bookingData.checkOut
      );

      if (!availability.available) {
        const error = new Error(availability.message || 'Property is not available for selected dates');
        (error as any).bookedDates = availability.bookedDates;
        throw error;
      }

      // Create the booking
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating/updating booking:', error);
      throw error;
    }
  }

  // Get user's bookings
  static async getUserBookings(userId: number) {
    try {
      const response = await api.get(`/users/${userId}/bookings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw new Error('Failed to fetch user bookings');
    }
  }

  // Update an existing booking
  static async updateBooking(bookingId: number, updateData: Partial<BookingData>) {
    try {
      // If updating dates, check availability
      if (updateData.checkIn || updateData.checkOut) {
        const availability = await this.checkAvailability(
          updateData.propertyId!,
          updateData.checkIn!,
          updateData.checkOut!
        );

        if (!availability.available) {
          const error = new Error(availability.message || 'Property is not available for selected dates');
          (error as any).bookedDates = availability.bookedDates;
          throw error;
        }
      }

      const response = await api.put(`/bookings/${bookingId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  // Get booking by ID
  static async getBooking(bookingId: number) {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw new Error('Failed to fetch booking');
    }
  }

  // Get all bookings (admin only)
  static async getAllBookings() {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  // Helper method to format dates for display
  static formatDateRange(checkIn: string | Date, checkOut: string | Date): string {
    const start = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
    const end = typeof checkOut === 'string' ? new Date(checkOut) : checkOut;
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  }

  // Helper method to calculate nights
  static calculateNights(checkIn: string | Date, checkOut: string | Date): number {
    const start = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
    const end = typeof checkOut === 'string' ? new Date(checkOut) : checkOut;
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Helper method to check if dates overlap
  static datesOverlap(
    start1: Date, 
    end1: Date, 
    start2: Date, 
    end2: Date
  ): boolean {
    return start1 < end2 && end1 > start2;
  }

  // Helper method to get disabled dates for date picker
  static getDisabledDates(bookedDates: BookedDate[]): Date[] {
    const disabled: Date[] = [];
    
    bookedDates.forEach(booking => {
      const start = new Date(booking.checkIn);
      const end = new Date(booking.checkOut);
      
      // Add all dates in the range
      for (let date = new Date(start); date < end; date.setDate(date.getDate() + 1)) {
        disabled.push(new Date(date));
      }
    });
    
    return disabled;
  }
}
