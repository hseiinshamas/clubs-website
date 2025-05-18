
import React, { useState, useEffect } from 'react';
import './ClubPage.css';
import axios from 'axios';
import { FaInfoCircle, FaAngleDoubleDown } from 'react-icons/fa';
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

  const scrollToClubs = () => {
    const target = document.getElementById('clubs-section');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="clubs-container">
      <section className="clubs-hero-wrapper">
        <div className="clubs-hero-content">
          <h2>Join the Club, Shape Your Experience</h2>
          <p>
            At LIU, clubs are more than just activities — they’re where you grow, lead, and belong.<br />
            Click <strong>"Join Club"</strong>, and your request will be reviewed by the club admin for approval.
          </p>
          <button className="explore-button" onClick={scrollToClubs}>
            <FaAngleDoubleDown style={{ marginRight: '8px', animation: 'bounce 1.5s infinite' }} />
            Explore Clubs
          </button>
        </div>
        <div className="hero-curve">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,0 C480,100 960,0 1440,100 L1440,0 L0,0 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>


      <div className="club-video-wrapper">
  <video
    src="/videos/clubs-promo.mp4"
    autoPlay
    muted
    loop
    playsInline
    className="club-hero-video"
  ></video>

  <div className="video-overlay-text">
    <h2>Life at LIU in Motion</h2>
    <p>Discover vibrant events and student experiences waiting for you.</p>
  </div>
</div>






      <div id="clubs-section" className="clubs-header">
        <h2>Our Clubs</h2>
        <p>Discover your passion, connect with like-minded students, and make the most of your university life.</p>
      </div>

      <div className="clubs-grid">
        {clubs.map((club) => (
          <div className="club-card" key={club.id}>
            <img src={club.image_url} alt={club.name} />
            <div className="club-title">
  <span className="club-name">{club.name}</span>
  <FaInfoCircle
    data-tooltip-id={`tooltip-${club.id}`}
    data-tooltip-content={club.description}
    className="info-icon"
  />
  <Tooltip 
  id={`tooltip-${club.id}`} 
  place="top" 
  className="custom-tooltip"
  style={{ zIndex: 9999 }}
/>

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