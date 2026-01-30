-- Migration: Add image_url column to characters table
-- This fixes the mismatch between the frontend (which uses image_url) 
-- and the database schema (which only had avatar_color)

-- Add image_url column (nullable, since it's optional)
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Optional: Add a comment to document the column
COMMENT ON COLUMN characters.image_url IS 'Optional URL to character image/avatar';
