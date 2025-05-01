const express = require('express');
const nodemailer = require('nodemailer');
const db = require('../db/db');
const router = express.Router();

// Email transporter setup (use Gmail App Password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,         // e.g. example@gmail.com
    pass: process.env.EMAIL_PASS          // your app password
  }
});

// Send acceptance email
router.post('/approve/:id', (req, res) => {
  const { id } = req.params;

  // First update the status
  db.query('UPDATE membership_requests SET status = "joined" WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error approving membership:', err);
      return res.status(500).json({ error: 'DB error' });
    }

    // Fetch user email
    db.query('SELECT email, first_name FROM students WHERE id = (SELECT student_id FROM membership_requests WHERE id = ?)', [id], (err, result) => {
      if (err || result.length === 0) {
        return res.status(500).json({ error: 'Email fetch error' });
      }

      const { email, first_name } = result[0];

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Membership Approved',
        text: `Hi ${first_name},\n\nYour membership request has been approved. Welcome to the club!`
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.error('Error sending email:', err);
          return res.status(500).json({ error: 'Failed to send email' });
        }

        res.json({ message: 'Approved and email sent.' });
      });
    });
  });
});

// Send rejection email
router.post('/reject/:id', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  db.query('SELECT email, first_name FROM students WHERE id = (SELECT student_id FROM membership_requests WHERE id = ?)', [id], (err, result) => {
    if (err || result.length === 0) {
      return res.status(500).json({ error: 'Email fetch error' });
    }

    const { email, first_name } = result[0];

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Membership Rejected',
      text: `Hi ${first_name},\n\nWe regret to inform you that your request was rejected.\nReason: ${reason || 'No reason provided'}`
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error('Error sending rejection email:', err);
        return res.status(500).json({ error: 'Failed to send email' });
      }

      // After email is sent, delete the request
      db.query('DELETE FROM membership_requests WHERE id = ?', [id], (err) => {
        if (err) {
          console.error('Failed to delete membership request:', err);
          return res.status(500).json({ error: 'DB error' });
        }
        res.json({ message: 'Rejected, email sent, request deleted.' });
      });
    });
  });
});

module.exports = router;
