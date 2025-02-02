import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBus, faUtensils, faHospital, faMapMarkedAlt, faShareAlt, faComments, faMap, faBell } from '@fortawesome/free-solid-svg-icons';
import './Features.css';

const features = [
  {
    icon: faHome,
    title: 'Accommodation Details',
    description: 'Find information on available housing options, including rentals, hostels, and guesthouses.',
    color: '#3498db', 
  },
  {
    icon: faBus,
    title: 'Transport Details',
    description: 'Get updates on public transportation schedules, routes, and other travel options.',
    color: '#e12e29', 
  },
  {
    icon: faUtensils,
    title: 'Food Shops',
    description: 'Discover local food shops, restaurants, and markets catering to various dietary preferences.',
    color: '#2ecc71', 
  },
  {
    icon: faHospital,
    title: 'Medical Centers',
    description: 'Locate nearby medical facilities, clinics, and pharmacies for all your healthcare needs.',
    color: '#e74c3c', 
  },
  {
    icon: faMapMarkedAlt,
    title: 'Attractive Places',
    description: 'Explore popular tourist attractions and hidden gems within the community.',
    color: '#9b59b6', 
  },
  {
    icon: faShareAlt,
    title: 'Post Sharing',
    description: 'Share updates, announcements, and events with the community, fostering engagement and participation.',
    color: "#f39c12", 
  },
  {
    icon: faComments,
    title: 'Real-Time Chat',
    description: 'Communicate instantly with other users, making it easy to ask questions, seek recommendations, and build connections.',
    color: '#3498db', 
  },
  {
    icon: faMap,
    title: 'Google Maps Integration',
    description: 'Navigate the area with ease using our integrated map feature, providing precise locations and directions.',
    color: '#2ecc71', 
  },
  {
    icon: faBell,
    title: 'Real-Time Notifications',
    description: 'Stay informed with instant notifications about important updates, events, and messages.',
    color: '#e74c3c', 
  },
];

const FeaturesGrid = () => {
  return (
  <div className="features">
    <div className="features-text">
    <span>OUR</span><h1>FEATURES</h1> 
    </div>
    <div className="features-grid">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="feature-item"
        >
          <FontAwesomeIcon icon={feature.icon} className="feature-icon" style={{ color: feature.color }} />
          <h3 className="feature-title">{feature.title}</h3>
          <p className="feature-description">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
  );
};

export default FeaturesGrid;
