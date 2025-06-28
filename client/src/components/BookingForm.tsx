
import React, { useState } from 'react';
import { useToast } from "../hooks/use-toast";
import { useBookings } from "../contexts/BookingsContext";
import { useNavigate } from 'react-router-dom';

interface BookingFormProps {
  propertyId: string;
  propertyTitle: string;
  price: number;
  priceUnit: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ propertyId, propertyTitle, price, priceUnit }) => {
  const { toast } = useToast();
  const { addBooking } = useBookings();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate number of nights and total price based on check-in and check-out dates
  const calculateNights = () => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const nights = calculateNights();
  const totalPrice = nights * price;
  const cleaningFee = 50;
  const serviceFee = 30;
  const finalTotal = totalPrice + cleaningFee + serviceFee;

  const validateForm = () => {
    if (!checkIn) {
      toast({ title: "Error", description: "Please select a check-in date", variant: "destructive" });
      return false;
    }
    if (!checkOut) {
      toast({ title: "Error", description: "Please select a check-out date", variant: "destructive" });
      return false;
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
      toast({ title: "Error", description: "Check-out date must be after check-in date", variant: "destructive" });
      return false;
    }
    if (!name.trim()) {
      toast({ title: "Error", description: "Please enter your name", variant: "destructive" });
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Error", description: "Please enter a valid email address", variant: "destructive" });
      return false;
    }
    if (!phone.trim()) {
      toast({ title: "Error", description: "Please enter your phone number", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Add the booking to our context
    try {
      addBooking({
        propertyId,
        propertyName: propertyTitle,
        guestName: name,
        guestEmail: email,
        checkIn,
        checkOut,
        guests,
        phone,
        comments,
        amount: finalTotal
      });

      // Show success toast notification
      toast({
        title: "Booking Request Submitted",
        description: "We'll contact you shortly to confirm your reservation.",
      });

      // Reset form
      setCheckIn('');
      setCheckOut('');
      setGuests(1);
      setName('');
      setEmail('');
      setPhone('');
      setComments('');

      // Redirect to a thank you page or back to homepage after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      toast({
        title: "Booking Error",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-serif font-medium mb-6">Book this property</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="check-in" className="block text-sm font-medium text-gray-700 mb-1">
              Check-in Date
            </label>
            <input
              type="date"
              id="check-in"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div>
            <label htmlFor="check-out" className="block text-sm font-medium text-gray-700 mb-1">
              Check-out Date
            </label>
            <input
              type="date"
              id="check-out"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
            Guests
          </label>
          <select
            id="guests"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            required
          >
            {[...Array(10)].map((_, i) => (
              <option key={i} value={i + 1}>{i + 1} Guest{i !== 0 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests
          </label>
          <textarea
            id="comments"
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          ></textarea>
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 rounded p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">
              ${price} x {nights} {nights === 1 ? 'night' : 'nights'}
            </span>
            <span>${totalPrice}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Cleaning fee</span>
            <span>${cleaningFee}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Service fee</span>
            <span>${serviceFee}</span>
          </div>
          <div className="border-t border-gray-300 my-2"></div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${finalTotal}</span>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-moroccan-blue hover:bg-moroccan-blue/90 text-white py-3 rounded font-medium transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Processing...' : 'Request to Book'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
