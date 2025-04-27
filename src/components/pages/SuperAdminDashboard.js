import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaCogs } from 'react-icons/fa';
import './SuperAdminDashboard.css';
import { FaUserShield } from 'react-icons/fa';

function SuperAdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="super-admin-container">
      <h1>Welcome, Super Admin!</h1>
      <p className="tagline">Full control over all clubs and events</p>

      <div className="dashboard-cards">
        <div className="dashboard-card" onClick={() => navigate('/manage-clubs')}>
          <FaUsers size={40} />
          <h3>Manage Clubs</h3>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/manage-admins')}>
  <FaUsers size={40} />
  <h3>Manage Admins</h3>
</div>


        <div className="dashboard-card" onClick={() => navigate('/manage-events')}>
          <FaCalendarAlt size={40} />
          <h3>Manage Events</h3>
        </div>

        
      </div>
    </div>
  );
}

export default SuperAdminDashboard;

