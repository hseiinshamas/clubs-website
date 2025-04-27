// src/components/pages/AcceptedMembersPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MembershipRequestsPage.css'; // ✅ reuse same styles

function AcceptedMembersPage() {
  const [acceptedMembers, setAcceptedMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAcceptedMembers();
  }, []);

  const fetchAcceptedMembers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/membership-requests/accepted');
      setAcceptedMembers(res.data);
    } catch (error) {
      console.error('Error fetching accepted members:', error);
    }
    setLoading(false);
  };

  return (
    <div className="requests-container">
      <h1>Accepted Members</h1>

      {loading ? (
        <p>Loading accepted members...</p>
      ) : acceptedMembers.length === 0 ? (
        <p>No accepted members yet.</p>
      ) : (
        <table className="requests-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Major</th>
              <th>Student ID</th>
              <th>Club</th>
            </tr>
          </thead>
          <tbody>
            {acceptedMembers.map((member) => (
              <tr key={member.id}>
                <td>{member.first_name}</td>
                <td>{member.last_name}</td>
                <td>{member.major}</td>
                <td>{member.student_id}</td>
                <td>{member.club_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AcceptedMembersPage;
