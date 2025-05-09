import { Button } from './Button';
import './HeroSection.css';
import '../App.css';

function HeroSection() {
  const role = localStorage.getItem('role');

  return (
    <div className='hero-wrapper'>
      <video className='hero-video' autoPlay loop muted playsInline>
  <source src='/videos/clubshowcase.mp4' type='video/mp4' />
  Your browser does not support the video tag.
</video>

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

          
          
        </div>
      </div>
    </div>
  );
}

export default HeroSection;  