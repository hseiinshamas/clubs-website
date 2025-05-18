const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get events for a specific club (admin) with attendance counts
router.get('/for-club/:clubId', (req, res) => {
  const { clubId } = req.params;

  const query = `
    SELECT e.*, 
           COALESCE((SELECT COUNT(*) FROM event_attendance ea WHERE ea.event_id = e.id), 0) AS attendance_count
    FROM events e
    WHERE e.club_id = ?
  `;

  db.query(query, [clubId], (err, results) => {
    if (err) {
      console.error('Error fetching events for club:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get all events (for all users) with attendance counts
router.get('/all', (req, res) => {
  const query = `
    SELECT e.*, 
           COALESCE((SELECT COUNT(*) FROM event_attendance ea WHERE ea.event_id = e.id), 0) AS attendance_count
    FROM events e
    ORDER BY e.date ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching all events:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// POST a new event (for admin or superadmin)
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

// DELETE an event by ID
router.delete('/:id', (req, res) => {
  const eventId = parseInt(req.params.id);

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

// ✅ Check if a student already joined a specific event
router.get('/has-joined/:eventId/:studentId', (req, res) => {
  const { eventId, studentId } = req.params;

  db.query(
    'SELECT 1 FROM event_attendance WHERE event_id = ? AND student_id = ?',
    [eventId, studentId],
    (err, results) => {
      if (err) {
        console.error('Error checking joined status:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ joined: results.length > 0 });
    }
  );
});




// Get a single event by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM events WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(results[0]);
  });
});


// Update an event by ID
router.put('/:id', (req, res) => {
  const eventId = parseInt(req.params.id);
  const { title, date, location, description, image_url } = req.body;

  if (!title || !date || !location || !description) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const query = `
    UPDATE events
    SET title = ?, date = ?, location = ?, description = ?, image_url = ?
    WHERE id = ?
  `;

  db.query(query, [title, date, location, description, image_url, eventId], (err, result) => {
    if (err) {
      console.error('Error updating event:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ message: 'Event updated successfully' });
  });
});


module.exports = router;
