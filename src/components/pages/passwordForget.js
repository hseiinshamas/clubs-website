import React, { useState } from 'react';
import './passwordForget.css'; // Optional if you want to style it
import { Link } from 'react-router-dom';

function PasswordForget() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message || data.error);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Something went wrong.');
    }
  };

  return (
    <div className="login-page-pro">
      <div className="login-card-pro">
        <h2>Forgot Password</h2>
        <p>Enter your email to receive a reset link.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>
        {message && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{message}</p>}
        <div style={{ marginTop: '20px' }}>
          <Link to="/user-login" style={{ color: '#00f', textDecoration: 'underline' }}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PasswordForget;
