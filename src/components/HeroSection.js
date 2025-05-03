import React from 'react';
import { Button } from './Button';
import './HeroSection.css';
import '../App.css';

function HeroSection() {
  const role = localStorage.getItem('role'); // could be "admin", "superadmin", "student"

  return (
    <div className='hero-container'>
      <img src='/images/background.png' alt='Background' className='hero-image' />
      <h1>LIU CLUBS WEBSITE</h1>
      <p>Join Your Favorite Club Now!</p>

      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          to='/clubs'
        >
          GET STARTED
        </Button>

        {/* Only show login button if NOT logged in */}
        {!role && (
          <Button
            className='btns'
            buttonStyle='btn--outline'
            buttonSize='btn--large'
            to='/login-as-admin'
          >
            LOGIN AS ADMIN
          </Button>
        )}
      </div>
    </div>
  );
}

export default HeroSection;
