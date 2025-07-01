# Enhanced Booking System Documentation

## Overview

This booking system implements the requirements for a property booking platform similar to Airbnb with advanced booking logic, overlap prevention, and user-specific booking management.

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  status TEXT NOT NULL DEFAULT 'active',
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### Properties Table
```sql
CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  price_unit TEXT NOT NULL DEFAULT 'night',
  images TEXT[],
  location TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  capacity INTEGER NOT NULL,
  amenities TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  owner_id INTEGER REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### Enhanced Bookings Table
```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id) NOT NULL,
  user_id INTEGER REFERENCES users(id), -- NULL for guest bookings
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  check_in TIMESTAMP NOT NULL,
  check_out TIMESTAMP NOT NULL,
  guests INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  comments TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### Key Indexes for Performance
```sql
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_property_dates ON bookings(property_id, check_in, check_out);
CREATE INDEX idx_bookings_status ON bookings(status);
```

## Core Booking Logic

### 1. Registered User Booking Logic

When a **registered user** tries to book a property:

1. **Check for existing booking**: Query if the user already has a booking for this property
2. **If existing booking found**: Update the existing booking instead of creating a new one
3. **If no existing booking**: Create a new booking
4. **Availability check**: Ensure the new/updated dates don't conflict with other bookings

```typescript
async createOrUpdateBooking(bookingData: BookingData): Promise<Booking> {
  // If userId is provided, check if user already has a booking for this property
  if (bookingData.userId) {
    const existingBooking = await this.getUserBookingForProperty(
      bookingData.userId,
      bookingData.propertyId
    );

    if (existingBooking) {
      // Update existing booking
      return await this.updateBooking(existingBooking.id, bookingData);
    }
  }

  // Create new booking
  return await this.createBooking(bookingData);
}
```

### 2. Guest User Booking Logic

When a **guest user** (not registered) tries to book:

1. **Always create new booking**: Guest bookings are always treated as new
2. **Availability check**: Ensure dates don't conflict with existing bookings
3. **Show booked dates**: If conflict, display all already booked date ranges

### 3. Overlap Prevention Logic

The system prevents overlapping bookings using sophisticated date range checking:

```typescript
async checkBookingAvailability(
  propertyId: number, 
  checkIn: Date, 
  checkOut: Date, 
  excludeBookingId?: number
): Promise<boolean> {
  const overlappingBookings = await db.select().from(bookings)
    .where(and(
      eq(bookings.propertyId, propertyId),
      ne(bookings.status, 'cancelled'),
      // Check for overlapping dates using OR conditions
      or(
        // New booking starts during existing booking
        and(
          lte(bookings.checkIn, checkIn),
          gte(bookings.checkOut, checkIn)
        ),
        // New booking ends during existing booking
        and(
          lte(bookings.checkIn, checkOut),
          gte(bookings.checkOut, checkOut)
        ),
        // New booking completely contains existing booking
        and(
          gte(bookings.checkIn, checkIn),
          lte(bookings.checkOut, checkOut)
        )
      )
    ));

  return overlappingBookings.length === 0;
}
```

### 4. Booked Dates Display

When a property is not available, the system shows all booked date ranges:

```typescript
async getBookedDatesForProperty(propertyId: number): Promise<{checkIn: Date, checkOut: Date}[]> {
  return await db.select({
    checkIn: bookings.checkIn,
    checkOut: bookings.checkOut
  }).from(bookings)
    .where(and(
      eq(bookings.propertyId, propertyId),
      ne(bookings.status, 'cancelled'),
      gte(bookings.checkOut, new Date()) // Only future or current bookings
    ))
    .orderBy(bookings.checkIn);
}
```

## API Endpoints

### Booking Management
- `POST /api/bookings` - Create or update booking (uses createOrUpdateBooking logic)
- `PUT /api/bookings/:id` - Update specific booking
- `GET /api/bookings/:id` - Get booking details
- `GET /api/bookings` - Get all bookings (admin)

