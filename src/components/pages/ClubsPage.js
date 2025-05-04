// src/components/pages/ClubsPage.js
import React, { useState, useEffect } from 'react';
import './ClubPage.css';
import axios from 'axios';
import { FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

function ClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [membershipStatuses, setMembershipStatuses] = useState({});
  const role = localStorage.getItem('role');

  const studentId = localStorage.getItem('studentId');
  const firstName = localStorage.getItem('firstName');
  const lastName = localStorage.getItem('lastName');
  const major = localStorage.getItem('major');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/clubs')
      .then((res) => setClubs(res.data))
      .catch((err) => console.error('Error fetching clubs:', err));

    if (studentId) {
      axios
        .get(`http://localhost:5000/api/membership-requests/student/${studentId}`)
        .then((res) => {
          const statuses = {};
          res.data.forEach((request) => {
            statuses[request.club_id] = request.status;
          });
          setMembershipStatuses(statuses);
        })
        .catch((err) => console.error('Error fetching membership statuses:', err));
    }
  }, [studentId]);

  const handleJoinClick = async (club) => {
    if (!firstName || !lastName || !major || !studentId) {
      alert('Missing user information. Please login again.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/membership-requests', {
        club_id: club.id,
        first_name: firstName,
        last_name: lastName,
        major: major,
        student_id: studentId,
      });

      // Instantly show Pending Approval
      setMembershipStatuses((prev) => ({
        ...prev,
        [club.id]: 'pending',
      }));

      alert('Request submitted! Awaiting approval.');
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request.');
    }
  };

  return (
    <div className="clubs-container">
      <h1>Our Clubs</h1>
      <div className="clubs-grid">
        {clubs.map((club) => (
          <div className="club-card" key={club.id}>
            <img src={club.image_url} alt={club.name} />

            <div className="club-title">
              <h2>{club.name}</h2>
              <FaInfoCircle
                data-tooltip-id={`tooltip-${club.id}`}
                data-tooltip-content={club.description}
                className="info-icon"
              />
              <Tooltip id={`tooltip-${club.id}`} place="top" className="custom-tooltip" />
            </div>

            {role !== 'admin' && role !== 'superadmin' && (
  <button
    className="btn-primary"
    onClick={() => handleJoinClick(club)}
    disabled={membershipStatuses[club.id] === 'pending' || membershipStatuses[club.id] === 'joined'}
  >
    {membershipStatuses[club.id] === 'pending'
      ? 'Pending Approval'
      : membershipStatuses[club.id] === 'joined'
      ? 'Joined'
      : 'Join Club'}
  </button>
)}

          </div>
        ))}
      </div>
    </div>
  );
}

export default ClubsPage;
