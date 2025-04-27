  const express = require('express');
  const router = express.Router();
  const bcrypt = require('bcryptjs');
  const db = require('../db/db'); // make sure this is the correct path to your db.js

  // Get all admins
  router.get('/', (req, res) => {
      db.query('SELECT * FROM admins', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
      });
    })
  // 🔹 Add a new admin
  router.post('/', async (req, res) => {
    const { name, password, role } = req.body;
    if (!name || !password || !role) return res.status(400).json({ error: 'Missing fields' });

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO admins (name, password, role) VALUES (?, ?, ?)',
      [name, hashedPassword, role],
      (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Admin added successfully' });
      }
    );
  });

  // Delete admin
  router.delete('/:id', (req, res) => {
      const { id } = req.params;
      db.query('DELETE FROM admins WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to delete admin' });
        res.json({ success: true });
      });
    });


    // Update admin
  router.put('/:id', (req, res) => {
      const { id } = req.params;
      const { name, password, role } = req.body;
      db.query(
        'UPDATE admins SET name = ?, password = ?, role = ? WHERE id = ?',
        [name, password, role, id],
        (err) => {
          if (err) return res.status(500).json({ error: 'Failed to update admin' });
          res.json({ success: true });
        }
      );
    });

  module.exports = router;
