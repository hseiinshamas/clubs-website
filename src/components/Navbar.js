import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { Button } from './Button';

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const navigate = useNavigate();
  const role = localStorage.getItem('role'); // ✅ Get user role

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
    window.addEventListener('resize', showButton);

    return () => {
      window.removeEventListener('resize', showButton);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
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

            {/* ✅ ONLY show Manage Panel if Admin or Superadmin */}
            {(role === 'admin' || role === 'superadmin') && (
              <li className="nav-item">
                <Link to="/manage-panel" className="nav-links" onClick={closeMobileMenu}>
                  Manage Panel
                </Link>
              </li>
            )}

            {/* Logout Button Always */}
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

            {/* Login as Admin (Mobile View) */}
            <li className="nav-item">
              <Link to="/login-as-admin" className="nav-links-mobile" onClick={closeMobileMenu}>
                Login As Admin
              </Link>
            </li>
          </ul>

          {/* Desktop View Admin Button */}
          {button && (
            <Button buttonStyle="btn--outline" to="/login-as-admin">
              Login As Admin
            </Button>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
