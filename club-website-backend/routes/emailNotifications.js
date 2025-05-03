// routes/emailNotifications.js
const express = require('express');
const nodemailer = require('nodemailer');
const db = require('../db/db');
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false  // <== Bypasses self-signed cert error CHANGEEEEEEE THISSSSSSSSSSSSSSSSSSS FOR SECURITYYY
  }
});


// ✅ Send acceptance email and approve
router.post('/approve/:id', (req, res) => {
  const { id } = req.params;

  db.query('UPDATE membership_requests SET status = "joined" WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('❌ DB update error:', err);
      return res.status(500).json({ error: 'DB error' });
    }

    db.query(
      `SELECT u.email, u.first_name 
       FROM users u
       JOIN membership_requests m ON u.student_id = m.student_id
       WHERE m.id = ?`,
      [id],
      (err, result) => {
        if (err || result.length === 0) {
          console.error('❌ Error fetching user email:', err || 'No user found');
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
            console.error('❌ Email send error:', err);
            return res.status(500).json({ error: 'Email failed' });
          }

          res.json({ message: 'Approved and email sent.' });
        });
      }
    );
  });
});

// ✅ Send rejection email and delete
router.post('/reject/:id', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  db.query(
    `SELECT u.email, u.first_name 
     FROM users u
     JOIN membership_requests m ON u.student_id = m.student_id
     WHERE m.id = ?`,
    [id],
    (err, result) => {
      if (err || result.length === 0) {
        console.error('❌ Error fetching user email:', err || 'No user found');
        return res.status(500).json({ error: 'Email fetch error' });
      }

      const { email, first_name } = result[0];

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Membership Rejected',
        text: `Hi ${first_name},\n\nWe regret to inform you that your request was rejected.\n\nReason: ${reason || 'No reason provided'}`
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.error('❌ Email send error:', err);
          return res.status(500).json({ error: 'Failed to send email' });
        }

        db.query('DELETE FROM membership_requests WHERE id = ?', [id], (err) => {
          if (err) {
            console.error('❌ Failed to delete request:', err);
            return res.status(500).json({ error: 'DB delete error' });
          }

          res.json({ message: 'Rejected, email sent, request deleted.' });
        });
      });
    }
  );
});

module.exports = router;
