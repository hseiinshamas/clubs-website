import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { FaCalendarAlt, FaEdit } from 'react-icons/fa';

function AdminDashboard() {
  const [club, setClub] = useState(null);
  const navigate = useNavigate();
  const clubId = localStorage.getItem('clubId');

  useEffect(() => {
    // Fetch club info
    fetch(`http://localhost:5000/api/clubs/${clubId}`)
      .then((res) => res.json())
      .then((data) => setClub(data))
      .catch((err) => console.error('Error fetching club:', err));
  }, [clubId]);

  if (!club) return <div className="admin-dashboard-container">Loading your club info...</div>;

  return (
    <div className="admin-dashboard-container">
      <h1>Welcome, Admin of {club.name}</h1>
      <p className="tagline">Manage your club and create awesome events</p>

      <div className="dashboard-cards">
        <div className="dashboard-card" onClick={() => navigate(`/admin/manage-club/${clubId}`)}>
          <FaEdit size={40} />
          <h3>Edit Club Details</h3>
        </div>

        <div className="dashboard-card" onClick={() => navigate(`/admin/manage-events/${clubId}`)}>
          <FaCalendarAlt size={40} />
          <h3>Manage Events</h3>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
