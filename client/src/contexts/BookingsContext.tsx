import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { bookingsApi } from "../lib/api";

export interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  propertyId: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  phone?: string;
  comments?: string;
  createdAt: string;
}

interface BookingsContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => Promise<Booking>;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  getBookingById: (id: string) => Booking | undefined;
  loading: boolean;
}

const BookingsContext = createContext<BookingsContextType | undefined>(undefined);

export const useBookings = () => {
  const context = useContext(BookingsContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingsProvider');
  }
  return context;
};

export const BookingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingsApi.getAll();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const addBooking = async (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => {
    try {
      const newBooking = await bookingsApi.create(booking);
      setBookings(prev => [...prev, newBooking]);
      return newBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === id ? { ...booking, status } : booking
      )
    );
  };

  const getBookingById = (id: string) => {
    return bookings.find(booking => booking.id === id);
  };

  return (
    <BookingsContext.Provider value={{ 
      bookings, 
      addBooking, 
      updateBookingStatus, 
      getBookingById,
      loading 
    }}>
      {children}
    </BookingsContext.Provider>
  );
};