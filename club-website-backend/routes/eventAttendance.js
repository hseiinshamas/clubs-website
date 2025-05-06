// Join event
router.post('/join/:eventId', (req, res) => {
    const { studentId } = req.body;
    const { eventId } = req.params;
  
    db.query(
      'INSERT INTO event_attendance (event_id, student_id) VALUES (?, ?)',
      [eventId, studentId],
      (err) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Already joined this event' });
          }
          console.error('Error joining event:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Joined event successfully' });
      }
    );
  });
  
  // Get count of attendees per event
  router.get('/attendees-count', (req, res) => {
    db.query(
      `SELECT event_id, COUNT(*) as count
       FROM event_attendance
       GROUP BY event_id`,
      (err, results) => {
        if (err) {
          console.error('Error fetching counts:', err);
          return res.status(500).json({ error: 'Database error' });
        }
  
        const counts = {};
        results.forEach(row => {
          counts[row.event_id] = row.count;
        });
  
        res.json(counts);
      }
    );
  });
  