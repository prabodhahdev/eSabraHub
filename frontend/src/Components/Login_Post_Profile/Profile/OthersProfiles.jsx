import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom'; // Import useParams to get the userId from the URL
import './Profile.css';

const OthersProfile = () => {
  const { userId } = useParams(); // Extract userId from the URL
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    profileImage: '/uploads/profiles/profile.jpg', // Set default image initially
    username: '',
    description: '',
    email: '',
    address: '',
    contactNumber: '',
  });

  // Fetch user details for another user based on userId
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/profile/${userId}`);
        setUserData({
          ...response.data,
          profileImage: response.data.profileImage || '/uploads/profiles/profile.jpg', // Set fallback image if not provided
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Construct the image URL based on the backend path
  const getProfileImageUrl = () => {
    if (userData.profileImage instanceof File) {
      const objectURL = URL.createObjectURL(userData.profileImage);
      return objectURL;
    }

    return userData.profileImage
      ? `http://localhost:5000${userData.profileImage}`
      : '/uploads/profiles/profile.jpg';
  };

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator while fetching data
  }

  return (
    <div className="profilepage-container">
      <div className="top-profile">
        <div className="profile-img-name-des">
          <div>
            <img
              src={getProfileImageUrl()}
              alt="Profile"
              className="profile-image"
            />
          </div>
          <div>
            <h2>{userData.username || 'No username available'}</h2>
          </div>
          <div>
            <p>{userData.description || 'No description available'}</p>
          </div>
        </div>
        <div className="profile-address-pn">
          <p>
            <FontAwesomeIcon icon={faHome} className="profileFontAswsomeicon" />
            {userData.address || 'No address provided'}
          </p>
          <p>
            <FontAwesomeIcon icon={faEnvelope} className="profileFontAswsomeicon" />
            {userData.email || 'No email provided'}
          </p>
          <p>
            <FontAwesomeIcon icon={faPhone} className="profileFontAswsomeicon" />
            {userData.contactNumber || 'No contact number provided'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OthersProfile;
