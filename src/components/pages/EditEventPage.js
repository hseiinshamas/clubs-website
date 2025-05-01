// src/components/pages/EditEventPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditEventPage.css';
import axios from 'axios';

function EditEventPage() {
    const [imageBase64, setImageBase64] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    fetch(`http://localhost:5000/api/events/${id}`)
      .then((res) => res.json())
      .then((data) => setEventData(data))
      .catch((err) => console.error('Failed to load event data', err));
  }, [id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onloadend = () => {
      setImageBase64(reader.result); // base64 string
      setEventData(prev => ({ ...prev, image_url: reader.result })); // update form value too
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
  
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`);
      alert('Event deleted successfully!');
      navigate('/events');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event.');
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      if (response.ok) {
        navigate('/events');
      } else {
        console.error('Failed to update event');
        alert('Failed to update event.');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event.');
    }
  };

  return (
    <div className="edit-event-page">
      <h1>Edit Event</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Date:
          <input
            type="datetime-local"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
  Image:
  <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
  />
</label>

        <div className="edit-buttons">
          <button type="submit">Update Event</button>
          <button type="button" onClick={handleDelete} className="delete-btn">
            Delete Event
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditEventPage;
