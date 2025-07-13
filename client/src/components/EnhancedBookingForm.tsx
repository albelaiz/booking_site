import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { BookingService, type BookingData, type BookedDate } from '../lib/booking-service';
import { useAuth } from '../hooks/useAuth';

interface EnhancedBookingFormProps {
  property: {
    id: number;
    title: string;
    price: number;
    priceUnit: string;
    capacity: number;
  };
  onBookingSuccess?: (booking: any) => void;
  onClose?: () => void;
}

const EnhancedBookingForm: React.FC<EnhancedBookingFormProps> = ({ 
  property, 
  onBookingSuccess, 
  onClose 
}) => {
  const { userName: currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    guestName: currentUser || '',
    guestEmail: '',
    guestPhone: '',
    comments: ''
  });

  const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
  const [availability, setAvailability] = useState<{ available: boolean; message?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);

  // Load booked dates
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get booked dates for property
        const dates = await BookingService.getBookedDates(property.id);
        setBookedDates(dates);
      } catch (error) {
        console.error('Error loading booking data:', error);
      }
    };

    loadData();
  }, [property.id]);

  // Calculate total amount when dates change
  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const nights = BookingService.calculateNights(formData.checkIn, formData.checkOut);
      if (nights > 0) {
        const baseAmount = nights * parseFloat(property.price.toString());
        setTotalAmount(baseAmount);
      }
    }
  }, [formData.checkIn, formData.checkOut, property.price]);

  // Check availability when dates change
  useEffect(() => {
    const checkAvailability = async () => {
      if (formData.checkIn && formData.checkOut) {
        try {
          const result = await BookingService.checkAvailability(
            property.id,
            formData.checkIn,
            formData.checkOut
          );
          setAvailability(result);
          setError(null);
        } catch (error) {
          setError('Failed to check availability');
          setAvailability(null);
        }
      } else {
        setAvailability(null);
      }
    };

    const debounceTimer = setTimeout(checkAvailability, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.checkIn, formData.checkOut, property.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Enhanced form validation for better user experience
  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.checkIn) {
      errors.push('Check-in date is required');
    }
    
    if (!formData.checkOut) {
      errors.push('Check-out date is required');
    }
    
    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (checkInDate < today) {
        errors.push('Check-in date cannot be in the past');
      }
      
      if (checkOutDate <= checkInDate) {
        errors.push('Check-out date must be after check-in date');
      }
    }
    
    if (!formData.guestName.trim()) {
      errors.push('Guest name is required');
    }
    
    if (!formData.guestEmail.trim()) {
      errors.push('Email address is required');
    } else if (!/\S+@\S+\.\S+/.test(formData.guestEmail)) {
      errors.push('Please enter a valid email address');
    }
    
    if (!formData.guestPhone.trim()) {
      errors.push('Phone number is required');
    }
    
    if (formData.guests < 1 || formData.guests > property.capacity) {
      errors.push(`Number of guests must be between 1 and ${property.capacity}`);
    }
    
    return errors;
  };

  // Enhanced submit handler with better error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validate form
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        setLoading(false);
        return;
      }
      
      // Check availability one more time
      const availabilityCheck = await BookingService.checkAvailability(
        property.id,
        formData.checkIn,
        formData.checkOut
      );
      
      if (!availabilityCheck.available) {
        setError(availabilityCheck.message || 'Property is not available for selected dates');
        setLoading(false);
        return;
      }
         const bookingData: BookingData = {
      propertyId: property.id,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.guests,
      guestName: formData.guestName,
      guestEmail: formData.guestEmail,
      guestPhone: formData.guestPhone,
      amount: totalAmount,
      comments: formData.comments
    };
    
    const booking = await BookingService.createOrUpdateBooking(bookingData);
      
      // Show success message
      if (onBookingSuccess) {
        onBookingSuccess(booking);
      }
      
      // Reset form
      setFormData({
        checkIn: '',
        checkOut: '',
        guests: 1,
        guestName: currentUser || '',
        guestEmail: '',
        guestPhone: '',
        comments: ''
      });
      
    } catch (error) {
      console.error('Booking error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
  };

  const nights = formData.checkIn && formData.checkOut ? 
    BookingService.calculateNights(formData.checkIn, formData.checkOut) : 0;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Book This Property
        </h3>
        <p className="text-gray-600">{property.title}</p>
        <p className="text-lg font-semibold text-moroccan-gold">
          ${property.price} per {property.priceUnit}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
              Check-in
            </label>
            <input
              type="date"
              id="checkIn"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleInputChange}
              min={formatDateForInput(new Date())}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
            />
          </div>
          
          <div>
            <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">
              Check-out
            </label>
            <input
              type="date"
              id="checkOut"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleInputChange}
              min={formData.checkIn || formatDateForInput(new Date())}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
            />
          </div>
        </div>

        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
            Guests
          </label>
          <select
            id="guests"
            name="guests"
            value={formData.guests}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
          >
            {Array.from({ length: property.capacity }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-1">
            Guest Name
          </label>
          <input
            type="text"
            id="guestName"
            name="guestName"
            value={formData.guestName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
          />
        </div>

        <div>
          <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="guestEmail"
            name="guestEmail"
            value={formData.guestEmail}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
          />
        </div>

        <div>
          <label htmlFor="guestPhone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone (Optional)
          </label>
          <input
            type="tel"
            id="guestPhone"
            name="guestPhone"
            value={formData.guestPhone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
          />
        </div>

        <div>
          <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests (Optional)
          </label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
            placeholder="Any special requests or comments..."
          />
        </div>

        {/* Availability Status */}
        {availability && (
          <div className={`p-3 rounded-lg border ${
            availability.available 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {availability.available ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                availability.available ? 'text-green-800' : 'text-red-800'
              }`}>
                {availability.available ? 'Available for booking' : availability.message}
              </span>
            </div>
          </div>
        )}

        {/* Show booked dates if property is not available */}
        {bookedDates.length > 0 && !availability?.available && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Already Booked Dates:</h4>
            <div className="space-y-1">
              {bookedDates.slice(0, 5).map((booking, index) => (
                <div key={index} className="text-xs text-gray-600">
                  {BookingService.formatDateRange(booking.checkIn, booking.checkOut)}
                </div>
              ))}
              {bookedDates.length > 5 && (
                <div className="text-xs text-gray-500">
                  ... and {bookedDates.length - 5} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Booking Summary */}
        {nights > 0 && totalAmount > 0 && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Booking Summary:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>${property.price} × {nights} nights</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-1 mt-2 font-medium text-gray-900">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
              <span className="text-red-800 text-sm whitespace-pre-line">{error}</span>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            type="submit"
            disabled={loading || !availability?.available}
            className="flex-1 bg-moroccan-gold hover:bg-moroccan-gold/90 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Book Now'}
          </Button>
          
          {onClose && (
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="px-4 py-2"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EnhancedBookingForm;
