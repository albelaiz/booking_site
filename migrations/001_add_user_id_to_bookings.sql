-- Migration to add userId column to bookings table
-- This allows tracking which user made a booking (for registered users)

-- Add userId column that references users table
ALTER TABLE bookings 
ADD COLUMN user_id INTEGER REFERENCES users(id);

-- Create index for better query performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_property_dates ON bookings(property_id, check_in, check_out);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Update existing bookings to set user_id based on email if possible
-- (This is optional and depends on your existing data)
-- UPDATE bookings SET user_id = (
--   SELECT users.id FROM users 
--   WHERE users.email = bookings.guest_email
-- ) WHERE EXISTS (
--   SELECT 1 FROM users 
--   WHERE users.email = bookings.guest_email
-- );
