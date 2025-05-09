import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

import './App.css';
import ResetPassword from './components/pages/ResetPassword';

import Home from './components/pages/Home';
import AdminLogin from './components/pages/AdminLogin';
import ClubsPage from './components/pages/ClubsPage';
import EventsPage from './components/pages/EventsPage';
import EventForm from './components/pages/EventForm';

import ManagePanel from './components/pages/ManagePanel';
import ManageEventsPage from './components/pages/ManageEventsPage';
import ManageAdmins from './components/pages/ManageAdmins';
import ManageClubs from './components/pages/ManageClubs';
import EditClubDetails from './components/pages/EditClubDetails';
import SuperAdminDashboard from './components/pages/SuperAdminDashboard';
import AdminDashboard from './components/pages/AdminDashboard';
import AcceptedMembersPage from './components/pages/AcceptedMembersPage';
import MembershipRequestsPage from './components/pages/MembershipRequestsPage';
import UserLogin from './components/pages/UserLogin';
import UserSignup from './components/pages/UserSignup';
import EditEventPage from './components/pages/EditEventPage';
import PasswordForget from './components/pages/passwordForget';


const token = localStorage.getItem('token');
const expiration = localStorage.getItem('expiration');
const role = localStorage.getItem('role');

if (expiration && new Date().getTime() > parseInt(expiration)) {
  localStorage.clear();
  window.location.href = '/user-login';
}

// ✅ Only allow students or admins (with redirectBack)
const RequireUserOrAdmin = ({ children }) => {
  const studentId = localStorage.getItem('studentId');
  const role = localStorage.getItem('role');
  const isAllowed = studentId || role === 'admin' || role === 'superadmin';

  const currentPath = window.location.pathname;
  return isAllowed ? children : <Navigate to={`/user-login?redirectTo=${currentPath}`} />;
};

function App() {
  return (
    <GoogleOAuthProvider clientId="1095530784674-co9op5tm4eknjqqri9v8p0d0cbgi04jr.apps.googleusercontent.com">
      <Router>
        <Navbar />
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-signup" element={<UserSignup />} />
          <Route path="/login-as-admin" element={<AdminLogin />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/forgot-password" element={<PasswordForget />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          




          {/* Clubs page: requires student or admin */}
          <Route path="/clubs" element={<RequireUserOrAdmin><ClubsPage /></RequireUserOrAdmin>} />

        
          {/* Logged-in user routes */}
          <Route path="/accepted-members" element={<ProtectedRoute><AcceptedMembersPage /></ProtectedRoute>} />
          <Route path="/membership-requests" element={<ProtectedRoute><MembershipRequestsPage /></ProtectedRoute>} />
          <Route path="/manage-panel" element={<ProtectedRoute><ManagePanel /></ProtectedRoute>} />
          <Route path="/manage-events" element={<ProtectedRoute><ManageEventsPage /></ProtectedRoute>} />

          {/* Admin-only routes */}
          <Route path="/manage-clubs" element={<ProtectedAdminRoute><ManageClubs /></ProtectedAdminRoute>} />
          <Route path="/manage-admins" element={<ProtectedAdminRoute><ManageAdmins /></ProtectedAdminRoute>} />
          <Route path="/admin/manage-club/:id" element={<ProtectedAdminRoute><EditClubDetails /></ProtectedAdminRoute>} />
          <Route path="/events/new" element={<ProtectedAdminRoute><EventForm /></ProtectedAdminRoute>} />


          {/* Event editing */}
          <Route path="/events/edit/:id" element={<EditEventPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
