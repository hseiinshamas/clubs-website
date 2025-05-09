// src/components/pages/EventsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EventsPage.css';
import EventCard from '../common/EventCard';
import { Button } from '../Button';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const role = localStorage.getItem('role');
  const isAdmin = role === 'admin' || role === 'superadmin';

  useEffect(() => {
    const fetchEvents = async () => {
      let url = '';

      if (isAdmin) {
        const clubId = localStorage.getItem('clubId');
        url = role === 'superadmin'
          ? 'http://localhost:5000/api/events/all'
          : `http://localhost:5000/api/events/for-club/${clubId}`;
      } else {
        url = 'http://localhost:5000/api/events/all'; // ✅ all users get all events
      }

      try {
        const res = await fetch(url);
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error('Failed to load events', err);
      }
    };

    fetchEvents();
  }, [role, isAdmin]);

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Upcoming Events</h1>
        {isAdmin && (
          <Button buttonStyle="btn--primary" buttonSize="btn--medium" to="/events/new" as={Link}>
            + Create Event
          </Button>
        )}
      </div>

      {events.length === 0 ? (
        <div className="no-events">
          <p>No upcoming events found.</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((evt) => (
            <EventCard
              key={evt.id}
              id={evt.id}
              title={evt.title}
              date={evt.date}
              location={evt.location}
              description={evt.description}
              image={evt.image_url}
              attendanceCount={evt.attendance_count}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsPage;
