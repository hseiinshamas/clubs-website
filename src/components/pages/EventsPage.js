// src/components/pages/EventsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EventsPage.css';
import EventCard from '../common/EventCard'; // Correct path to EventCard.js
import { Button } from '../Button';

function EventsPage() {
  const [events, setEvents] = useState([]);
  // placeholder for admin check; wire this up to your auth later
  const isAdmin = /* fetch from auth context */ false;

  useEffect(() => {
    // TODO: replace with real API call
    setEvents([
      {
        id: 1,
        title: 'Photography Workshop',
        date: '2025-05-10T14:00',
        location: 'Room 101',
        image: '/images/photoworkshop.jpg',
        description: 'Learn pro tips from our guest photographer.'
      },
      // …more sample events
    ]);
  }, []);

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
        {events.map(evt => (
          <EventCard key={evt.id} {...evt} />
        ))}
      </div>
    </div>
  );
}

export default EventsPage;
