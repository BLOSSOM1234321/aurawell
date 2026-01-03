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
    const {
      title,
      content,
      background,
      stickers,
      isPrivate = true,
      prompt,
      mood_rating = 5,
      tags = [],
      pages = [],
      is_favorite = false
    } = req.body;

    const result = await pool.query(
      `INSERT INTO journal_entries (
        user_id, title, content, background, stickers, is_private,
        prompt, mood_rating, tags, pages, is_favorite
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        req.user.id,
        title,
        content,
        background,
        stickers ? JSON.stringify(stickers) : null,
        isPrivate,
        prompt,
        mood_rating,
        tags,
        pages ? JSON.stringify(pages) : null,
        is_favorite
      ]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Create journal error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   PUT /api/journals/:id
// @desc    Update journal entry
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      background,
      stickers,
      isPrivate,
      prompt,
      mood_rating,
      tags,
      pages,
      is_favorite
    } = req.body;

    const result = await pool.query(
      `UPDATE journal_entries
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           background = COALESCE($3, background),
           stickers = COALESCE($4, stickers),
           is_private = COALESCE($5, is_private),
           prompt = COALESCE($6, prompt),
           mood_rating = COALESCE($7, mood_rating),
           tags = COALESCE($8, tags),
           pages = COALESCE($9, pages),
           is_favorite = COALESCE($10, is_favorite),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $11 AND user_id = $12
       RETURNING *`,
      [
        title,
        content,
        background,
        stickers ? JSON.stringify(stickers) : null,
        isPrivate,
        prompt,
        mood_rating,
        tags,
        pages ? JSON.stringify(pages) : null,
        is_favorite,
        id,
        req.user.id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Journal entry not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update journal error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   DELETE /api/journals/:id
// @desc    Delete journal entry
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM journal_entries WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Journal entry not found' });
    }

    res.json({ success: true, message: 'Journal entry deleted' });
  } catch (error) {
    console.error('Delete journal error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
