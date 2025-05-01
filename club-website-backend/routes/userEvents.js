const express = require('express');
const router = express.Router();
const db = require('../db/db');


// Get events for a specific club (admin)
router.get('/for-club/:clubId', (req, res) => {
  const { clubId } = req.params;

  db.query('SELECT * FROM events WHERE club_id = ?', [clubId], (err, results) => {
    if (err) {
      console.error('Error fetching events for club:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get all events (for superadmin)
router.get('/all', (req, res) => {
  db.query('SELECT * FROM events', (err, results) => {
    if (err) {
      console.error('Error fetching all events:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results); // ✅ results should contain `id`
  });
});

// DELETE /api/events/:id - Delete an event
router.delete('/:id', (req, res) => {
  const eventId = parseInt(req.params.id); // 🔥 Parse to ensure it's a number

  if (isNaN(eventId)) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  db.query('DELETE FROM events WHERE id = ?', [eventId], (err, result) => {
    if (err) {
      console.error('Error deleting event:', err);
      return res.status(500).json({ error: 'Failed to delete event' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  });
});


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
