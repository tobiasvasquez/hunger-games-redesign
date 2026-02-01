-- Add gender column to characters table

ALTER TABLE characters ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female'));

-- Update existing characters to have a default gender (random)
UPDATE characters SET gender = CASE WHEN random() > 0.5 THEN 'male' ELSE 'female' END WHERE gender IS NULL;

-- Make gender column NOT NULL after setting defaults
ALTER TABLE characters ALTER COLUMN gender SET NOT NULL;