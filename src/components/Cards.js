import './Cards.css';
import CardItem from './CardItem';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';

function Cards() {
  const [clubs, setClubs] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/clubs')
      .then(res => {
        setClubs(res.data);
      })
      .catch(err => {
        console.error('Error fetching clubs:', err);
      });
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className='cards'>
      <h1>Explore our clubs</h1>
      <div className='cards__scroll-container'>
        <button className='scroll-btn left' onClick={scrollLeft}>
          <FaChevronLeft />
        </button>
        <div className='cards__items-wrapper' ref={scrollRef}>
          <ul className="cards__items">
            {clubs.map(club => (
              <CardItem
                key={club.id}
                src={club.image_url || '/images/default-club.jpg'}
                text={club.name}
                label={club.label}
                path="/clubs"
              />
            ))}
          </ul>
        </div>
        <button className='scroll-btn right' onClick={scrollRight}>
          <FaChevronRight />
        </button>
      </div>

      {/* 🟢 Smooth section transition divider */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,0 C480,100 960,0 1440,100 L1440,0 L0,0 Z" fill="#f9f9f9"></path>
        </svg>
      </div>

      
    </div>
  );
}

export default Cards;
