import express from 'express';
import { pool, transaction } from '../config/database.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const MAX_MEMBERS = parseInt(process.env.MAX_ROOM_MEMBERS) || 10;
const MAX_RETRIES = 5;

// ============================================
// @route   POST /api/support-rooms/join
// @desc    Join a stage room (with atomic operations)
// @access  Private
// ============================================
router.post('/join', protect, async (req, res) => {
  try {
    const { supportGroupId, stage } = req.body;
    const userId = req.user.id;

    if (!supportGroupId || !stage) {
      return res.status(400).json({
        success: false,
        error: 'Support group ID and stage are required'
      });
    }

    // Validate stage
    if (!['beginner', 'intermediate', 'advanced'].includes(stage)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid stage. Must be beginner, intermediate, or advanced'
      });
    }

    // Check if user already in a room for this group+stage
    const existingMembership = await pool.query(
      `SELECT srm.*, sr.* FROM support_room_members srm
       JOIN support_rooms sr ON srm.room_id = sr.id
       WHERE srm.user_id = $1
         AND sr.support_group_id = $2
         AND sr.stage = $3
         AND srm.left_at IS NULL
         AND sr.status != 'archived'`,
      [userId, supportGroupId, stage]
    );

    if (existingMembership.rows.length > 0) {
      return res.json({
        success: true,
        alreadyMember: true,
        room: existingMembership.rows[0]
      });
    }

    // Try to join with retries
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const result = await transaction(async (client) => {
          // Find open room with row-level lock
          const openRoom = await client.query(
            `SELECT * FROM support_rooms
             WHERE support_group_id = $1
               AND stage = $2
               AND status = 'open'
               AND member_count < $3
             ORDER BY room_number ASC
             LIMIT 1
             FOR UPDATE`,
            [supportGroupId, stage, MAX_MEMBERS]
          );

          let targetRoom;

          if (openRoom.rows.length === 0) {
            // Create new room
            const highestRoom = await client.query(
              `SELECT COALESCE(MAX(room_number), 0) as max_number
               FROM support_rooms
               WHERE support_group_id = $1 AND stage = $2`,
              [supportGroupId, stage]
            );

            const nextRoomNumber = highestRoom.rows[0].max_number + 1;

            const newRoom = await client.query(
              `INSERT INTO support_rooms (support_group_id, stage, room_number, status, member_count, max_members)
               VALUES ($1, $2, $3, 'open', 0, $4)
               RETURNING *`,
              [supportGroupId, stage, nextRoomNumber, MAX_MEMBERS]
            );

            targetRoom = newRoom.rows[0];
          } else {
            targetRoom = openRoom.rows[0];
          }

          // Add member
          await client.query(
            `INSERT INTO support_room_members (room_id, user_id, role_in_room, joined_at)
             VALUES ($1, $2, 'member', CURRENT_TIMESTAMP)`,
            [targetRoom.id, userId]
          );

          // Update room member count
          const updatedRoom = await client.query(
            `UPDATE support_rooms
             SET member_count = member_count + 1,
                 status = CASE WHEN member_count + 1 >= max_members THEN 'full' ELSE 'open' END
             WHERE id = $1
             RETURNING *`,
            [targetRoom.id]
          );

          return updatedRoom.rows[0];
        });

        return res.json({
          success: true,
          newlyJoined: true,
          room: result
        });

      } catch (error) {
        if (attempt === MAX_RETRIES - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, attempt)));
      }
    }

  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to join room. Please try again.'
    });
  }
});

// ============================================
// @route   POST /api/support-rooms/:roomId/leave
// @desc    Leave a support room
// @access  Private
// ============================================
router.post('/:roomId/leave', protect, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    await transaction(async (client) => {
      // Mark membership as left
      await client.query(
        `UPDATE support_room_members
         SET left_at = CURRENT_TIMESTAMP
         WHERE room_id = $1 AND user_id = $2 AND left_at IS NULL`,
        [roomId, userId]
      );

      // Decrement member count
      await client.query(
        `UPDATE support_rooms
         SET member_count = GREATEST(member_count - 1, 0),
             status = 'open'
         WHERE id = $1`,
        [roomId]
      );
    });

    res.json({
      success: true,
      message: 'Left room successfully'
    });

  } catch (error) {
    console.error('Leave room error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to leave room'
    });
  }
});

// ============================================
// @route   GET /api/support-rooms/my-rooms
// @desc    Get user's active rooms
// @access  Private
// ============================================
router.get('/my-rooms', protect, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sr.*, sg.name as group_name, sg.icon, sg.color
       FROM support_room_members srm
       JOIN support_rooms sr ON srm.room_id = sr.id
       JOIN support_groups sg ON sr.support_group_id = sg.id
       WHERE srm.user_id = $1 AND srm.left_at IS NULL
       ORDER BY srm.joined_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error('Get my rooms error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// ============================================
// @route   GET /api/support-rooms/:roomId/members
// @desc    Get room members
// @access  Private
// ============================================
router.get('/:roomId/members', protect, async (req, res) => {
  try {
    const { roomId } = req.params;

    const result = await pool.query(
      `SELECT u.id, u.username, u.avatar_url, srm.role_in_room, srm.joined_at
       FROM support_room_members srm
       JOIN users u ON srm.user_id = u.id
       WHERE srm.room_id = $1 AND srm.left_at IS NULL
       ORDER BY srm.joined_at ASC`,
      [roomId]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error('Get room members error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;
