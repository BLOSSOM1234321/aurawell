-- AuraWell Database Schema
-- PostgreSQL

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  user_type VARCHAR(50) DEFAULT 'regular', -- 'regular', 'therapist', 'moderator', 'admin'
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'suspended', 'banned'
  suspended_until TIMESTAMP,
  avatar_url TEXT,
  bio TEXT,
  mood_tracking_enabled BOOLEAN DEFAULT true,
  crisis_detection_enabled BOOLEAN DEFAULT true,
  gentle_guardian_enabled BOOLEAN DEFAULT false,
  current_streak INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  archetype VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- ============================================
-- SUPPORT GROUPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS support_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- 'anxiety', 'depression', 'trauma', etc.
  group_type VARCHAR(50) DEFAULT 'support', -- 'support' or 'community'
  icon VARCHAR(50),
  color VARCHAR(50),
  member_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SUPPORT ROOMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS support_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  support_group_id UUID NOT NULL REFERENCES support_groups(id) ON DELETE CASCADE,
  stage VARCHAR(50) NOT NULL, -- 'beginner', 'intermediate', 'advanced'
  room_number INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'full', 'archived'
  member_count INTEGER DEFAULT 0,
  max_members INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(support_group_id, stage, room_number)
);

-- ============================================
-- SUPPORT ROOM MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS support_room_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES support_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_in_room VARCHAR(50) DEFAULT 'member', -- 'member', 'moderator'
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP,
  UNIQUE(room_id, user_id, left_at)
);

-- ============================================
-- MESSAGES TABLE (for support rooms)
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES support_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_flagged BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  crisis_level VARCHAR(50), -- 'low', 'medium', 'high', 'critical'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MOOD ENTRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood VARCHAR(50) NOT NULL, -- 'happy', 'sad', 'anxious', 'calm', etc.
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  emotions TEXT[], -- Array of emotions
  activities TEXT[], -- Array of activities
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- JOURNAL ENTRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  content TEXT NOT NULL,
  background VARCHAR(100),
  stickers JSONB,
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- THERAPIST PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS therapist_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  license_number VARCHAR(255),
  specializations TEXT[],
  credentials TEXT[],
  bio TEXT,
  hourly_rate DECIMAL(10, 2),
  is_verified BOOLEAN DEFAULT false,
  is_accepting_clients BOOLEAN DEFAULT true,
  years_experience INTEGER,
  verification_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- REELS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER, -- in seconds
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MEDITATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS meditations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  duration INTEGER, -- in seconds
  category VARCHAR(100), -- 'sleep', 'anxiety', 'focus', etc.
  instructor VARCHAR(255),
  thumbnail_url TEXT,
  plays_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  points INTEGER DEFAULT 0,
  requirement_type VARCHAR(100), -- 'streak', 'mood_entries', 'journal_entries', etc.
  requirement_value INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- USER ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_id)
);

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_support_rooms_group_stage ON support_rooms(support_group_id, stage);
CREATE INDEX idx_support_room_members_user ON support_room_members(user_id);
CREATE INDEX idx_support_room_members_room ON support_room_members(room_id);
CREATE INDEX idx_messages_room ON messages(room_id);
CREATE INDEX idx_messages_user ON messages(user_id);
CREATE INDEX idx_mood_entries_user ON mood_entries(user_id);
CREATE INDEX idx_journal_entries_user ON journal_entries(user_id);
CREATE INDEX idx_reels_user ON reels(user_id);

-- ============================================
-- TRIGGERS for updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_groups_updated_at BEFORE UPDATE ON support_groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_rooms_updated_at BEFORE UPDATE ON support_rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_therapist_profiles_updated_at BEFORE UPDATE ON therapist_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reels_updated_at BEFORE UPDATE ON reels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STAGE SELECTIONS TABLE (30-day lock tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS stage_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  support_group_id UUID NOT NULL REFERENCES support_groups(id) ON DELETE CASCADE,
  stage VARCHAR(50) NOT NULL, -- 'beginner', 'intermediate', 'advanced'
  selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  locked_until TIMESTAMP NOT NULL, -- selected_at + 30 days
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Only one active selection per user per group
CREATE UNIQUE INDEX idx_stage_selections_user_group_active
  ON stage_selections(user_id, support_group_id)
  WHERE is_active = true;

CREATE INDEX idx_stage_selections_user_group ON stage_selections(user_id, support_group_id);
CREATE INDEX idx_stage_selections_locked_until ON stage_selections(locked_until);

-- ============================================
-- ROOM POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS room_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES support_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_archived BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  archived_at TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_room_posts_room ON room_posts(room_id) WHERE is_deleted = false AND is_archived = false;
CREATE INDEX idx_room_posts_user ON room_posts(user_id);
CREATE INDEX idx_room_posts_archived ON room_posts(user_id, is_archived) WHERE is_deleted = false;

-- ============================================
-- POST LIKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES room_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id) -- User can only like a post once
);

CREATE INDEX idx_post_likes_post ON post_likes(post_id);
CREATE INDEX idx_post_likes_user ON post_likes(user_id);

-- ============================================
-- POST COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES room_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_post_comments_post ON post_comments(post_id) WHERE is_deleted = false;
CREATE INDEX idx_post_comments_user ON post_comments(user_id);

-- ============================================
-- COMMENT LIKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES post_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(comment_id, user_id) -- User can only like a comment once
);

CREATE INDEX idx_comment_likes_comment ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user ON comment_likes(user_id);

-- ============================================
-- POST FAVORITES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS post_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES room_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id) -- User can only favorite a post once
);

CREATE INDEX idx_post_favorites_user ON post_favorites(user_id);
CREATE INDEX idx_post_favorites_post ON post_favorites(post_id);

-- ============================================
-- TRIGGERS for Posts System
-- ============================================
CREATE TRIGGER update_room_posts_updated_at BEFORE UPDATE ON room_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_comments_updated_at BEFORE UPDATE ON post_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-set locked_until on stage selection
CREATE OR REPLACE FUNCTION set_stage_lock_period()
RETURNS TRIGGER AS $$
BEGIN
    NEW.locked_until = NEW.selected_at + INTERVAL '30 days';
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_locked_until BEFORE INSERT ON stage_selections
    FOR EACH ROW EXECUTE FUNCTION set_stage_lock_period();
