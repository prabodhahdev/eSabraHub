import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Ensure to create this CSS file for styling

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSideNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="open-btn" onClick={toggleSideNav}>
        &#9776; {/* This is the hamburger icon */}
      </button>
      <div className={`sidenav ${isOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSideNav}>
          &times;
        </button>
        <Link to="/accommodation" onClick={toggleSideNav}>Accommodation</Link>
        <Link to="/food-shop" onClick={toggleSideNav}>Food Shop</Link>
        <Link to="/transport" onClick={toggleSideNav}>Transport</Link>
        <Link to="/medical-centers" onClick={toggleSideNav}>Medical Centers</Link>
        <Link to="/attractive-places" onClick={toggleSideNav}>Attractive Places</Link>
        <Link to="/" onClick={toggleSideNav}>Create Post</Link>
      </div>
    </>
  );
};

export default NavBar;
