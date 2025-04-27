const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  


module.exports = router;
