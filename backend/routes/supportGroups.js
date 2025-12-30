import express from 'express';
import { pool } from '../config/database.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// ============================================
// @route   GET /api/support-groups
// @desc    Get all support groups
// @access  Public
// ============================================
router.get('/', optionalAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description, category, icon, color, member_count, is_active, created_at
       FROM support_groups
       WHERE is_active = true
       ORDER BY name ASC`
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Get support groups error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// ============================================
// @route   GET /api/support-groups/:id
// @desc    Get single support group
// @access  Public
// ============================================
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, name, description, category, icon, color, member_count, is_active, created_at
       FROM support_groups
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Support group not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get support group error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// ============================================
// @route   GET /api/support-groups/:id/stats
// @desc    Get support group statistics
// @access  Private
// ============================================
router.get('/:id/stats', protect, async (req, res) => {
  try {
    const { id } = req.params;

    // Get room counts by stage
    const roomStats = await pool.query(
      `SELECT stage, COUNT(*) as room_count, SUM(member_count) as total_members
       FROM support_rooms
       WHERE support_group_id = $1 AND status != 'archived'
       GROUP BY stage`,
      [id]
    );

    res.json({
      success: true,
      data: {
        roomsByStage: roomStats.rows
      }
    });
  } catch (error) {
    console.error('Get group stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;
