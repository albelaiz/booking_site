-- Migration: Property Approval System
-- This migration ensures the property approval workflow is properly set up

-- Update the properties table to ensure status column has correct default and constraint
ALTER TABLE properties 
  ALTER COLUMN status SET DEFAULT 'pending';

-- Add check constraint to ensure only valid status values
ALTER TABLE properties 
  ADD CONSTRAINT properties_status_check 
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- Ensure ownerId column exists and is properly referenced
ALTER TABLE properties 
  ALTER COLUMN owner_id SET NOT NULL;

-- Update any existing properties without status to be pending
UPDATE properties 
SET status = 'pending' 
WHERE status IS NULL OR status = '';

-- Create index for faster queries on status and owner
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_owner_status ON properties(owner_id, status);

-- Add some comments for documentation
COMMENT ON COLUMN properties.status IS 'Property approval status: pending (awaiting admin review), approved (visible to public), rejected (hidden from public)';
COMMENT ON COLUMN properties.owner_id IS 'References users.id - the property owner/host';
