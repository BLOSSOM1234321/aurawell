import express from 'express';
import { pool } from '../config/database.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/messages/:roomId
// @desc    Get messages for a room
// @access  Private
router.get('/:roomId', protect, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT m.id, m.room_id as "roomId", m.user_id as "userId",
              m.content as text, m.created_at as "createdAt", m.updated_at as "updatedAt",
              u.username, u.avatar_url, u.full_name as name
       FROM messages m
       JOIN users u ON m.user_id = u.id
       WHERE m.room_id = $1 AND m.is_deleted = false
       ORDER BY m.created_at DESC
       LIMIT $2 OFFSET $3`,
      [roomId, limit, offset]
    );

    res.json({ success: true, count: result.rows.length, data: result.rows.reverse() });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { roomId, content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Message content is required' });
    }

    const result = await pool.query(
      `INSERT INTO messages (room_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, room_id as "roomId", user_id as "userId",
                 content as text, created_at as "createdAt"`,
      [roomId, req.user.id, content.trim()]
    );

    // Add user info to response
    const message = {
      ...result.rows[0],
      user: {
        id: req.user.id,
        name: req.user.full_name,
        username: req.user.username
      }
    };

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
