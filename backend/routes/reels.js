import express from 'express';
import { pool } from '../config/database.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/reels
// @desc    Get all reels
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT r.*, u.username, u.avatar_url
       FROM reels r
       JOIN users u ON r.user_id = u.id
       WHERE r.is_published = true
       ORDER BY r.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get reels error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   POST /api/reels
// @desc    Create a reel
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, duration } = req.body;

    const result = await pool.query(
      `INSERT INTO reels (user_id, title, description, video_url, thumbnail_url, duration)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.id, title, description, videoUrl, thumbnailUrl, duration]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Create reel error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
