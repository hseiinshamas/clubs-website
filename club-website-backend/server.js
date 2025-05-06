require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();



// Include your route from the 'routes/clubs.js' file
const clubRoutes = require('./routes/clubs.js'); // Correct path to your clubs.js
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));  // or higher if needed
require('dotenv').config();


;

const membershipRequestsRoutes = require('./routes/membershipRequests');
app.use('/api/membership-requests', membershipRequestsRoutes);


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const emailRoutes = require('./routes/emailNotifications');
app.use('/api/email', emailRoutes);

const userEventsRoutes = require('./routes/userEvents');
app.use('/api/events', userEventsRoutes);

const attendanceRoutes = require('./routes/eventAttendance');
app.use('/api/events', attendanceRoutes);






// Login route to authenticate admin or superadmin
app.post('/api/admin/login', (req, res) => {
    const { name, password } = req.body;

  
  
    // Query to check if the user exists
    const query = 'SELECT * FROM admins WHERE name = ?';
    db.query(query, [name], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (results.length === 0) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      const admin = results[0];
  
      // Check if the password matches
      if (admin.password !== password) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Send the token and role as response
      res.json({ token, role: admin.role, clubId: admin.club_id });

      
    });
  });

const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: loginName,
        password: loginPassword,
      }),
    });
  
    const data = await res.json();
    if (res.ok) {
      // Save token and role
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('clubId', data.clubId);
  
      // Redirect to admin dashboard or wherever you want
      window.location.href = '/admin-dashboard';
    } else {
      alert(data.error || 'Login failed');
    }
  };
  









// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Samoxshamas', // or your MySQL root password
  database: 'clubwebsite'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.use(cors());
app.use(express.json());






const adminRoutes = require('./routes/admins');
app.use('/api/admins', adminRoutes);


const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);



// Example route for getting club by ID
app.get('/api/clubs/:id', async (req, res) => {
  const clubId = req.params.id;

  try {
    const [rows] = await db.promise().query('SELECT * FROM clubs WHERE id = ?', [clubId]);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Club not found' });
    }
  } catch (error) {
    console.error('Error fetching club:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Route to get all clubs
app.get('/api/clubs', (req, res) => {
    const query = 'SELECT * FROM clubs';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching clubs:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    });
  });
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

