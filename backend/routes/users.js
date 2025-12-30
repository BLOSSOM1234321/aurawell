import express from 'express';
import { pool } from '../config/database.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/profile/:id
// @desc    Get user profile
// @access  Private
router.get('/profile/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, username, full_name, avatar_url, bio, user_type, current_streak, total_points, archetype, created_at
       FROM users WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update own profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { fullName, bio, avatarUrl, moodTrackingEnabled, crisisDetectionEnabled, gentleGuardianEnabled, archetype } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET full_name = COALESCE($1, full_name),
           bio = COALESCE($2, bio),
           avatar_url = COALESCE($3, avatar_url),
           mood_tracking_enabled = COALESCE($4, mood_tracking_enabled),
           crisis_detection_enabled = COALESCE($5, crisis_detection_enabled),
           gentle_guardian_enabled = COALESCE($6, gentle_guardian_enabled),
           archetype = COALESCE($7, archetype)
       WHERE id = $8
       RETURNING id, username, full_name, avatar_url, bio, mood_tracking_enabled, crisis_detection_enabled, gentle_guardian_enabled, archetype`,
      [fullName, bio, avatarUrl, moodTrackingEnabled, crisisDetectionEnabled, gentleGuardianEnabled, archetype, req.user.id]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
