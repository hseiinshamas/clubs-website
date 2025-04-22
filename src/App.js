import React from 'react';
import Navbar from './components/Navbar'; 
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import './App.css'; 
import Home from './components/pages/Home';
import AdminLogin from './components/pages/AdminLogin';
import AdminDashboard from './components/pages/AdminDashboard';
import ClubsPage from './components/pages/ClubsPage';



function App() {
  return (
    <>
    <Router>
    <Navbar />  
    <Routes>
    <Route path="/" element={<Home />} /> 

  
      <Route path='/login-as-admin' element={<AdminLogin />} />
      <Route path='/admin-dashboard' element={<AdminDashboard />} />
      <Route path='/clubs' element={<ClubsPage />} />
      {/* Add more routes as needed */}
   
   
    </Routes>

    </Router>
    
    
    </>
 
      
    
  );
}

export default App;
