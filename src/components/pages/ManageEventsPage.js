// src/components/pages/ManageEventsPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageEventsPage.css';
import axios from 'axios';

function ManageEventsPage() {
  const [events, setEvents] = useState([]);
  const role = localStorage.getItem('role');
  const adminClubId = localStorage.getItem('clubId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/events');
        const filtered = role === 'admin'
          ? res.data.filter(evt => evt.club_id === parseInt(adminClubId))
          : res.data;
        setEvents(filtered);
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };

    fetchEvents();
  }, [role, adminClubId]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`);
      setEvents(prev => prev.filter(evt => evt.id !== id));
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  return (
    <div className="manage-events-container">
      <h1>Manage Events</h1>
      <button className="create-btn" onClick={() => navigate('/events/new')}>+ Add Event</button>
      <div className="events-list">
        {events.map(evt => (
          <div className="event-card" key={evt.id}>
            <img src={evt.image_url} alt={evt.title} />
            <div className="event-info">
              <h3>{evt.title}</h3>
              <p><strong>Date:</strong> {new Date(evt.date).toLocaleString()}</p>
              <p><strong>Location:</strong> {evt.location}</p>
              <p>{evt.description}</p>
              <div className="event-actions">
                <button onClick={() => navigate(`/events/edit/${evt.id}`)}>Edit</button>
                <button onClick={() => handleDelete(evt.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageEventsPage;
