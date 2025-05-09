import React, { useState, useRef, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEnvelope, faPhone, faEdit } from '@fortawesome/free-solid-svg-icons';

import './Profile.css';
import { useAuth } from '../../../Context/AuthContext';

const Profile = () => {
  const { authState } = useAuth();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    profileImage: '/uploads/profiles/profile.jpg',
    username: '',
    description: '',
    email: '',
    address: '',
    contactNumber: '',
  });

  const fileInputRef = useRef(null);

  const openModal = () => {
    console.log('Opening modal');
    setModalIsOpen(true);
  };

  const closeModal = () => {
    console.log('Closing modal');
    setModalIsOpen(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Fetching user data');
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        console.log('User data fetched:', response.data);
        setUserData({
          ...response.data,
          profileImage: response.data.profileImage || '/uploads/profiles/profile.jpg',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [authState.token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setUserData({ ...userData, [name]: value });
  };

  const handleFileChange = (e) => {
    console.log('File changed:', e.target.files[0]);
    setUserData({ ...userData, profileImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (userData.profileImage instanceof File) {
        formData.append('profileImage', userData.profileImage);
      }
      formData.append('username', userData.username);
      formData.append('description', userData.description);
      formData.append('email', userData.email);
      formData.append('address', userData.address);
      formData.append('contactNumber', userData.contactNumber);

      console.log('Submitting form data:', formData);
      const response = await axios.put('http://localhost:5000/api/users/profile/edit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authState.token}`,
        },
      });

      console.log('Profile update response:', response.data);
      toast.success('Profile Updated');

      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }

      setUserData({
        ...response.data,
        profileImage: response.data.profileImage || '/uploads/profiles/profile.jpg',
      });
      closeModal();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // ✅ useCallback to avoid redefining on every render
  const getProfileImageUrl = useCallback(() => {
    if (userData.profileImage instanceof File) {
      const objectURL = URL.createObjectURL(userData.profileImage);
      console.log('Generated object URL for file:', objectURL);
      return objectURL;
    }

    const imageUrl = userData.profileImage
      ? `http://localhost:5000${userData.profileImage}`
      : '/uploads/profiles/profile.jpg';
    console.log('Using profile image URL:', imageUrl);
    return imageUrl;
  }, [userData.profileImage]);

  useEffect(() => {
    if (userData.profileImage instanceof File) {
      const objectURL = getProfileImageUrl();
      return () => {
        console.log('Revoking object URL:', objectURL);
        URL.revokeObjectURL(objectURL);
      };
    }
  }, [userData.profileImage, getProfileImageUrl]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profilepage-container">
      <div className="top-profile">
        <div className="profile-img-name-des">
          <div>
            <img
              src={getProfileImageUrl() || '/uploads/profiles/profile.jpg'}
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
        <button onClick={openModal}>
          <FontAwesomeIcon icon={faEdit} className="profileFontAswsomeicon-btn" /> Edit Details
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Profile Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <button onClick={closeModal} className="close-modal-button">
          X
        </button>
        <form onSubmit={handleSubmit}>
          <div className="profile-image-container" onClick={() => fileInputRef.current.click()}>
            <img src={getProfileImageUrl()} alt="Profile" className="modal-profile-image" />
            <p>Click to change profile image</p>
          </div>
          <input
            type="file"
            name="profileImage"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
            placeholder="Username"
          />
          <input
            type="text"
            name="description"
            value={userData.description}
            onChange={handleInputChange}
            placeholder="Description"
          />
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
          <input
            type="text"
            name="address"
            value={userData.address}
            onChange={handleInputChange}
            placeholder="Address"
          />
          <input
            type="text"
            name="contactNumber"
            value={userData.contactNumber}
            onChange={handleInputChange}
            placeholder="Contact Number"
          />
          <button type="submit">Save Changes</button>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
