import '../../App.css';
import HeroSection from '../HeroSection';
import React, { useEffect } from 'react';
import Cards from '../Cards';
import Footer from './Footer.js'; // Fixed import path
import './Home.css';

import AOS from 'aos';
import 'aos/dist/aos.css';

function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
      <HeroSection />

      <section className="about-preview">
        <div className="about-content">
          <div className="about-text" data-aos="fade-right">
            <h2>What is LIU Clubs?</h2>
            <p>
              LIU Clubs are more than just extracurriculars. They’re communities where students ignite their passions,
              lead real initiatives, and create memories that last far beyond graduation.
            </p>
          </div>
          <div className="about-image" data-aos="fade-left">
            <img src="/images/eventsgrad.jpg" alt="LIU Clubs" />
          </div>
        </div>
      </section>




      <Cards />
      <div className="footer-divider">
  <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
    <path d="M0,0 C480,100 960,0 1440,100 L1440,0 L0,0 Z" fill="#f9f9f9" />
  </svg>
</div>
<div className="footer-divider"></div>


      <Footer />
    </>
  );
}

export default Home;
