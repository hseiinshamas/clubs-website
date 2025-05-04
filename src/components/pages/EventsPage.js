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
    const fetchEvents = async () => {
      let url = '';
  
      if (role === 'admin') {
        const clubId = localStorage.getItem('clubId');
        url = `http://localhost:5000/api/events/for-club/${clubId}`;
      } else if (role === 'superadmin') {
        url = `http://localhost:5000/api/events/all`;
      } else if (studentId) {
        url = `http://localhost:5000/api/events/for-user/${studentId}`;
      }
  
      if (!url) return;
  
      try {
        const res = await fetch(url);
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error('Failed to load events', err);
      }
    };
  
    fetchEvents();
  }, [role, studentId]);

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Upcoming Events</h1>
        {isAdmin && (
          <Button 
          buttonStyle="btn--primary" 
          buttonSize="btn--medium"
          to="/events/new"
          as={Link} // <-- only if Button component supports this
        >
          + Create Event
        </Button>
        
        )}
      </div>
      <div className="events-grid">
      {events.map((evt) => (
  <EventCard
    key={evt.id}
    id={evt.id}  // ✅ This was missing
    title={evt.title}
    date={evt.date}
    location={evt.location}
    description={evt.description}
    image={evt.image_url}
  />
))}

      </div>
    </div>
  );
}

export default EventsPage;
