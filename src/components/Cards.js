
import './Cards.css';
import CardItem from './CardItem';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Import icons
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';

function Cards() {
  const [clubs, setClubs] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Fetch the club data from the backend
    axios.get('http://localhost:5000/api/clubs')
      .then(res => {
        setClubs(res.data); // Store clubs in state
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
            {/* Dynamically render CardItem components */}
            {clubs.map(club => (
              <CardItem
                key={club.id} // Unique key for each CardItem
                src={club.image_url || '/images/default-club.jpg'} // Default image if no image_path
                text={club.name}
                label={club.label}
                path="/clubs" // Dynamic path for each club, latr you can change it to club.id or any other identifier and create a clubdetailspage
              />
            ))}
          </ul>
        </div>
        <button className='scroll-btn right' onClick={scrollRight}>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}

export default Cards;