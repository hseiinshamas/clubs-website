import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './EditClubDetails.css';

function EditClubDetails() {
  const { id } = useParams();
  const [club, setClub] = useState({ name: '', description: '', image_url: '' });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/clubs/${id}`)
      .then(res => setClub(res.data))
      .catch(err => console.error('Error fetching club:', err));
  }, [id]);

  const handleChange = (e) => {
    setClub({ ...club, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:5000/api/clubs/${id}`, club)
      .then(() => alert('Club updated successfully!'))
      .catch(err => console.error('Error updating club:', err));
  };

  return (
    <div className="admin-dashboard">
      <h2>Edit Club Details</h2>
      <div className="add-form">
        <input
          type="text"
          name="name"
          value={club.name}
          onChange={handleChange}
          placeholder="Club Name"
        />
        <input
          type="text"
          name="image_url"
          value={club.image_url}
          onChange={handleChange}
          placeholder="Image URL"
        />
        <textarea
          name="description"
          value={club.description}
          onChange={handleChange}
          placeholder="Club Description"
          style={{ flex: '1 1 100%' }}
        />
        <button onClick={handleUpdate}>Save Changes</button>
      </div>
    </div>
  );
}

export default EditClubDetails;
