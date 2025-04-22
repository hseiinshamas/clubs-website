import React from 'react';
import './ClubPage.css';
import { Button } from '../Button'; // Adjust the import path as needed

const clubsData = [
  {
    name: 'Pharmacy Club',
    image: '/images/img-19.jpg',
    description: 'Join us for jam sessions, open mics, and music production workshops.'
  },
  {
    name: 'Theatre Club',
    image: '/images/img-12.jpg',
    description: 'We care for animals on and off campus. Join our awareness and rescue drives.'
  },
  {
    name: 'Music Club',
    image: '/images/img-11.jpg',
    description: 'Capture moments and learn professional photography tips with us.'
  },
  {
    name: 'Book Club',
    image: '/images/book-club.jpg',
    description: 'Dive into books, hold reading sessions, and share literary discussions.'
  }
];

function ClubsPage() {
  return (
    <div className="clubs-container">
      <h1>Our Clubs</h1>
      <div className="clubs-grid">
        {clubsData.map((club, index) => (
          <div className="club-card" key={index}>
            <img src={club.image} alt={club.name} />
            <h2>{club.name}</h2>
            <p>{club.description}</p>
            <Button 
              buttonStyle='btn--primary' 
              buttonSize='btn--medium'
              to='/join-request' // you can set this to your request form page
            >
              Join Club
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClubsPage;
