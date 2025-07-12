-- Property Approval System Migration
-- Add missing columns to properties table for complete approval workflow

-- Add new columns to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS host_id INTEGER REFERENCES users(id),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS rules TEXT,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Update existing properties to have host_id same as owner_id if not set
UPDATE properties 
SET host_id = owner_id 
WHERE host_id IS NULL AND owner_id IS NOT NULL;

-- Create indexes for faster home page queries
CREATE INDEX IF NOT EXISTS idx_properties_active_visible 
ON properties(is_active, is_visible, approved_at DESC);

-- Create index for host properties
CREATE INDEX IF NOT EXISTS idx_properties_host_id 
ON properties(host_id, created_at DESC);

-- Create index for property status queries
CREATE INDEX IF NOT EXISTS idx_properties_status 
ON properties(status, created_at DESC);

-- Update existing approved properties to be visible
UPDATE properties 
SET is_active = true, 
    is_visible = true, 
    approved_at = COALESCE(reviewed_at, created_at)
WHERE status = 'approved';

-- Ensure rejected properties are not visible
UPDATE properties 
SET is_active = false, 
    is_visible = false
WHERE status = 'rejected';

-- Ensure pending properties are not visible
UPDATE properties 
SET is_active = false, 
    is_visible = false
WHERE status = 'pending';
