import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageAdmins.css';
import { FaUserShield, FaTrashAlt, FaPlus } from 'react-icons/fa';

function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admins');
      setAdmins(res.data);
    } catch (err) {
      console.error('Error fetching admins:', err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admins', { name, password, role });
      setName('');
      setPassword('');
      setRole('admin');
      fetchAdmins();
    } catch (err) {
      console.error('Error adding admin:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admins/${id}`);
      fetchAdmins();
    } catch (err) {
      console.error('Error deleting admin:', err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2><FaUserShield /> Manage Admins</h2>

      <form className="add-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>
        <button type="submit"><FaPlus /> Add Admin</button>
      </form>

      <div className="admin-grid">
        {admins.map((admin) => (
          <div className="admin-card" key={admin.id}>
            <div className="admin-info">
              <div className="profile-circle">{admin.name[0].toUpperCase()}</div>
              <div>
                <p className="admin-name">{admin.name}</p>
                <span className={`role-badge ${admin.role}`}>{admin.role}</span>
              </div>
            </div>
            <button className="delete-btn" onClick={() => handleDelete(admin.id)}>
              <FaTrashAlt />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageAdmins;
