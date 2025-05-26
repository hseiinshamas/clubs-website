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

  const handleImageUpload = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (isEdit) {
        setEditedClub((prev) => ({ ...prev, image_url: reader.result }));
      } else {
        setNewClub((prev) => ({ ...prev, image_url: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

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
      await axios.put(`http://localhost:5000/api/clubs/${id}`, {
        name: editedClub.name,
        description: editedClub.description,
        image: editedClub.image_url,
      });
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
        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} />
        {newClub.image_url && (
          <img
            src={newClub.image_url}
            alt="Preview"
            style={{ width: '100px', marginTop: '10px' }}
          />
        )}
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
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                {editedClub.image_url && (
                  <img
                    src={editedClub.image_url}
                    alt="Preview"
                    style={{ width: '100px', marginTop: '10px' }}
                  />
                )}
                <div className="button-group">
                  <button className="edit-btn" onClick={() => handleUpdate(club.id)}>Save</button>
                  <button className="delete-btn" onClick={() => setEditingClubId(null)}>Cancel</button>
                </div>
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
                <div className="button-group">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingClubId(club.id);
                      setEditedClub({
                        name: club.name,
                        description: club.description,
                        image_url: club.image_url,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(club.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageClubs;
