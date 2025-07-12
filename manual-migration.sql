-- Manual Database Migration Script
-- This script will be executed directly on the Neon database

-- First, let's check current schema
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties';

-- Add review fields to properties table if they don't exist
DO $$
BEGIN
    -- Add reviewed_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'properties' AND column_name = 'reviewed_at') THEN
        ALTER TABLE properties ADD COLUMN reviewed_at TIMESTAMP;
    END IF;
    
    -- Add reviewed_by column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'properties' AND column_name = 'reviewed_by') THEN
        ALTER TABLE properties ADD COLUMN reviewed_by INTEGER REFERENCES users(id);
    END IF;
    
    -- Add rejection_reason column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'properties' AND column_name = 'rejection_reason') THEN
        ALTER TABLE properties ADD COLUMN rejection_reason TEXT;
    END IF;
END $$;

-- Create notifications table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
                   WHERE table_name = 'notifications') THEN
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
    END IF;
END $$;

-- Create additional indexes for properties table
DO $$
BEGIN
    -- Index for properties status
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_properties_status') THEN
        CREATE INDEX idx_properties_status ON properties(status);
    END IF;
    
    -- Index for properties owner_id
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_properties_owner_id') THEN
        CREATE INDEX idx_properties_owner_id ON properties(owner_id);
    END IF;
    
    -- Index for properties reviewed_by
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_properties_reviewed_by') THEN
        CREATE INDEX idx_properties_reviewed_by ON properties(reviewed_by);
    END IF;
END $$;

-- Verify the changes
SELECT 'Properties table structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'properties'
ORDER BY ordinal_position;

SELECT 'Notifications table exists:' as info;
SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'notifications'
) as table_exists;
