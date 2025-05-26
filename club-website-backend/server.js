require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Samoxshamas', // Replace with your actual MySQL password
  database: 'clubwebsite',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// 🔗 ROUTES
const clubRoutes = require('./routes/clubs.js');
app.use('/api/clubs', clubRoutes); // ✅ Mount club routes

const membershipRequestsRoutes = require('./routes/membershipRequests');
app.use('/api/membership-requests', membershipRequestsRoutes);

const emailRoutes = require('./routes/emailNotifications');
app.use('/api/email', emailRoutes);

const userEventsRoutes = require('./routes/userEvents');
app.use('/api/events', userEventsRoutes);

const attendanceRoutes = require('./routes/eventAttendance');
app.use('/api/events', attendanceRoutes);

const adminRoutes = require('./routes/admins');
app.use('/api/admins', adminRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// ✅ Admin login route
app.post('/api/admin/login', (req, res) => {
  const { name, password } = req.body;

  const query = 'SELECT * FROM admins WHERE name = ?';
  db.query(query, [name], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(400).json({ error: 'User not found' });

    const admin = results[0];
    if (admin.password !== password) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: admin.role, clubId: admin.club_id });
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
