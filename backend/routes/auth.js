import express from 'express';
import bcrypt from 'bcryptjs';
import { body } from 'express-validator';
import { pool } from '../config/database.js';
import { generateToken, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(email, otp) {
  await resend.emails.send({
    from: 'AuraWell <support@serenmynd.com>',
    to: email,
    subject: 'Verify your AuraWell account',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fdf2f8;border-radius:16px;">
        <h2 style="color:#7c3aed;margin-bottom:8px;">Welcome to AuraWell 🌸</h2>
        <p style="color:#374151;">Your verification code is:</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#ec4899;text-align:center;padding:24px;background:#fff;border-radius:12px;margin:16px 0;">
          ${otp}
        </div>
        <p style="color:#6b7280;font-size:14px;">This code expires in 15 minutes. If you didn't sign up, ignore this email.</p>
      </div>
    `
  });
}

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

      const otp = generateOTP();
      const otpHash = await bcrypt.hash(otp, 10);
      const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

      // Create user
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, username, full_name, user_type, verification_otp, verification_otp_expiry, email_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, false)
         RETURNING id, email, username, full_name, user_type, created_at`,
        [email, passwordHash, username, fullName || username, userType, otpHash, otpExpiry]
      );

      const user = result.rows[0];

      // Send verification email
      try {
        await sendVerificationEmail(email, otp);
      } catch (emailErr) {
        console.error('Email send error:', emailErr);
      }

      res.status(201).json({
        success: true,
        requiresVerification: true,
        email: user.email,
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
// @route   POST /api/auth/verify-email
// @desc    Verify email with OTP code
// @access  Public
// ============================================
router.post('/verify-email', async (req, res) => {
  try {
    const { token, email } = req.body;
    if (!token || !email) {
      return res.status(400).json({ success: false, error: 'Email and code are required' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = result.rows[0];

    if (user.email_verified) {
      const authToken = generateToken(user.id);
      return res.json({ success: true, token: authToken, user: { id: user.id, email: user.email, username: user.username, fullName: user.full_name, userType: user.user_type } });
    }

    if (!user.verification_otp || !user.verification_otp_expiry) {
      return res.status(400).json({ success: false, error: 'No verification code found. Please request a new one.' });
    }

    if (new Date() > new Date(user.verification_otp_expiry)) {
      return res.status(400).json({ success: false, error: 'Verification code expired. Please request a new one.' });
    }

    const isValid = await bcrypt.compare(token, user.verification_otp);
    if (!isValid) {
      return res.status(400).json({ success: false, error: 'Invalid verification code' });
    }

    await pool.query(
      'UPDATE users SET email_verified = true, verification_otp = null, verification_otp_expiry = null WHERE id = $1',
      [user.id]
    );

    const authToken = generateToken(user.id);
    res.json({
      success: true,
      token: authToken,
      user: { id: user.id, email: user.email, username: user.username, fullName: user.full_name, userType: user.user_type }
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ============================================
// @route   POST /api/auth/resend-verification
// @desc    Resend verification email
// @access  Public
// ============================================
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required' });

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = result.rows[0];
    if (user.email_verified) {
      return res.json({ success: true, message: 'Email already verified' });
    }

    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      'UPDATE users SET verification_otp = $1, verification_otp_expiry = $2 WHERE id = $3',
      [otpHash, otpExpiry, user.id]
    );

    await sendVerificationEmail(email, otp);
    res.json({ success: true, message: 'Verification email sent' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ============================================
// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
// ============================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required' });

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (result.rows.length === 0) {
      return res.json({ success: true, message: 'If that email exists, a reset link was sent' });
    }

    const user = result.rows[0];
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      'UPDATE users SET verification_otp = $1, verification_otp_expiry = $2 WHERE id = $3',
      [otpHash, otpExpiry, user.id]
    );

    await resend.emails.send({
      from: 'AuraWell <support@serenmynd.com>',
      to: email,
      subject: 'Reset your AuraWell password',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fdf2f8;border-radius:16px;">
          <h2 style="color:#7c3aed;">Password Reset 🔐</h2>
          <p style="color:#374151;">Your password reset code is:</p>
          <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#ec4899;text-align:center;padding:24px;background:#fff;border-radius:12px;margin:16px 0;">
            ${otp}
          </div>
          <p style="color:#6b7280;font-size:14px;">This code expires in 15 minutes.</p>
        </div>
      `
    });

    res.json({ success: true, message: 'If that email exists, a reset code was sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ============================================
// @route   POST /api/auth/reset-password
// @desc    Reset password with OTP code
// @access  Public
// ============================================
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password, email } = req.body;
    if (!token || !password || !email) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = result.rows[0];

    if (!user.verification_otp || new Date() > new Date(user.verification_otp_expiry)) {
      return res.status(400).json({ success: false, error: 'Code expired. Please request a new one.' });
    }

    const isValid = await bcrypt.compare(token, user.verification_otp);
    if (!isValid) {
      return res.status(400).json({ success: false, error: 'Invalid reset code' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      'UPDATE users SET password_hash = $1, verification_otp = null, verification_otp_expiry = null WHERE id = $2',
      [passwordHash, user.id]
    );

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
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
