import express from 'express';
import { pool } from '../config/database.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/meditations
// @desc    Get all meditations
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category } = req.query;

    let query = 'SELECT * FROM meditations';
    let params = [];

    if (category) {
      query += ' WHERE category = $1';
      params = [category];
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get meditations error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
