-- ============================================
-- SUPPORT GROUP POSTS SYSTEM MIGRATION
-- Adds support for posts, comments, likes, and 30-day stage locks
-- ============================================

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

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX idx_stage_selections_user_group ON stage_selections(user_id, support_group_id);
CREATE INDEX idx_stage_selections_locked_until ON stage_selections(locked_until);
CREATE INDEX idx_room_posts_room ON room_posts(room_id) WHERE is_deleted = false AND is_archived = false;
CREATE INDEX idx_room_posts_user ON room_posts(user_id);
CREATE INDEX idx_room_posts_archived ON room_posts(user_id, is_archived) WHERE is_deleted = false;
CREATE INDEX idx_post_likes_post ON post_likes(post_id);
CREATE INDEX idx_post_likes_user ON post_likes(user_id);
CREATE INDEX idx_post_comments_post ON post_comments(post_id) WHERE is_deleted = false;
CREATE INDEX idx_post_comments_user ON post_comments(user_id);
CREATE INDEX idx_comment_likes_comment ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user ON comment_likes(user_id);
CREATE INDEX idx_post_favorites_user ON post_favorites(user_id);
CREATE INDEX idx_post_favorites_post ON post_favorites(post_id);

-- ============================================
-- TRIGGERS for updated_at
-- ============================================
CREATE TRIGGER update_room_posts_updated_at BEFORE UPDATE ON room_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_comments_updated_at BEFORE UPDATE ON post_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TRIGGER to auto-set locked_until on stage selection
-- ============================================
CREATE OR REPLACE FUNCTION set_stage_lock_period()
RETURNS TRIGGER AS $$
BEGIN
    NEW.locked_until = NEW.selected_at + INTERVAL '30 days';
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_locked_until BEFORE INSERT ON stage_selections
    FOR EACH ROW EXECUTE FUNCTION set_stage_lock_period();
