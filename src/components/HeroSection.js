import React from 'react';
import { Button } from './Button';
import './HeroSection.css';
import '../App.css';

function HeroSection() {
  const role = localStorage.getItem('role');

  return (
    <div className='hero-wrapper'>
      <img src='/images/homepagebackground.png' alt='Background' className='hero-image' />
      <div className='hero-overlay' />

      <div className='hero-container'>
        <h1>LIU CLUBS WEBSITE</h1>
        <p>Find Your People. Build Your Path</p>

        <div className='hero-btns'>
          <Button
            className='btns'
            buttonStyle='btn--outline'
            buttonSize='btn--large'
            to='/clubs'
          >
            GET STARTED
          </Button>

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
    </div>
  );
}

export default HeroSection;
