-- Add new fields to journal_entries table
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS prompt TEXT;
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS mood_rating INTEGER DEFAULT 5;
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS pages JSONB;
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false;

-- Create index for favorites
CREATE INDEX IF NOT EXISTS idx_journal_entries_favorite ON journal_entries(user_id, is_favorite) WHERE is_favorite = true;
