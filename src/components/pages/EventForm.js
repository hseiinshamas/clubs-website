import React, { useEffect, useState } from 'react';
import './EventForm.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EventForm() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const adminClubId = localStorage.getItem('clubId');
  const [clubs, setClubs] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    image_url: '',
    club_id: role === 'admin' ? adminClubId : '' // pre-fill if admin
  });

  useEffect(() => {
    if (role === 'superadmin') {
      axios.get('http://localhost:5000/api/clubs')
        .then(res => setClubs(res.data))
        .catch(err => console.error("Failed to load clubs", err));
    }
  }, [role]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [imageBase64, setImageBase64] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageBase64(reader.result); // base64 image
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        image_url: imageBase64,
      };

      await axios.post('http://localhost:5000/api/events', payload);

      alert('Event created!');
      navigate('/events');
    } catch (err) {
      console.error('Error creating event:', err);
      alert('Failed to create event');
    }
  };

  return (
    <div className="event-form-container">
      <button
        type="button"
        className="close-button"
        onClick={() => navigate('/events')}
        aria-label="Close"
      >
        ✖
      </button>

      <h1>Create New Event</h1>
      <form className="event-form" onSubmit={handleSubmit}>
        <input name="title" type="text" placeholder="Event Title" onChange={handleChange} required />
        <input name="date" type="datetime-local" onChange={handleChange} required />
        <input name="location" type="text" placeholder="Location" onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />

        {/* Superadmin club selector */}
        {role === 'superadmin' && (
          <select name="club_id" value={formData.club_id} onChange={handleChange} required>
            <option value="">Select Club</option>
            {clubs.map(club => (
              <option key={club.id} value={club.id}>{club.name}</option>
            ))}
          </select>
        )}

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default EventForm;
