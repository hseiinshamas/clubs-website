const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendMail = require('../utils/mailer');


// User Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      userId: user.id,
      studentId: user.student_id,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
    });
  });
});

// Signup Route
router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password, studentId, major } = req.body;
  
    if (!firstName || !lastName || !email || !password || !studentId || !major) {
      return res.status(400).json({ error: 'Please fill all fields' });
    }
  
    try {
      // Check if user already exists
      db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
  
        if (results.length > 0) {
          return res.status(400).json({ error: 'Email already exists' });
        }
  
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Insert new user into the database
        const insertQuery = `
          INSERT INTO users (first_name, last_name, email, password, student_id, major) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;
  
        db.query(insertQuery, [firstName, lastName, email, hashedPassword, studentId, major], (err, result) => {
          if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ error: 'Failed to create user' });
          }
          res.status(201).json({ message: 'User created successfully' });
        });
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Server error' });
    }

    
    
  });


// ✅ FORGOT PASSWORD - generate and send token
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    db.query(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
      [token, expires, email],
      async (err2) => {
        if (err2) {
          console.error('Error saving reset token:', err2);
          return res.status(500).json({ error: 'Server error' });
        }

        const resetLink = `http://localhost:3000/reset-password/${token}`;
        const html = `
          <h3>Password Reset</h3>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>This link expires in 1 hour.</p>
        `;

        try {
          await sendMail({
            to: email,
            subject: 'Reset your password',
            html,
          });

          res.json({ message: 'Password reset link sent to your email' });
        } catch (err3) {
          console.error('Email error:', err3);
          res.status(500).json({ error: 'Failed to send email' });
        }
      }
    );
  });
});

// ✅ RESET PASSWORD - validate token and update password
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) return res.status(400).json({ error: 'New password is required' });

  db.query(
    'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
    [token],
    async (err, results) => {
      if (err || results.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }

      const hashed = await bcrypt.hash(password, 10);

      db.query(
        'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
        [hashed, results[0].id],
        (err2) => {
          if (err2) {
            console.error('Error resetting password:', err2);
            return res.status(500).json({ error: 'Failed to reset password' });
          }
          res.json({ message: 'Password reset successfully' });
        }
      );
    }
  );
});

module.exports = router;
