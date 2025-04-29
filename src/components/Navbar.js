import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import { Button } from './Button';

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [firstName, setFirstName] = useState(localStorage.getItem('firstName'));

  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    setButton(window.innerWidth > 960);
  };

  useEffect(() => {
    showButton();
    window.addEventListener('resize', showButton);
    return () => window.removeEventListener('resize', showButton);
  }, []);

  // 🔁 Re-check storage on every route change
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
    <>
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

            {(userRole || firstName) && (
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
            )}

            {!userRole && (
              <li className="nav-item">
                <Link to="/login-as-admin" className="nav-links-mobile" onClick={closeMobileMenu}>
                  Login As Admin
                </Link>
              </li>
            )}
          </ul>

          {/* Desktop Greeting or Button */}
          {button && (
            userRole === 'admin' || userRole === 'superadmin' ? (
              <span className="admin-greeting">👤 Admin</span>
            ) : userRole === 'student' && firstName ? (
              <span className="admin-greeting">👤 {firstName}</span>
            ) : (
              <Button buttonStyle="btn--outline" to="/login-as-admin">
                Login As Admin
              </Button>
            )
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
