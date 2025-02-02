import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faPen, faMessage } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import { useNavigate, useLocation } from 'react-router-dom';
import CreatePost from '../CreatePost/CreatePost';
import { useAuth } from '../../../Context/AuthContext'; // Adjust the import path as needed
import './CreatePostNavBar.css';

// Set the app element for accessibility
Modal.setAppElement('#root');

const CreatePostNavBar = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { authState } = useAuth(); 

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToProfile = () => {
    navigate('/profile'); 
  };

  const scrollToTopOrNavigate = () => {
    if (location.pathname === '/posts') {
      scrollToTop();
    } else {
      navigate('/posts');
    }
  };

  const navigateToChat = () => {
    if (authState.user) {
      console.log('Authenticated User:', authState.user); // Log user data for debugging
      const userId = authState.user.id || authState.user._id; // Adjust according to user object structure

      if (userId) {
        navigate(`/chat/${userId}`);
      } else {
        console.error('User ID is undefined');
        // Optionally, handle the error, e.g., display a message to the user
      }
    } else {
      console.error('User is not authenticated');
      // Optionally, redirect to a login page or show an error message
    }
  };

  return (
    <>
      <nav className="create-post-nav">
        <ul>
          <li>
            <button className="nav-button" onClick={openModal}>
              <FontAwesomeIcon icon={faPen} />
            </button>
          </li>
          <li>
            <button className="nav-button" onClick={goToProfile}>
              <FontAwesomeIcon icon={faUser} />
            </button>
          </li>
          <li>
            <button className="nav-button" onClick={scrollToTopOrNavigate}>
              <FontAwesomeIcon icon={faHome} />
            </button>
          </li>
          <li>
            <button className="nav-button" onClick={navigateToChat}>
              <FontAwesomeIcon icon={faMessage} />
            </button>
          </li>
        </ul>
      </nav>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Create Post Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <button onClick={closeModal} className="close-modal-button">X</button>
        <CreatePost />
      </Modal>
    </>
  );
};

export default CreatePostNavBar;
