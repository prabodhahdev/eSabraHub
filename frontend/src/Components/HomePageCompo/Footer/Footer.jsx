import React, { useEffect, useState } from 'react';
import {  Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTwitter, faLinkedin, faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';
import logo from '../../../Assets/logo-eSabraHub.png';


const Footer = () => {
    const location = useLocation();
    const Navigate = useNavigate();
    const [targetSection, setTargetSection] = useState(null);

    const handleScrollToSection = (sectionId) => {
        if (location.pathname !== '/') {
          setTargetSection(sectionId);
          Navigate('/');
        } else {
          setTargetSection(sectionId);
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

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logo} alt="eSabraHub Logo" />
          <p>Sabaragamuwa University <br />Students,Staff,Villagers <br />Connection Hub</p>
        </div>
        <div className="footer-navigation">
         <h3>Quick Links</h3>
          <ul className="footer-nav">
            <li>
              <ScrollLink
                to="heroId"
                smooth={true}
                offset={-100}
                duration={500}
                onClick={() => handleScrollToSection('heroId')}
              >
                Home
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                to="aboutId"
                smooth={true}
                offset={-100}
                duration={500}
                onClick={() => handleScrollToSection('aboutId')}
              >
                About Us
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                to="contactId"
                smooth={true}
                offset={-100}
                duration={500}
                onClick={() => handleScrollToSection('contactId')}
              >
                Contact Us
              </ScrollLink>
            </li>
            <li>
              <RouterLink to="/login">Login</RouterLink>
            </li>
          </ul>
        </div>
        <div className="footer-services">
          {/* Services */}
          <h3>Services</h3>
          <ul className="footer-services-list">
            <li><RouterLink to="/accommodation">Accommodations</RouterLink></li>
            <li><RouterLink to="/transport">Transport</RouterLink></li>
            <li><RouterLink to="/food">Food Shops</RouterLink></li>
            <li><RouterLink to="/medicine">Medical Centers</RouterLink></li>
            <li><RouterLink to="/places">Attractions</RouterLink></li>
          </ul>
        </div>
        

        <div className="footer-social">
          <h3>Follow Us On</h3>
          <ul className="social-icons">
            <li><a href="https://example.com/"> <div className="social-icons-div"><FontAwesomeIcon icon={faFacebookF} /></div></a></li>
            <li><a href="https://example.com/"> <div className="social-icons-div"><FontAwesomeIcon icon={faInstagram} /></div></a></li>
            <li><a href="https://example.com/"> <div className="social-icons-div"><FontAwesomeIcon icon={faLinkedin} /></div></a></li>
            <li><a href="https://example.com/"> <div className="social-icons-div"><FontAwesomeIcon icon={faTwitter} /></div></a></li>

          </ul>
        </div>
      </div>
      <hr />
      <div className="footer-bottom">
        <p>&copy; 2024 eSabraHub. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
