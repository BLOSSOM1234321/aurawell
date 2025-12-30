import express from 'express';
import { pool } from '../config/database.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/journals
// @desc    Get user's journal entries
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM journal_entries
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get journals error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   POST /api/journals
// @desc    Create journal entry
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, background, stickers, isPrivate = true } = req.body;

    const result = await pool.query(
      `INSERT INTO journal_entries (user_id, title, content, background, stickers, is_private)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.id, title, content, background, stickers ? JSON.stringify(stickers) : null, isPrivate]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Create journal error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
