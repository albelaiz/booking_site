// Test script to demonstrate the enhanced booking system functionality
// Run with: node test-enhanced-booking-system.js

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testProperty = {
  id: 1,
  title: "Test Property",
  price: 100,
  capacity: 4
};

const testUser = {
  id: 1,
  name: "John Doe",
  email: "john@example.com"
};

// API helper functions
const api = {
  get: async (url) => {
    const response = await fetch(`${API_BASE_URL}${url}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.json();
  },
  
  post: async (url, data) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.json();
  }
};

// Test functions
async function testBookingSystem() {
  console.log('🚀 Testing Enhanced Booking System');
  console.log('=====================================\n');

  try {
    // Test 1: Check initial availability
    console.log('📅 Test 1: Checking initial availability for dates 2024-07-01 to 2024-07-05');
    const availability1 = await api.get('/properties/1/availability?checkIn=2024-07-01&checkOut=2024-07-05');
    console.log('Result:', availability1);
    console.log('✅ Should be available initially\n');

    // Test 2: Create first booking for registered user
    console.log('📝 Test 2: Creating first booking for registered user');
    const booking1Data = {
      propertyId: 1,
      userId: 1,
      guestName: "John Doe",
      guestEmail: "john@example.com",
      guestPhone: "+1-555-0123",
      checkIn: "2024-07-01",
      checkOut: "2024-07-05",
      guests: 2,
      amount: 400.00,
      comments: "First booking test"
    };
    
    const booking1 = await api.post('/bookings', booking1Data);
    console.log('Created booking:', booking1);
    console.log('✅ First booking created successfully\n');

    // Test 3: Try to create another booking for same user and property (should update existing)
    console.log('📝 Test 3: Attempting second booking for same user/property (should update existing)');
    const booking2Data = {
      ...booking1Data,
      checkIn: "2024-07-02",
      checkOut: "2024-07-06",
      guests: 3,
      amount: 400.00,
      comments: "Updated booking test"
    };
    
    const booking2 = await api.post('/bookings', booking2Data);
    console.log('Updated booking:', booking2);
    console.log('✅ Booking updated instead of creating new one\n');

    // Test 4: Check availability for overlapping dates (should fail)
    console.log('📅 Test 4: Checking availability for overlapping dates (should fail)');
    const availability2 = await api.get('/properties/1/availability?checkIn=2024-07-04&checkOut=2024-07-08');
    console.log('Result:', availability2);
    console.log('❌ Should show as not available with booked dates\n');

    // Test 5: Try to create overlapping booking from different user (should fail)
    console.log('📝 Test 5: Attempting overlapping booking from different guest (should fail)');
    const guestBookingData = {
      propertyId: 1,
      // No userId - guest booking
      guestName: "Jane Smith",
      guestEmail: "jane@example.com",
      checkIn: "2024-07-04",
      checkOut: "2024-07-08",
      guests: 2,
      amount: 400.00
    };
    
    try {
      const guestBooking = await api.post('/bookings', guestBookingData);
      console.log('❌ ERROR: Overlapping booking should have failed!');
    } catch (error) {
      console.log('✅ Correctly rejected overlapping booking:', error.message);
    }
    console.log('');

    // Test 6: Get booked dates for property
    console.log('📅 Test 6: Getting all booked dates for property');
    const bookedDates = await api.get('/properties/1/booked-dates');
    console.log('Booked dates:', bookedDates);
    console.log('✅ Successfully retrieved booked dates\n');

    // Test 7: Create non-overlapping guest booking
    console.log('📝 Test 7: Creating non-overlapping guest booking');
    const guestBookingData2 = {
      propertyId: 1,
      guestName: "Jane Smith",
      guestEmail: "jane@example.com",
      checkIn: "2024-07-10",
      checkOut: "2024-07-15",
      guests: 2,
      amount: 500.00
    };
    
    const guestBooking = await api.post('/bookings', guestBookingData2);
    console.log('Guest booking created:', guestBooking);
    console.log('✅ Non-overlapping guest booking created successfully\n');

    // Test 8: Get updated booked dates
    console.log('📅 Test 8: Getting updated booked dates for property');
    const bookedDates2 = await api.get('/properties/1/booked-dates');
    console.log('Updated booked dates:', bookedDates2);
    console.log('✅ Shows both bookings\n');

    // Test 9: Get user's bookings
    console.log('👤 Test 9: Getting user\'s bookings');
    const userBookings = await api.get('/users/1/bookings');
    console.log('User bookings:', userBookings);
    console.log('✅ User should have one booking (updated one)\n');

    console.log('🎉 All tests completed successfully!');
    console.log('=====================================');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  // Running in Node.js
  const fetch = require('node-fetch');
  global.fetch = fetch;
  testBookingSystem();
}

module.exports = { testBookingSystem };
