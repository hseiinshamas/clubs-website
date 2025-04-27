// src/components/pages/EventForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventForm.css';

export default function EventForm() {
  const [form, setForm] = useState({ title:'', date:'', location:'', image:'', description:'' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: send form to backend
    console.log('Creating event:', form);
    navigate('/events'); // back to list
  };

  return (
    <div className="event-form-page">
      <h1>Create New Event</h1>
      <form className="event-form" onSubmit={handleSubmit}>
        {['title','date','location','image','description'].map(field => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            required
            {...(field==='date'?{type:'datetime-local'}:{})}
          />
        ))}
        <button type="submit" className="btn btn--primary">Save Event</button>
      </form>
    </div>
  );
}
