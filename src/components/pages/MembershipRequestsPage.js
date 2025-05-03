import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MembershipRequestsPage.css';

function MembershipRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/membership-requests/pending');
      setRequests(res.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/email/approve/${id}`);
      fetchRequests();
    } catch (error) {
      console.error('Error approving:', error);
    }
  };

  const openRejectModal = (id) => {
    setRejectingId(id);
    setRejectReason('');
  };

  const handleRejectSubmit = async () => {
    console.log('Sending rejection request...');
    console.log({ id: rejectingId, reason: rejectReason });
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason.');
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/email/reject/${rejectingId}`, {
        reason: rejectReason
      });
      setRejectingId(null);
      fetchRequests();
    } catch (error) {
      console.error('Error rejecting:', error);
    }
  };

  const handleCancelReject = () => {
    setRejectingId(null);
    setRejectReason('');
  };

  return (
    <div className="requests-container">
      <h1>Membership Requests</h1>

      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No pending membership requests.</p>
      ) : (
        <table className="requests-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Major</th>
              <th>Student ID</th>
              <th>Club</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.first_name}</td>
                <td>{req.last_name}</td>
                <td>{req.major}</td>
                <td>{req.student_id}</td>
                <td>{req.club_name}</td>
                <td>
                  <button className="btn-approve" onClick={() => handleApprove(req.id)}>
                    Approve
                  </button>
                  <button className="btn-reject" onClick={() => openRejectModal(req.id)}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {rejectingId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Reject Request</h2>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason"
              rows={4}
            />
            <div className="modal-buttons">
            <button type="button" className="btn-cancel" onClick={handleCancelReject}>Cancel</button>

              <button type="button" className="btn-submit" onClick={handleRejectSubmit}>Send Rejection</button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MembershipRequestsPage;
