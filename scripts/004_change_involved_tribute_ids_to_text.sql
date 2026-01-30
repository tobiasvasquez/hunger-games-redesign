-- Migration: Change involved_tribute_ids from UUID[] to TEXT[]
-- The tribute IDs generated client-side are not real UUIDs, so we need to store them as text

-- First, we need to handle existing data if any
-- Option 1: If there's no important data, we can drop and recreate
-- Option 2: If there's data, we need to convert it

-- For now, let's drop the column and recreate it (safe if table is empty or you don't mind losing the IDs)
ALTER TABLE game_events 
DROP COLUMN IF EXISTS involved_tribute_ids;

-- Add it back as TEXT[]
ALTER TABLE game_events 
ADD COLUMN involved_tribute_ids TEXT[] DEFAULT '{}';

-- Add a comment
COMMENT ON COLUMN game_events.involved_tribute_ids IS 'Array of tribute IDs (client-generated strings, not database UUIDs)';
