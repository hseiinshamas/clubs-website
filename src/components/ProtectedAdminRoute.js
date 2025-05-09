// src/components/ProtectedAdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isAdmin = token && (role === 'admin' || role === 'superadmin');

  return isAdmin ? children : <Navigate to="/user-login" />;
}

export default ProtectedAdminRoute;
