import React, { useState, useEffect } from 'react';
import './EventCard.css';
import { Link } from 'react-router-dom';

export default function EventCard({ id, title, date, location, image, description, attendanceCount }) {
  const formatted = new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const role = localStorage.getItem('role');
  const studentId = localStorage.getItem('studentId');
  const isAdmin = role === 'admin' || role === 'superadmin';

  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const fetchJoinedStatus = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/has-joined/${id}/${studentId}`);
        const data = await res.json();
        setJoined(data.joined);
      } catch (err) {
        console.error('Error checking join status:', err);
      }
    };

    if (!isAdmin && studentId) {
      fetchJoinedStatus();
    }
  }, [id, studentId, isAdmin]);

  const handleJoin = async () => {
    if (!studentId) {
      const redirectUrl = encodeURIComponent(window.location.pathname);
      window.location.href = `/user-login?redirectTo=${redirectUrl}`;
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/events/join/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId }),
      });

      if (res.ok) {
        setJoined(true);
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (err) {
      console.error('Error joining event:', err);
    }
  };

  const handleUnjoin = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/unjoin/${id}/${studentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setJoined(false);
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (err) {
      console.error('Error cancelling join:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          window.location.reload();
        } else {
          console.error('Failed to delete event');
        }
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  return (
    <div className="event-card">
      <div className="event-thumb">
        <img src={image} alt={title} />
      </div>
      <div className="event-info">
        <h2>{title}</h2>
        <span className="event-meta">{formatted} • {location}</span>
        <p>{description}</p>

        {/* Student view */}
        {!isAdmin && !joined && (
          <button className="btn-join" onClick={handleJoin}>Join</button>
        )}

        {!isAdmin && joined && (
          <div className="joined-info">
            <p style={{ color: 'green', fontWeight: 'bold' }}>You're going!</p>
            <button className="btn-cancel" onClick={handleUnjoin}>Cancel</button>
          </div>
        )}

        {/* Admin view */}
        {isAdmin && (
          <div className="event-actions">
            <div className="attendance-left">
              {attendanceCount || 0} going
            </div>
            <div className="admin-buttons">
              <Link to={`/events/edit/${id}`} className="btn btn-edit">Edit</Link>
              <button onClick={handleDelete} className="btn btn-delete">Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
