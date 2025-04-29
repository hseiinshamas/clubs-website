import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './UserLogin.css'; 
import { GoogleLogin } from '@react-oauth/google';

function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('studentId', data.studentId);
        localStorage.setItem('role', data.role);
        localStorage.setItem('firstName', data.firstName);
        localStorage.setItem('lastName', data.lastName);
        localStorage.setItem('major', data.major);
  
        // ✅ NEW: Set expiration time (1 hour)
        const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour in milliseconds
        localStorage.setItem('expiration', expirationTime);
  
        navigate('/');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong');
    }
  };
  
  

  return (
    <div className="login-page-pro">
      <div className="login-card-pro">
       
        <h2>Welcome Back</h2>
        <p>Login to continue</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        {/* Sign Up Link */}
        <div style={{ marginTop: '15px' }}>
          <p>Don't have an account? 
            <Link to="/user-signup" style={{ color: '#00f', textDecoration: 'underline', marginLeft: '5px' }}>
              Sign up here
            </Link>
          </p>
        </div>

        {/* OR separator */}
        <div style={{ margin: '20px 0', fontWeight: 'bold', color: '#ccc', fontSize: '14px' }}>
          <p>OR</p>
        </div>

        {/* Google Login */}
        <div className="social-login">
          <GoogleLogin
            onSuccess={credentialResponse => {
              console.log(credentialResponse);
              alert('Google Login Successful!');
            }}
            onError={() => {
              console.log('Google Login Failed');
              alert('Google Login Failed');
            }}
          />
        </div>

      </div>
    </div>
  );
}

export default UserLogin;

