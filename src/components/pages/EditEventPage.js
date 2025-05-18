  // src/components/pages/EditEventPage.js
  import React, { useState, useEffect } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import './EditEventPage.css';
  import axios from 'axios';

  function EditEventPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [eventData, setEventData] = useState({
      title: '',
      date: '',
      location: '',
      description: '',
      image_url: '',
    });

    const [imageBase64, setImageBase64] = useState('');

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/events/${id}`);
          const data = res.data;

          const toDatetimeLocal = (isoString) => {
            const date = new Date(isoString);
            return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
              .toISOString()
              .slice(0, 16);
          };

          setEventData({
            title: data.title || '',
            date: data.date ? toDatetimeLocal(data.date) : '',
            location: data.location || '',
            description: data.description || '',
            image_url: data.image_url || '',
          });
        } catch (err) {
          console.error('Failed to load event data', err);
        }
      };
      fetchData();
    }, [id]);

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
        setEventData(prev => ({ ...prev, image_url: reader.result }));
      };
      if (file) reader.readAsDataURL(file);
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setEventData(prev => ({ ...prev, [name]: value }));
    };

    const handleDelete = async () => {
      if (!window.confirm('Are you sure you want to delete this event?')) return;
      try {
        await axios.delete(`http://localhost:5000/api/events/${id}`);
        alert('Event deleted successfully!');
        navigate('/events');
      } catch (err) {
        console.error('Error deleting event:', err);
        alert('Failed to delete event.');
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.put(`http://localhost:5000/api/events/${id}`, eventData);
        if (response.status === 200) {
          navigate('/events');
        } else {
          console.error('Failed to update event');
          alert('Failed to update event.');
        }
      } catch (err) {
        console.error('Error updating event:', err);
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
