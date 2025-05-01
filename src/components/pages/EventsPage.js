// src/components/pages/EventsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EventsPage.css';
import EventCard from '../common/EventCard';
import { Button } from '../Button';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const role = localStorage.getItem('role');
  const studentId = localStorage.getItem('studentId');
  const isAdmin = role === 'admin' || role === 'superadmin';

  useEffect(() => {
    if (!studentId) return;

    fetch(`http://localhost:5000/api/events/for-user/${studentId}`)
      .then((res) => res.json())
      .then(setEvents)
      .catch((err) => console.error('Failed to load events', err));
  }, [studentId]);

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Upcoming Events</h1>
        {isAdmin && (
          <Link to="/events/new">
            <Button buttonStyle="btn--primary" buttonSize="btn--medium">
              + Create Event
            </Button>
          </Link>
        )}
      </div>
      <div className="events-grid">
        {events.map((evt) => (
          <EventCard key={evt.id} {...evt} />
        ))}
      </div>
    </div>
  );
}

export default EventsPage;
