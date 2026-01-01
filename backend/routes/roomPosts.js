import express from 'express';
import { pool, transaction } from '../config/database.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ============================================
// @route   GET /api/room-posts/:roomId
// @desc    Get all posts for a room (non-archived)
// @access  Private (must be room member)
// ============================================
router.get('/:roomId', protect, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    // Verify user is a member of this room
    const memberCheck = await pool.query(
      `SELECT id FROM support_room_members
       WHERE room_id = $1 AND user_id = $2 AND left_at IS NULL`,
      [roomId, userId]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'You must be a member of this room to view posts'
      });
    }

    // Get posts with user info and like status
    const posts = await pool.query(
      `SELECT
        rp.*,
        u.username,
        u.avatar_url,
        EXISTS(SELECT 1 FROM post_likes WHERE post_id = rp.id AND user_id = $2) as is_liked,
        EXISTS(SELECT 1 FROM post_favorites WHERE post_id = rp.id AND user_id = $2) as is_favorited
       FROM room_posts rp
       JOIN users u ON rp.user_id = u.id
       WHERE rp.room_id = $1
         AND rp.is_archived = false
         AND rp.is_deleted = false
       ORDER BY rp.created_at DESC`,
      [roomId, userId]
    );

    res.json({
      success: true,
      count: posts.rows.length,
      data: posts.rows
    });

  } catch (error) {
    console.error('Get room posts error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ============================================
// @route   POST /api/room-posts/:roomId
// @desc    Create a new post in a room
// @access  Private (must be room member)
// ============================================
router.post('/:roomId', protect, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Post content is required'
      });
    }

    if (content.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        error: 'Post content must be 2000 characters or less'
      });
    }

    // Verify user is a member of this room
    const memberCheck = await pool.query(
      `SELECT id FROM support_room_members
       WHERE room_id = $1 AND user_id = $2 AND left_at IS NULL`,
      [roomId, userId]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'You must be a member of this room to create posts'
      });
    }

    // Create post
    const result = await pool.query(
      `INSERT INTO room_posts (room_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [roomId, userId, content.trim()]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ============================================
// @route   PUT /api/room-posts/post/:postId
// @desc    Edit a post (own posts only)
// @access  Private
// ============================================
router.put('/post/:postId', protect, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Post content is required'
      });
    }

    if (content.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        error: 'Post content must be 2000 characters or less'
      });
    }

    // Update only if user owns the post
    const result = await pool.query(
      `UPDATE room_posts
       SET content = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3 AND is_deleted = false
       RETURNING *`,
      [content.trim(), postId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Post not found or you do not have permission to edit it'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Edit post error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ============================================
// @route   DELETE /api/room-posts/post/:postId
// @desc    Delete a post (soft delete, own posts only)
// @access  Private
// ============================================
router.delete('/post/:postId', protect, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `UPDATE room_posts
       SET is_deleted = true, deleted_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2 AND is_deleted = false
       RETURNING id`,
      [postId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Post not found or already deleted'
      });
    }

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ============================================
// @route   POST /api/room-posts/post/:postId/archive
// @desc    Archive/unarchive a post (own posts only)
// @access  Private
// ============================================
router.post('/post/:postId/archive', protect, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Toggle archive status
    const result = await pool.query(
      `UPDATE room_posts
       SET is_archived = NOT is_archived,
           archived_at = CASE WHEN is_archived = false THEN CURRENT_TIMESTAMP ELSE NULL END
       WHERE id = $1 AND user_id = $2 AND is_deleted = false
       RETURNING *`,
      [postId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: result.rows[0].is_archived ? 'Post archived' : 'Post unarchived'
    });

  } catch (error) {
    console.error('Archive post error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ============================================
// @route   GET /api/room-posts/archived/all
// @desc    Get user's archived posts
// @access  Private
// ============================================
router.get('/archived/all', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const posts = await pool.query(
      `SELECT
        rp.*,
        sr.stage,
        sr.room_number,
        sg.name as group_name
       FROM room_posts rp
       JOIN support_rooms sr ON rp.room_id = sr.id
       JOIN support_groups sg ON sr.support_group_id = sg.id
       WHERE rp.user_id = $1
         AND rp.is_archived = true
         AND rp.is_deleted = false
       ORDER BY rp.archived_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      count: posts.rows.length,
      data: posts.rows
    });

  } catch (error) {
    console.error('Get archived posts error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ============================================
// @route   POST /api/room-posts/post/:postId/like
// @desc    Toggle like on a post
// @access  Private (must be room member)
// ============================================
router.post('/post/:postId/like', protect, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    await transaction(async (client) => {
      // Check if already liked
      const existingLike = await client.query(
        `SELECT id FROM post_likes WHERE post_id = $1 AND user_id = $2`,
        [postId, userId]
      );

      if (existingLike.rows.length > 0) {
        // Unlike
        await client.query(
          `DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2`,
          [postId, userId]
        );
        await client.query(
          `UPDATE room_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = $1`,
          [postId]
        );
      } else {
        // Like
        await client.query(
          `INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)`,
          [postId, userId]
        );
        await client.query(
          `UPDATE room_posts SET likes_count = likes_count + 1 WHERE id = $1`,
          [postId]
        );
      }
    });

    res.json({
      success: true,
      message: 'Like toggled'
    });

  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ============================================
// @route   POST /api/room-posts/post/:postId/favorite
// @desc    Toggle favorite on a post
// @access  Private
// ============================================
router.post('/post/:postId/favorite', protect, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const existingFav = await pool.query(
      `SELECT id FROM post_favorites WHERE post_id = $1 AND user_id = $2`,
      [postId, userId]
    );

    if (existingFav.rows.length > 0) {
      // Unfavorite
      await pool.query(
        `DELETE FROM post_favorites WHERE post_id = $1 AND user_id = $2`,
        [postId, userId]
      );
      return res.json({ success: true, favorited: false });
    } else {
      // Favorite
      await pool.query(
        `INSERT INTO post_favorites (post_id, user_id) VALUES ($1, $2)`,
        [postId, userId]
      );
      return res.json({ success: true, favorited: true });
    }

  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ============================================
// COMMENTS ROUTES
// ============================================

// @route   GET /api/room-posts/post/:postId/comments
// @desc    Get comments for a post
// @access  Private (must be room member)
router.get('/post/:postId/comments', protect, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const comments = await pool.query(
      `SELECT
        pc.*,
        u.username,
        u.avatar_url,
        EXISTS(SELECT 1 FROM comment_likes WHERE comment_id = pc.id AND user_id = $2) as is_liked
       FROM post_comments pc
       JOIN users u ON pc.user_id = u.id
       WHERE pc.post_id = $1 AND pc.is_deleted = false
       ORDER BY pc.created_at ASC`,
      [postId, userId]
    );

    res.json({
      success: true,
      count: comments.rows.length,
      data: comments.rows
    });

  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   POST /api/room-posts/post/:postId/comments
// @desc    Add a comment to a post
// @access  Private (must be room member)
router.post('/post/:postId/comments', protect, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Comment content is required'
      });
    }

    if (content.trim().length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Comment must be 500 characters or less'
      });
    }

    await transaction(async (client) => {
      // Create comment
      const comment = await client.query(
        `INSERT INTO post_comments (post_id, user_id, content)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [postId, userId, content.trim()]
      );

      // Increment comment count on post
      await client.query(
        `UPDATE room_posts SET comments_count = comments_count + 1 WHERE id = $1`,
        [postId]
      );

      res.status(201).json({
        success: true,
        data: comment.rows[0]
      });
    });

  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   POST /api/room-posts/comment/:commentId/like
// @desc    Toggle like on a comment
// @access  Private
router.post('/comment/:commentId/like', protect, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    await transaction(async (client) => {
      const existingLike = await client.query(
        `SELECT id FROM comment_likes WHERE comment_id = $1 AND user_id = $2`,
        [commentId, userId]
      );

      if (existingLike.rows.length > 0) {
        // Unlike
        await client.query(
          `DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2`,
          [commentId, userId]
        );
        await client.query(
          `UPDATE post_comments SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = $1`,
          [commentId]
        );
      } else {
        // Like
        await client.query(
          `INSERT INTO comment_likes (comment_id, user_id) VALUES ($1, $2)`,
          [commentId, userId]
        );
        await client.query(
          `UPDATE post_comments SET likes_count = likes_count + 1 WHERE id = $1`,
          [commentId]
        );
      }
    });

    res.json({
      success: true,
      message: 'Comment like toggled'
    });

  } catch (error) {
    console.error('Toggle comment like error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
