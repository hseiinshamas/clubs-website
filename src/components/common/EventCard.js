// src/components/common/EventCard.js
import React from 'react';
import './EventCard.css';

export default function EventCard({ title, date, location, image, description }) {
  const formatted = new Date(date).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="event-card">
      <div className="event-thumb">
        <img src={image} alt={title} />
      </div>
      <div className="event-info">
        <h2>{title}</h2>
        <span className="event-meta">{formatted} • {location}</span>
        <p>{description}</p>
      </div>
    </div>
  );
}
