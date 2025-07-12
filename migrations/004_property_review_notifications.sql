-- Migration: Property Review and Notifications System
-- Date: 2025-07-12

-- Add review fields to properties table
ALTER TABLE properties 
ADD COLUMN reviewed_at TIMESTAMP,
ADD COLUMN reviewed_by INTEGER REFERENCES users(id),
ADD COLUMN rejection_reason TEXT;

-- Create notifications table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  property_id INTEGER REFERENCES properties(id),
  metadata TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_property_id ON notifications(property_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_owner_id ON properties(owner_id);
CREATE INDEX idx_properties_reviewed_by ON properties(reviewed_by);

-- Add some sample notifications for testing
INSERT INTO notifications (user_id, type, title, message, property_id) 
SELECT 
  u.id,
  'property_review',
  'New Property Pending Review',
  'Property "' || p.title || '" submitted by ' || owner.name || ' requires review',
  p.id
FROM properties p
JOIN users u ON u.role = 'admin'
JOIN users owner ON owner.id = p.owner_id
WHERE p.status = 'pending'
AND NOT EXISTS (
  SELECT 1 FROM notifications n 
  WHERE n.property_id = p.id AND n.type = 'property_review'
);
