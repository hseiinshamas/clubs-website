import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [click, setClick] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [firstName, setFirstName] = useState(localStorage.getItem('firstName'));

  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 960 && click) setClick(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [click]);

  useEffect(() => {
    setUserRole(localStorage.getItem('role'));
    setFirstName(localStorage.getItem('firstName'));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setUserRole(null);
    setFirstName(null);
    navigate('/user-login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <img src="/images/liulogo.png" alt="LIU Logo" className="navbar-logo-img" />
          Clubs
        </Link>

        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>

        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMobileMenu}>
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/events" className="nav-links" onClick={closeMobileMenu}>
              Events
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/clubs" className="nav-links" onClick={closeMobileMenu}>
              Clubs
            </Link>
          </li>

          {(userRole === 'admin' || userRole === 'superadmin') && (
            <li className="nav-item">
              <Link to="/manage-panel" className="nav-links" onClick={closeMobileMenu}>
                Manage Panel
              </Link>
            </li>
          )}

          {(userRole || firstName) ? (
            <li className="nav-item">
              <span
                className="nav-links"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  closeMobileMenu();
                  handleLogout();
                }}
              >
                Logout
              </span>
            </li>
          ) : (
            <li className="nav-item">
              <Link to="/user-login" className="nav-login-button" onClick={closeMobileMenu}>
                Sign In / Sign Up
              </Link>
            </li>
          )}
        </ul>

        {userRole && (
          <span className="admin-greeting">
            👤 {userRole === 'admin' || userRole === 'superadmin' ? 'Admin' : firstName}
          </span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
