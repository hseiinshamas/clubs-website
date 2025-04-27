import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || (role !== 'admin' && role !== 'superadmin')) {
    return <Navigate to="/user-login" />;
  }

  return children;
}

export default ProtectedAdminRoute;
