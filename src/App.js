import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import AcceptedMembersPage from './components/pages/AcceptedMembersPage';


import Home from './components/pages/Home';
import AdminLogin from './components/pages/AdminLogin';
import AdminDashboard from './components/pages/AdminDashboard';
import ClubsPage from './components/pages/ClubsPage';
import EventsPage from './components/pages/EventsPage';
import EventForm from './components/pages/EventForm';
import SuperAdminDashboard from './components/pages/SuperAdminDashboard';
import ManageAdmins from './components/pages/ManageAdmins';
import ManageClubs from './components/pages/ManageClubs';
import EditClubDetails from './components/pages/EditClubDetails';
import UserLogin from './components/pages/UserLogin';
import UserSignup from './components/pages/UserSignup';
import MembershipRequestsPage from './components/pages/MembershipRequestsPage';
import ManagePanel from './components/pages/ManagePanel'; // import it
import ProtectedAdminRoute from './components/ProtectedAdminRoute'; 


function App() {
  return (
    <>
      <GoogleOAuthProvider clientId="1095530784674-co9op5tm4eknjqqri9v8p0d0cbgi04jr.apps.googleusercontent.com">
        <Router>
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/user-login" element={<UserLogin />} />
            <Route path="/user-signup" element={<UserSignup />} />
            <Route path="/login-as-admin" element={<AdminLogin />} />

            <Route 
  path="/accepted-members" 
  element={
    <ProtectedRoute>
      <AcceptedMembersPage />
    </ProtectedRoute>
  } 
/>


            {/* Protected routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/clubs" 
              element={
                <ProtectedRoute>
                  <ClubsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/events" 
              element={
                <ProtectedRoute>
                  <EventsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/events/new" 
              element={
                <ProtectedRoute>
                  <EventForm />
                </ProtectedRoute>
              } 
            />
            {/* <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            /> */}
            {/* <Route 
              path="/super-admin-dashboard" 
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } 
            /> */}

<Route path="/manage-panel" element={<ManagePanel />} />
            <Route 
  path="/manage-clubs" 
  element={
    <ProtectedAdminRoute>
      <ManageClubs />
    </ProtectedAdminRoute>
  }
/>

<Route 
  path="/manage-admins" 
  element={
    <ProtectedAdminRoute>
      <ManageAdmins />
    </ProtectedAdminRoute>
  }
/>

<Route 
  path="/admin/manage-club/:id" 
  element={
    <ProtectedAdminRoute>
      <EditClubDetails />
    </ProtectedAdminRoute>
  }
/>

                <Route 
                  path="/membership-requests" 
                  element={
                    <ProtectedRoute>
                      <MembershipRequestsPage />
                    </ProtectedRoute>
                  } 
                />

            {/* Fallback: if route not found, redirect */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
