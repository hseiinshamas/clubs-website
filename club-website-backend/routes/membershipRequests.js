// routes/membershipRequests.js
const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Create a new membership request
router.post('/', (req, res) => {
  const { first_name, last_name, major, student_id, club_id, email } = req.body;

  db.query(
    'INSERT INTO membership_requests (first_name, last_name, major, student_id, club_id, email, status) VALUES (?, ?, ?, ?, ?, ?, "pending")',
    [first_name, last_name, major, student_id, club_id, email],
    (err, result) => {
      if (err) {
        console.error('Error inserting membership request:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Membership request submitted successfully' });
    }
  );
});
// Get membership requests by student id
router.get('/student/:studentId', (req, res) => {
  const { studentId } = req.params;
  db.query('SELECT * FROM membership_requests WHERE student_id = ?', [studentId], (err, results) => {
    if (err) {
      console.error('Error fetching membership requests:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


// Get all pending requests
router.get('/pending', (req, res) => {
  db.query(
    `SELECT membership_requests.*, clubs.name AS club_name 
     FROM membership_requests
     JOIN clubs ON membership_requests.club_id = clubs.id
     WHERE status = 'pending'`,
    (err, results) => {
      if (err) {
        console.error('Error fetching pending requests:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    }
  );
});

// Accept Membership
router.put('/:id/approve', (req, res) => {
  const { id } = req.params;
  db.query(
    'UPDATE membership_requests SET status = "joined" WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error('Error approving request:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Membership request approved' });
    }
  );
});

// Leave club (student removes their membership)
router.delete('/leave/:studentId/:clubId', (req, res) => {
  const { studentId, clubId } = req.params;

  db.query(
    'DELETE FROM membership_requests WHERE student_id = ? AND club_id = ? AND status = "joined"',
    [studentId, clubId],
    (err, result) => {
      if (err) {
        console.error('Error leaving club:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Membership not found or not accepted yet' });
      }

      res.status(200).json({ message: 'Left the club successfully' });
    }
  );
});




// Reject Membership
// DELETE membership request by id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM membership_requests WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting membership request:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.status(200).json({ message: 'Membership request deleted' });
  });
});


// Approve a membership request
router.put('/:id/approve', (req, res) => {
  const { id } = req.params;

  db.query(
    'UPDATE membership_requests SET status = "joined" WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error('Error approving request:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json({ message: 'Membership request approved' });
    }
  );
});


// Get all accepted members (status = 'joined')
router.get('/accepted', (req, res) => {
  db.query(
    `SELECT membership_requests.*, clubs.name AS club_name 
     FROM membership_requests
     JOIN clubs ON membership_requests.club_id = clubs.id
     WHERE status = 'joined'`,
    (err, results) => {
      if (err) {
        console.error('Error fetching accepted members:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    }
  );
});

// Leave club route
router.delete('/leave/:studentId/:clubId', (req, res) => {
  const studentId = req.params.studentId;
  const clubId = parseInt(req.params.clubId); // keep this number, it's fine

  const query = 'DELETE FROM membership_requests WHERE student_id = ? AND club_id = ? AND status = "joined"';

  db.query(query, [studentId.toString(), clubId], (err, result) => {
    if (err) {
      console.error('❌ Error removing membership:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      console.warn('⚠️ No joined membership found to delete');
      return res.status(404).json({ error: 'No matching record' });
    }

    res.json({ message: 'Successfully left the club' });
  });
});



module.exports = router;
