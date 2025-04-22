import React , {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import './Navbar.css';
import { Button } from './Button';


function Navbar
() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    const handleClick = () => setClick(!click) // this is a function that toggles the value of click
    const closeMobileMenu = () => setClick(false) // this is a function that sets the value of click to false   
    const showButton = () => { // this is a function that sets the value of button
        if(window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    };

    useEffect(() => { // this is a function that runs the showButton function
        showButton();
    }, []);

    window.addEventListener('resize', showButton); // this listens for a resize event on the window

  return (
  <>
    <nav className="navbar">
    <div className="navbar-container">
    <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
    Clubs <i className="fab fa-typo3" /> 
    
                 </Link>
                    <div className="menu-icon" onClick={handleClick}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                    </div>
                    <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className='nav-item'>
                    <Link to='/' className='nav-links' onClick={closeMobileMenu}> Home 
                    </Link> 
                    </li>

                    <li className='nav-item'>
                    <Link to='/events' className='nav-links' onClick={closeMobileMenu}> Events 
                    </Link> 
                    </li>
                    <li className='nav-item'>
                    <Link to='/clubs' className='nav-links' onClick={closeMobileMenu}> Clubs 
                    </Link> 
                    </li>

                    <li className='nav-item'>
                    <Link to='/login-as-admin' className='nav-links-mobile' onClick={closeMobileMenu}> Login As Admin 
                    </Link> 
                    </li>
                    </ul>
                    {button && <Button buttonStyle='btn--outline' to='/login-as-admin'>Login As Admin</Button>}
            </div>
        </nav>
    </>
  );
}

export default Navbar; // this exports the Navbar component
    