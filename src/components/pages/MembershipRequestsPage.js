// src/components/pages/MembershipRequestsPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import 'react-toastify/dist/ReactToastify.css';
import './MembershipRequestsPage.css'; // we'll style it next

function MembershipRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

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
      await axios.put(`http://localhost:5000/api/membership-requests/${id}/approve`);
      fetchRequests();
    } catch (error) {
      console.error('Error approving:', error);
    }
  };
  
  
  const handleReject = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/membership-requests/${id}`);
      if (response.status === 200) {
        setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
      }
    } catch (error) {
      console.error('Error rejecting:', error);
    }
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
                  <button className="btn-reject" onClick={() => handleReject(req.id)}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MembershipRequestsPage;
