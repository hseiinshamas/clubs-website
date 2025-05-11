import React, { useState, useEffect } from 'react';
import './ClubPage.css';
import axios from 'axios';
import { FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import { useNavigate } from 'react-router-dom';

function ClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [membershipStatuses, setMembershipStatuses] = useState({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);

  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  const studentId = localStorage.getItem('studentId');
  const firstName = localStorage.getItem('firstName');
  const lastName = localStorage.getItem('lastName');
  const major = localStorage.getItem('major');

  useEffect(() => {
    axios.get('http://localhost:5000/api/clubs')
      .then((res) => setClubs(res.data))
      .catch((err) => console.error('Error fetching clubs:', err));

    if (studentId) {
      axios.get(`http://localhost:5000/api/membership-requests/student/${studentId}`)
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

  const handleLeaveClub = async (clubId) => {
    try {
      await axios.delete(`http://localhost:5000/api/membership-requests/leave/${studentId}/${clubId}`);
      setMembershipStatuses(prev => {
        const updated = { ...prev };
        delete updated[clubId];
        return updated;
      });
      alert('You left the club.');
    } catch (error) {
      console.error('Error leaving club:', error);
      alert('Failed to leave the club.');
    }
  };

  const handleJoinClick = (club) => {
    if (!studentId) {
      setSelectedClub(club);
      setShowLoginModal(true);
      return;
    }

    if (!firstName || !lastName || !major) {
      alert('Missing user information. Please login again.');
      return;
    }

    submitJoinRequest(club);
  };

  const submitJoinRequest = async (club) => {
    try {
      await axios.post('http://localhost:5000/api/membership-requests', {
        club_id: club.id,
        first_name: firstName,
        last_name: lastName,
        major: major,
        student_id: studentId,
      });

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

  const handleLoginConfirm = () => {
    navigate('/user-login?redirectTo=/clubs');
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
              <>
                {membershipStatuses[club.id] === 'joined' ? (
                  <div className="joined-leave-wrap">
                    <span className="joined-label">Joined</span>
                    <button className="btn-danger leave-btn" onClick={() => handleLeaveClub(club.id)}>
                      Leave
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={() => handleJoinClick(club)}
                    disabled={membershipStatuses[club.id] === 'pending'}
                  >
                    {membershipStatuses[club.id] === 'pending' ? 'Pending Approval' : 'Join Club'}
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* ✅ Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>You must be logged in to join a club</h3>
            <p>Do you want to login now?</p>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleLoginConfirm}>Yes, Login</button>
              <button className="btn-cancel" onClick={() => setShowLoginModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClubsPage;
