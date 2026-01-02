import express from 'express';
import { pool } from '../config/database.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Middleware to check if user is Blossom Alabor (moderator)
const isModerator = (req, res, next) => {
  // Check if user email matches moderator email
  if (req.user.email !== 'blossomalabor132@gmail.com') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Moderators only.'
    });
  }

  next();
};

// @route   GET /api/moderation/flagged-content
// @desc    Get all flagged content reports
// @access  Moderator only
router.get('/flagged-content', protect, isModerator, async (req, res) => {
  try {
    // Note: ContentViolationReport currently uses localStorage
    // This endpoint returns empty for now - reports stored client-side
    // In future, create a content_violation_reports table
    res.json({ success: true, data: [] });
  } catch (error) {
    console.error('Get flagged content error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   DELETE /api/moderation/message/:messageId
// @desc    Delete a message (moderator action)
// @access  Moderator only
router.delete('/message/:messageId', protect, isModerator, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { reason } = req.body;

    await pool.query(
      'UPDATE messages SET is_deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = $1',
      [messageId]
    );

    // Log moderation action
    await pool.query(
      `INSERT INTO moderation_actions (moderator_id, action_type, target_type, target_id, reason)
       VALUES ($1, 'delete_message', 'message', $2, $3)`,
      [req.user.id, messageId, reason || 'Violates community guidelines']
    );

    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   DELETE /api/moderation/post/:postId
// @desc    Delete a post (moderator action)
// @access  Moderator only
router.delete('/post/:postId', protect, isModerator, async (req, res) => {
  try {
    const { postId } = req.params;
    const { reason } = req.body;

    await pool.query(
      'UPDATE room_posts SET is_deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = $1',
      [postId]
    );

    // Log action
    await pool.query(
      `INSERT INTO moderation_actions (moderator_id, action_type, target_type, target_id, reason)
       VALUES ($1, 'delete_post', 'post', $2, $3)`,
      [req.user.id, postId, reason || 'Violates community guidelines']
    );

    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   DELETE /api/moderation/comment/:commentId
// @desc    Delete a comment (moderator action)
// @access  Moderator only
router.delete('/comment/:commentId', protect, isModerator, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { reason } = req.body;

    await pool.query(
      'UPDATE post_comments SET is_deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = $1',
      [commentId]
    );

    // Log action
    await pool.query(
      `INSERT INTO moderation_actions (moderator_id, action_type, target_type, target_id, reason)
       VALUES ($1, 'delete_comment', 'comment', $2, $3)`,
      [req.user.id, commentId, reason || 'Violates community guidelines']
    );

    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   POST /api/moderation/kick-user
// @desc    Kick user from room
// @access  Moderator only
router.post('/kick-user', protect, isModerator, async (req, res) => {
  try {
    const { userId, roomId, reason } = req.body;

    await pool.query(
      'UPDATE support_room_members SET left_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND room_id = $2',
      [userId, roomId]
    );

    // Log action
    await pool.query(
      `INSERT INTO moderation_actions (moderator_id, action_type, target_type, target_id, reason)
       VALUES ($1, 'kick_user', 'user', $2, $3)`,
      [req.user.id, userId, reason]
    );

    res.json({ success: true, message: 'User kicked from room' });
  } catch (error) {
    console.error('Kick user error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   POST /api/moderation/suspend-user
// @desc    Suspend user from all support groups
// @access  Moderator only
router.post('/suspend-user', protect, isModerator, async (req, res) => {
  try {
    const { userId, duration, reason } = req.body;

    const suspendedUntil = new Date();
    suspendedUntil.setDate(suspendedUntil.getDate() + parseInt(duration));

    await pool.query(
      `UPDATE users SET
       is_suspended = true,
       suspended_until = $1,
       suspension_reason = $2
       WHERE id = $3`,
      [suspendedUntil, reason, userId]
    );

    // Log action
    await pool.query(
      `INSERT INTO moderation_actions (moderator_id, action_type, target_type, target_id, reason)
       VALUES ($1, 'suspend_user', 'user', $2, $3)`,
      [req.user.id, userId, `${duration} days: ${reason}`]
    );

    res.json({ success: true, message: `User suspended for ${duration} days` });
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   POST /api/moderation/ban-user
// @desc    Permanently ban user from all support groups
// @access  Moderator only
router.post('/ban-user', protect, isModerator, async (req, res) => {
  try {
    const { userId, reason } = req.body;

    await pool.query(
      `UPDATE users SET
       is_banned = true,
       ban_reason = $1
       WHERE id = $2`,
      [reason, userId]
    );

    // Log action
    await pool.query(
      `INSERT INTO moderation_actions (moderator_id, action_type, target_type, target_id, reason)
       VALUES ($1, 'ban_user', 'user', $2, $3)`,
      [req.user.id, userId, reason]
    );

    res.json({ success: true, message: 'User permanently banned' });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   GET /api/moderation/actions
// @desc    Get moderation action log
// @access  Moderator only
router.get('/actions', protect, isModerator, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT ma.*,
              u.username as moderator_username,
              u.full_name as moderator_name
       FROM moderation_actions ma
       JOIN users u ON ma.moderator_id = u.id
       ORDER BY ma.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get moderation actions error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   GET /api/moderation/support-rooms
// @desc    Get all support rooms for moderation
// @access  Moderator only
router.get('/support-rooms', protect, isModerator, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sr.*,
              sg.name as group_name,
              COUNT(DISTINCT srm.user_id) as member_count
       FROM support_rooms sr
       JOIN support_groups sg ON sr.support_group_id = sg.id
       LEFT JOIN support_room_members srm ON sr.id = srm.room_id AND srm.left_at IS NULL
       GROUP BY sr.id, sg.name
       ORDER BY sr.created_at DESC`
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get support rooms error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
