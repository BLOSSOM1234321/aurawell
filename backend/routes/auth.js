import express from 'express';
import bcrypt from 'bcryptjs';
import { body } from 'express-validator';
import { pool } from '../config/database.js';
import { generateToken, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// ============================================
// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
// ============================================
router.post(
  '/signup',
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('fullName').optional().trim()
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password, username, fullName, userType = 'regular' } = req.body;

      // Check if user already exists
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'User with this email or username already exists'
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, username, full_name, user_type)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, username, full_name, user_type, created_at`,
        [email, passwordHash, username, fullName || username, userType]
      );

      const user = result.rows[0];

      // Generate token
      const token = generateToken(user.id);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.full_name,
          userType: user.user_type
        }
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error during signup'
      });
    }
  }
);

// ============================================
// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
// ============================================
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      const user = result.rows[0];

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check if banned
      if (user.status === 'banned') {
        return res.status(403).json({
          success: false,
          error: 'Your account has been banned'
        });
      }

      // Update last login
      await pool.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      // Generate token
      const token = generateToken(user.id);

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.full_name,
          userType: user.user_type,
          avatarUrl: user.avatar_url,
          status: user.status
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error during login'
      });
    }
  }
);

// ============================================
// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
// ============================================
router.get('/me', protect, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, username, full_name, user_type, avatar_url, bio,
              mood_tracking_enabled, crisis_detection_enabled, gentle_guardian_enabled,
              current_streak, total_points, archetype, status, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// ============================================
// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Public
// ============================================
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export default router;
