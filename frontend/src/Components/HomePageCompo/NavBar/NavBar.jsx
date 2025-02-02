import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-scroll';
import './NavBar.css';
import logo from '../../../Assets/logo-eSabraHub.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNavicon, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../Context/AuthContext'; // Import useAuth

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authState, logout } = useAuth(); 
  const [dropdown, setDropdown] = useState(false);
  const [targetSection, setTargetSection] = useState(null);
  const [sideNavOpen, setSideNavOpen] = useState(false);

  const handleMouseEnter = () => {
    setDropdown(true);
  };

  const handleMouseLeave = () => {
    setDropdown(false);
  };

  const handleLoginClick = () => {
    if (authState.user) {
      logout();
      navigate('/'); // Redirect to homepage after logout
    } else {
      navigate('/login');
    }
  };

  const handleServiceClick = (servicePath) => {
    navigate(servicePath);
    setSideNavOpen(false); // Close side navbar on link click
  };

  const handleScrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      setTargetSection(sectionId);
      navigate('/');
    } else {
      scrollToSection(sectionId);
    }
    setSideNavOpen(false); // Close side navbar on link click
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      const top = sectionElement.offsetTop + window.pageYOffset - 100;
      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (targetSection) {
      const sectionElement = document.getElementById(targetSection);
      if (sectionElement) {
        const top = sectionElement.offsetTop + window.pageYOffset - 100;
        window.scrollTo({
          top,
          behavior: 'smooth',
        });
      }
      setTargetSection(null);
    }
  }, [targetSection, location.pathname]);

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  return (
    <div className="navibar">
      <nav>
        <div className="logo" onClick={() => navigate('/')}>
          <img src={logo} alt="eSabraHub Logo" />
        </div>
        <ul className='display-none-navibar'>
          <li className="navlist">
            <Link
              to="heroId"
              smooth={true}
              offset={-100}
              duration={500}
              className="scrollLink"
              onClick={() => handleScrollToSection('heroId')}
            >
              Home
            </Link>
            <hr />
          </li>
          <li
            className="services"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Services
            {dropdown && (
              <ul className="dropdown">
                <li className="dropdownlist" onClick={() => handleServiceClick('/accommodation')}>
                  Accommodations
                </li>
                <li className="dropdownlist" onClick={() => handleServiceClick('/transport')}>
                  Transport
                </li>
                <li className="dropdownlist" onClick={() => handleServiceClick('/food')}>
                  Food Shops
                </li>
                <li className="dropdownlist" onClick={() => handleServiceClick('/medicine')}>
                  Medical Center
                </li>
                <li className="dropdownlist" onClick={() => handleServiceClick('/places')}>
                  Attractive Places
                </li>
              </ul>
            )}
          </li>
          <li className="navlist">
            <Link
              to="aboutId"
              smooth={true}
              offset={-100}
              duration={500}
              className="scrollLink"
              onClick={() => handleScrollToSection('aboutId')}
            >
              About Us
            </Link>
            <hr />
          </li>
          <li className="navlist">
            <Link
              to="contactId"
              smooth={true}
              offset={-100}
              duration={500}
              className="scrollLink"
              onClick={() => handleScrollToSection('contactId')}
            >
              Contact Us
            </Link>
            <hr />
          </li>
          <li>
            <button onClick={handleLoginClick}>
              {authState.user ? 'Logout' : 'Login'}
            </button>
          </li>
        </ul>
     
        <FontAwesomeIcon icon={faNavicon} className="navbar-icon" onClick={toggleSideNav} />
     
      </nav>
      <div className={`side-navbar ${sideNavOpen ? 'open' : ''}`}>
        <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={toggleSideNav} />
        <ul>
          <li onClick={() => handleScrollToSection('heroId')}>Home</li>
          <li onClick={() => handleServiceClick('/accommodation')}>Accommodations</li>
          <li onClick={() => handleServiceClick('/transport')}>Transport</li>
          <li onClick={() => handleServiceClick('/food')}>Food Shops</li>
          <li onClick={() => handleServiceClick('/medicine')}>Medical Center</li>
          <li onClick={() => handleServiceClick('/places')}>Attractive Places</li>
          <li onClick={() => handleScrollToSection('aboutId')}>About Us</li>
          <li onClick={() => handleScrollToSection('contactId')}>Contact Us</li>
          <li>
            <button onClick={handleLoginClick}>
              {authState.user ? 'Logout' : 'Login'}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
