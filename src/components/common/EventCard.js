// src/components/common/EventCard.js
import React from 'react';
import './EventCard.css';
import { Link } from 'react-router-dom';

export default function EventCard({ id, title, date, location, image, description }) {
  const formatted = new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const role = localStorage.getItem('role');
  const isAdmin = role === 'admin' || role === 'superadmin';

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          window.location.reload(); // Refresh the page to reflect deletion
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
        <span className="event-meta">
          {formatted} • {location}
        </span>
        <p>{description}</p>
        {isAdmin && (
          <div className="event-actions">
            <Link to={`/events/edit/${id}`} className="btn btn-edit">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-delete">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
