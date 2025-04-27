// routes/clubs.js

const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Your database connection
const { authenticate, authorizeSuper, authorizeClubOrSuper } = require('../middleware/auth'); // Optional if you want auth later

// Get all clubs
router.get('/', (req, res) => {
  db.query('SELECT * FROM clubs', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Add a new club
router.post('/', (req, res) => {
  const { name, description, image } = req.body; // Added 'image' if you want to save it too
  db.query(
    'INSERT INTO clubs (name, description, image) VALUES (?, ?, ?)',
    [name, description, image],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to add club' });
      res.json({ message: 'Club added successfully' });
    }
  );
});

// Update a club
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, image } = req.body; // Added 'image' field here too

  db.query(
    'UPDATE clubs SET name = ?, description = ?, image = ? WHERE id = ?',
    [name, description, image, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to update club' });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Club not found' });
      }

      res.json({ message: 'Club updated successfully' });
    }
  );
});

// Delete a club
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM clubs WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete club' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Club not found' });
    }

    res.json({ message: 'Club deleted successfully' });
  });
});

// Export the router
module.exports = router;
