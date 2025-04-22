import React from 'react'
import { Button } from './Button'
import './HeroSection.css'
import '../App.css' 



function HeroSection
() {
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
        to='/clubs' // or anywhere else you want "Get Started" to lead
>
  GET STARTED
</Button>


                {/* Button that leads to Login as Admin */}
                <Button
                    className='btns'
                    buttonStyle='btn--outline'
                    buttonSize='btn--large'
                    to='/login-as-admin'  // The destination should be /login-as-admin for "Login as Admin"
                >
                    LOGIN AS ADMIN
                </Button>

            </div>
    </div>
  )
}

export default HeroSection
