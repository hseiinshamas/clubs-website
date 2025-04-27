// src/components/pages/ManagePanel.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaClipboardList, FaUserShield, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';
import './ManagePanel.css';

function ManagePanel() {
  return (
    <div className="manage-panel-container">
      <h1 className="manage-panel-title">Admin Control Panel</h1>
      <p className="manage-panel-subtitle">Manage everything from here</p>

      <div className="manage-cards">
        <Link to="/manage-clubs" className="manage-card">
          <FaUsers className="manage-card-icon" />
          <h2>Manage Clubs</h2>
        </Link>

        <Link to="/manage-admins" className="manage-card">
          <FaUserShield className="manage-card-icon" />
          <h2>Manage Admins</h2>
        </Link>

        <Link to="/membership-requests" className="manage-card">
          <FaClipboardList className="manage-card-icon" />
          <h2>Membership Requests</h2>
        </Link>

        <Link to="/accepted-members" className="manage-card">
          <FaCheckCircle className="manage-card-icon" />
          <h2>Accepted Members</h2>
        </Link>

        <Link to="/events" className="manage-card">
          <FaCalendarAlt className="manage-card-icon" />
          <h2>Manage Events</h2>
        </Link>
      </div>
    </div>
  );
}

export default ManagePanel;
