const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const { connectDB } = require('../config/database');

const router = express.Router();

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Mock email function for development
const sendEmail = async (to, subject, html) => {
  if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
    console.log('Mock email sent:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML:', html);
    return { message: 'Mock email sent (configure EMAIL_USER and EMAIL_PASSWORD for real emails)' };
  }

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    return { message: 'Email sent successfully', messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Failed to send email');
  }
};

// Initialize database connection
let db = null;
let isMockMode = false;

// Initialize database connection on startup
(async () => {
  db = await connectDB();
  isMockMode = db.mock === true;
})();

// Register user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName } = req.body;

    if (isMockMode) {
      // Mock registration for demo purposes
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        first_name: firstName,
        last_name: lastName,
        created_at: new Date()
      };

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Generate JWT token
      const token = jwt.sign(
        { userId: mockUser.id, email: mockUser.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      return res.status(201).json({
        message: 'User registered successfully (mock mode)',
        token,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.first_name,
          lastName: mockUser.last_name
        }
      });
    }

    // Check if user already exists
    const { data: existingUser, error: userError } = await db
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const { data: newUser, error: createError } = await db
      .from('users')
      .insert([
        {
          email,
          password: hashedPassword,
          first_name: firstName,
          last_name: lastName,
          created_at: new Date(),
          updated_at: new Date()
        }
      ])
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    if (isMockMode) {
      // Mock login for demo purposes
      // For mock mode, we'll accept any password and return a mock user
      const mockUser = {
        id: 'mock-user-id-' + Math.random().toString(36).substr(2, 9),
        email,
        first_name: 'Mock',
        last_name: 'User',
        password: await bcrypt.hash('password', 12) // Hash a dummy password
      };

      // Generate JWT token
      const token = jwt.sign(
        { userId: mockUser.id, email: mockUser.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      return res.json({
        message: 'Login successful (mock mode)',
        token,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.first_name,
          lastName: mockUser.last_name
        }
      });
    }

    // Find user
    const { data: user, error: userError } = await db
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Forgot password - request reset
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    if (isMockMode) {
      // Mock response for demo purposes
      console.log('Mock password reset requested for:', email);
      return res.json({
        message: 'Password reset email sent (mock mode)',
        resetToken: 'mock-reset-token-' + Math.random().toString(36).substr(2, 9)
      });
    }

    // Check if user exists
    const { data: user, error: userError } = await db
      .from('users')
      .select('id, email, first_name')
      .eq('email', email)
      .single();

    if (!user) {
      // Don't reveal if user exists for security
      return res.json({
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Store reset token in database
    const { error: updateError } = await db
      .from('users')
      .update({
        reset_token: resetToken,
        reset_token_expires: resetTokenExpiry,
        updated_at: new Date()
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // Send email
    const emailSubject = 'Password Reset Request';
    const emailHtml = `
      <h2>Password Reset Request</h2>
      <p>Hello ${user.first_name},</p>
      <p>You requested to reset your password. Click the link below to reset your password:</p>
      <p><a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this reset, please ignore this email.</p>
    `;

    await sendEmail(email, emailSubject, emailHtml);

    res.json({
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password
router.post('/reset-password', [
  body('token').notEmpty(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, password } = req.body;

    if (isMockMode) {
      // Mock response for demo purposes
      console.log('Mock password reset with token:', token);
      return res.json({
        message: 'Password reset successful (mock mode)'
      });
    }

    // Find user with valid reset token
    const { data: user, error: userError } = await db
      .from('users')
      .select('id, reset_token_expires')
      .eq('reset_token', token)
      .single();

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Check if token is expired
    if (new Date() > new Date(user.reset_token_expires)) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update password and clear reset token
    const { error: updateError } = await db
      .from('users')
      .update({
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
        updated_at: new Date()
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    res.json({
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (isMockMode) {
      // Mock user data for demo purposes
      const mockUser = {
        id: decoded.userId,
        email: decoded.email,
        first_name: 'Mock',
        last_name: 'User',
        created_at: new Date()
      };
      
      return res.json({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.first_name,
          lastName: mockUser.last_name,
          createdAt: mockUser.created_at
        }
      });
    }

    const { data: user, error } = await db
      .from('users')
      .select('id, email, first_name, last_name, created_at')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
