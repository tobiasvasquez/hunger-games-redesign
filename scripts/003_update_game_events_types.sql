-- Migration: Update game_events type constraint to include new event types
-- This adds support for betrayal, theft, and exploration event types

-- First, drop the existing constraint
ALTER TABLE game_events 
DROP CONSTRAINT IF EXISTS game_events_type_check;

-- Add the new constraint with all event types
ALTER TABLE game_events 
ADD CONSTRAINT game_events_type_check 
CHECK (type IN (
  'kill', 
  'sponsor', 
  'shelter', 
  'injury', 
  'alliance', 
  'trap', 
  'escape', 
  'neutral',
  'betrayal',
  'theft',
  'exploration'
));
