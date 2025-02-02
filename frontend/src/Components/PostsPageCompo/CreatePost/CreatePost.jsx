import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faVideo, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import EmojiPicker from 'emoji-picker-react';
import { useAuth } from '../../../Context/AuthContext'; // Import the useAuth hook
import axios from 'axios';
import {toast} from 'react-toastify'
import LocationInput from '../../Map/LocationInput'; // Import your LocationInput component
import './CreatePost.css';

const CreatePost = () => {
  const { authState } = useAuth(); 
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [location, setLocation] = useState(''); 
  const [caption, setCaption] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [postType, setPostType] = useState('text');
  const [showLocationInput, setShowLocationInput] = useState(false); // State to control visibility of LocationInput

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos((prevPhotos) => [...prevPhotos, ...files]);
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setVideos((prevVideos) => [...prevVideos, ...files]);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color);
  };

  const handleEmojiClick = (emojiObject) => {
    setText((prevText) => prevText + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handlePostTypeChange = (type) => {
    setPostType(type);
    setText('');
    setPhotos([]);
    setVideos([]);
    setLocation('');
    setCaption('');
  };

  const handleLocationSelect = (address, coordinates) => {
    setLocation(address); // Set the selected address
    setShowLocationInput(false); // Hide the location input map after selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('text', text);
    formData.append('location', location);
    formData.append('caption', caption);
    formData.append('backgroundColor', backgroundColor);
    formData.append('postType', postType);

    photos.forEach(photo => formData.append('photos', photo));
    videos.forEach(video => formData.append('videos', video));

    try {
      const response = await axios.post('http://localhost:5000/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authState.token}`
        }
      });

      console.log('Post created successfully:', response.data);
      toast.success("Post created successfully")
      setText('');
      setPhotos([]);
      setVideos([]);
      setLocation('');
      setCaption('');
      setBackgroundColor('#ffffff');
      setPostType('text');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error("Error creating post. Please try again")
    }
  };

  return (
    <div className="create-post">
      <div className="post-type-selector">
        <button
          className={`post-type-button ${postType === 'text' ? 'active' : ''}`}
          onClick={() => handlePostTypeChange('text')}
          style={{ backgroundColor: postType === 'text' ? '#dd7413' : '' }}
        >
          Text Post
        </button>
        <button
          className={`post-type-button ${postType === 'media' ? 'active' : ''}`}
          onClick={() => handlePostTypeChange('media')}
          style={{ backgroundColor: postType === 'media' ? '#dd7413' : '' }}
        >
          Media Post
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {postType === 'text' && (
          <>
            <div className="text-area-container" style={{ backgroundColor }}>
              <textarea
                placeholder="Write something..."
                value={text}
                onChange={handleTextChange}
                required
                style={{ backgroundColor }}
              />
            </div>

            <div className="background-options">
              <button type="button" className="emoji-button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                😊
              </button>
              <div className="background-colors">
                <button type="button" onClick={() => handleBackgroundColorChange('#ffffff')} style={{ backgroundColor: '#ffffff' }}></button>
                <button type="button" onClick={() => handleBackgroundColorChange('#ffebcd')} style={{ backgroundColor: '#ffebcd' }}></button>
                <button type="button" onClick={() => handleBackgroundColorChange('#add8e6')} style={{ backgroundColor: '#add8e6' }}></button>
                <button type="button" onClick={() => handleBackgroundColorChange('#98fb98')} style={{ backgroundColor: '#98fb98' }}></button>
                <button type="button" onClick={() => handleBackgroundColorChange('#ffe4e1')} style={{ backgroundColor: '#ffe4e1' }}></button>
                <button type="button" onClick={() => handleBackgroundColorChange('#2c3e50')} style={{ backgroundColor: '#2c3e50' }}></button>
                <button type="button" onClick={() => handleBackgroundColorChange('#34495e')} style={{ backgroundColor: '#34495e' }}></button>
              </div>
            </div>

            {showEmojiPicker && <div className="emoji-picker-container"><EmojiPicker onEmojiClick={handleEmojiClick} /></div>}
          </>
        )}

        {postType === 'media' && (
          <>
            <div className="caption-container">
              <input
                type="text"
                placeholder="Enter Your Caption Here..."
                value={caption}
                onChange={handleCaptionChange}
              />
            </div>
            <div className="media-buttons">
              <label className="media-button">
                <FontAwesomeIcon icon={faCamera} />
                <input type="file" multiple accept="image/*" onChange={handlePhotoChange} />
              </label>
              <label className="media-button">
                <FontAwesomeIcon icon={faVideo} />
                <input type="file" multiple accept="video/*" onChange={handleVideoChange} />
              </label>
              <label className="media-button">
                <FontAwesomeIcon icon={faMapMarkerAlt} className='famapmarkeralt' onClick={() => setShowLocationInput(!showLocationInput)} />
              </label>
            </div>

            {photos.map((photo, index) => (
              <div key={index} className="photo-preview">
                <img src={URL.createObjectURL(photo)} alt="Preview" />
              </div>
            ))}

            {videos.map((video, index) => (
              <div key={index} className="video-preview">
                <video controls>
                  <source src={URL.createObjectURL(video)} />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}

            {/* Display the selected location below the icons */}
            {location && (
              <div className="selected-location">
                <p><FontAwesomeIcon icon={faMapMarkerAlt} ></FontAwesomeIcon> {location}</p>
              </div>
            )}
          </>
        )}

        {showLocationInput && (
          <LocationInput onLocationSelect={handleLocationSelect} /> 
        )}

        <button type="submit" className='createpost-btn'>Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