### Availability Checking
- `GET /api/properties/:id/availability?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD` - Check availability
- `GET /api/properties/:id/booked-dates` - Get all booked date ranges

### User-Specific Bookings
- `GET /api/users/:id/bookings` - Get all bookings for a user

## Frontend Components

### EnhancedBookingForm Component

Key features:
- **Real-time availability checking**: As user selects dates
- **Booked dates display**: Shows conflicting bookings when dates aren't available
- **Price calculation**: Automatic total calculation based on nights
- **Validation**: Client-side date validation
- **Error handling**: Comprehensive error messages with booking conflicts

### BookingService Class

Provides methods for:
- `checkAvailability()` - Check if dates are available
- `getBookedDates()` - Get all booked dates for a property
- `createOrUpdateBooking()` - Main booking creation logic
- `getUserBookings()` - Get user's bookings
- Helper methods for date formatting and calculations

## Key Features Implemented

### ✅ Single Booking Per User-Property
- Each registered user can only have one active booking per property
- Subsequent booking attempts update the existing booking

### ✅ Overlap Prevention
- Sophisticated date range checking prevents double bookings
- Handles all overlap scenarios (partial overlaps, complete containment, etc.)

### ✅ Booked Dates Display
- When booking fails due to conflicts, shows all existing booked date ranges
- Helps users understand availability patterns

### ✅ Guest vs Registered User Logic
- Different booking flows for guests and registered users
- Guests always create new bookings
- Registered users get update-existing-booking behavior

### ✅ Real-time Availability
- Live checking as users input dates
- Immediate feedback on availability

### ✅ Comprehensive Validation
- Date range validation (check-in before check-out)
- Past date prevention
- Capacity validation
- Email format validation

## Usage Examples

### Creating a Booking (Registered User)
```typescript
const bookingData = {
  propertyId: 1,
  userId: 123, // Registered user ID
  guestName: "John Doe",
  guestEmail: "john@example.com",
  checkIn: "2024-07-01",
  checkOut: "2024-07-05",
  guests: 2,
  amount: 400.00
};

// This will update existing booking if user already has one for this property
const booking = await BookingService.createOrUpdateBooking(bookingData);
```

### Creating a Booking (Guest User)
```typescript
const bookingData = {
  propertyId: 1,
  // No userId - guest booking
  guestName: "Jane Smith",
  guestEmail: "jane@example.com",
  checkIn: "2024-07-10",
  checkOut: "2024-07-15",
  guests: 4,
  amount: 750.00
};

// This will always create a new booking
const booking = await BookingService.createOrUpdateBooking(bookingData);
```

### Checking Availability
```typescript
const availability = await BookingService.checkAvailability(
  propertyId: 1,
  checkIn: "2024-07-01",
  checkOut: "2024-07-05"
);

if (!availability.available) {
  console.log("Property not available");
  console.log("Booked dates:", availability.bookedDates);
}
```

## Database Queries for Common Operations

### Find User's Existing Booking for Property
```sql
SELECT * FROM bookings 
WHERE user_id = $1 
  AND property_id = $2 
  AND status != 'cancelled'
LIMIT 1;
```

### Check for Overlapping Bookings
```sql
SELECT * FROM bookings 
WHERE property_id = $1 
  AND status != 'cancelled'
  AND (
    (check_in <= $2 AND check_out >= $2) OR  -- New booking starts during existing
    (check_in <= $3 AND check_out >= $3) OR  -- New booking ends during existing  
    (check_in >= $2 AND check_out <= $3)     -- Existing booking within new booking
  );
```

### Get All Booked Dates for Property
```sql
SELECT check_in, check_out FROM bookings 
WHERE property_id = $1 
  AND status != 'cancelled'
  AND check_out >= NOW()
ORDER BY check_in;
```

This implementation provides a robust, scalable booking system that handles all the requirements while maintaining data consistency and providing excellent user experience.
