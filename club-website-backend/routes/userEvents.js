const express = require('express');
const router = express.Router();
const db = require('../db/db');

// ✅ GET events for clubs a user is joined in
router.get('/for-user/:studentId', (req, res) => {
  const { studentId } = req.params;

  const query = `
    SELECT e.*
    FROM events e
    JOIN membership_requests m ON e.club_id = m.club_id
    WHERE m.student_id = ? AND m.status = 'joined'
  `;

  db.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error fetching events for user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// ✅ POST a new event (for admin or superadmin)
router.post('/', (req, res) => {
  const { title, date, location, description, image_url, club_id } = req.body;

  if (!title || !date || !location || !description || !club_id) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  db.query(
    'INSERT INTO events (title, date, location, description, image_url, club_id) VALUES (?, ?, ?, ?, ?, ?)',
    [title, date, location, description, image_url, club_id],
    (err) => {
      if (err) {
        console.error('Error inserting event:', err);
        return res.status(500).json({ error: 'Failed to create event' });
      }
      res.status(201).json({ message: 'Event created successfully' });
    }
  );
});

module.exports = router;
