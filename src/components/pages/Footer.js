import './Footer.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const eventData = [
  { title: 'Graduation Ceremony', src: '/images/event1.JPG' },
  { title: 'Annual Music Fest', src: '/images/event2.jpg' },
  { title: 'Award Distribution Day', src: '/images/event3.jpg' },
  { title: 'Balloon Celebration', src: '/images/event4.JPG' },
  { title: 'Welcome Party', src: '/images/event5.jpg' },
  { title: 'Orientation Day', src: '/images/event6.jpg' },
  { title: 'Art Showcase', src: '/images/event7.JPG' },
  { title: 'Volunteer Fair', src: '/images/event8.jpg' },
  { title: 'Graduation Theatre', src: '/images/event9.JPG' },
  { title: 'Cultural Performance', src: '/images/event10.JPG' },
];

function Footer() {
  const [showAll, setShowAll] = useState(false);

  const visibleEvents = showAll ? eventData : eventData.slice(0, 3);

  return (
    <>
      <footer className="footer">
        <h2 className="footer-title">Past Events Highlights</h2>
        <div className="gallery-container">
          {visibleEvents.map((event, index) => (
            <div className="gallery-card" key={index}>
              <img src={event.src} alt={event.title} className="gallery-image" />
              <div className="gallery-caption">{event.title}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        </div>
      </footer>

      <div className="contact-footer">
        <div className="contact-footer-content">
          <div className="contact-title">Contact Details</div>
          <p>Student Activities Department</p>
          <p>Lebanese International University</p>
          <p>Beirut Campus</p>
          <p>Email: <a href="mailto:clubs@liu.edu.lb">clubs@liu.edu.lb</a></p>
          <p>Phone: +961 1 234 567</p>
        </div>

        <div className="footer-bottom-note">
          &copy; {new Date().getFullYear()} LIU Clubs – All rights reserved.
          <span style={{ marginLeft: '10px' }}>
            <Link to="/login-as-admin" className="admin-footer-link">Admin Access</Link>
          </span>
        </div>
      </div>
    </>
  );
}

export default Footer;
