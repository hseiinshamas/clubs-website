import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageClubs.css';

const ManageClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [newClub, setNewClub] = useState({ name: '', description: '', image_url: '' });
  const [editingClubId, setEditingClubId] = useState(null);
  const [editedClub, setEditedClub] = useState({ name: '', description: '', image_url: '' });

  const fetchClubs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/clubs');
      setClubs(res.data);
    } catch (err) {
      console.error('Error fetching clubs:', err);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleAddClub = async () => {
    if (!newClub.name || !newClub.description || !newClub.image_url) return;
    try {
      await axios.post('http://localhost:5000/api/clubs', newClub);
      setNewClub({ name: '', description: '', image_url: '' });
      fetchClubs();
    } catch (err) {
      console.error('Error adding club:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/clubs/${id}`);
      fetchClubs();
    } catch (err) {
      console.error('Error deleting club:', err);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/clubs/${id}`, editedClub);
      setEditingClubId(null);
      fetchClubs();
    } catch (err) {
      console.error('Error updating club:', err);
    }
  };

  return (
    <div className="manage-clubs-container">
      <h2>Manage Clubs</h2>

      <div className="add-club-form">
        <input
          type="text"
          placeholder="Club Name"
          value={newClub.name}
          onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
        />
        <textarea
          placeholder="Club Description"
          value={newClub.description}
          onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newClub.image_url}
          onChange={(e) => setNewClub({ ...newClub, image_url: e.target.value })}
        />
        <button onClick={handleAddClub}>Add Club</button>
      </div>

      <div className="clubs-list">
        {clubs.map((club) => (
          <div key={club.id} className="club-card">
            {editingClubId === club.id ? (
              <>
                <input
                  type="text"
                  value={editedClub.name}
                  onChange={(e) => setEditedClub({ ...editedClub, name: e.target.value })}
                />
                <textarea
                  value={editedClub.description}
                  onChange={(e) => setEditedClub({ ...editedClub, description: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={editedClub.image_url}
                  onChange={(e) => setEditedClub({ ...editedClub, image_url: e.target.value })}
                />
                <button onClick={() => handleUpdate(club.id)}>Save</button>
                <button onClick={() => setEditingClubId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <img
                  src={club.image_url}
                  alt={club.name}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <h3>{club.name}</h3>
                <p>{club.description}</p>
                <button
                  onClick={() => {
                    setEditingClubId(club.id);
                    setEditedClub({ name: club.name, description: club.description, image_url: club.image_url });
                  }}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(club.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageClubs;
