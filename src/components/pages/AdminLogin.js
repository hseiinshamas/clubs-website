import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import { FaUserShield } from 'react-icons/fa';
import axios from 'axios';

function AdminLogin() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', {
        name,
        password,
      });
      
      // Assuming the response contains a JWT token
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('clubId', res.data.clubId); // 👈 This is the missing piece!
      
        if (res.data.role === 'superadmin') {
          navigate('/super-admin-dashboard');
        } else {
          navigate('/admin-dashboard');
        }
      }
       else {
        alert('Login failed: Invalid credentials');
      }
    } catch (error) {
      console.error('Login error: ', error);
      alert('Login failed');
    }
  };

  return (
    <div className="admin-login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <FaUserShield size={60} color="#fff" style={{ margin: '0 auto 20px' }} />
        <h2>Admin Portal</h2>
        <div className="input-group">
          <label>Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="login-btn">Log In</button>
      </form>
    </div>
  );
}

export default AdminLogin;
