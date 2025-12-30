import express from 'express';
import { pool } from '../config/database.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/moods
// @desc    Get user's mood entries
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { limit = 30, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT * FROM mood_entries
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );

    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get moods error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   POST /api/moods
// @desc    Create mood entry
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { mood, intensity, emotions, activities, notes } = req.body;

    const result = await pool.query(
      `INSERT INTO mood_entries (user_id, mood, intensity, emotions, activities, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.id, mood, intensity, emotions || [], activities || [], notes]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Create mood error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
