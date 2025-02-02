import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faVideo, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import EmojiPicker from 'emoji-picker-react';
import { useAuth } from '../../../Context/AuthContext';
import axios from 'axios';
import {toast} from 'react-toastify'
import './UpdatePost.css';
import LocationInput from '../../Map/LocationInput';


const UpdatePost = ({ post, onClose, onSave = () => {} }) => {
  const { authState } = useAuth();
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [location, setLocation] = useState('');
  const [caption, setCaption] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [postType, setPostType] = useState('text');
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);

  useEffect(() => {
    if (post) {
      setText(post.text || '');
      setPhotos(post.photos || []);
      setVideos(post.videos || []);
      setLocation(post.location || '');
      setCaption(post.caption || '');
      setBackgroundColor(post.backgroundColor || '#ffffff');
      setPostType(post.postType || 'text');
    }
  }, [post]);

  useEffect(() => {
    const newPhotoPreviews = photos.map(photo => {
      if (typeof photo === 'string') {
        return `http://localhost:5000/${photo}`;
      } else if (photo instanceof File) {
        return URL.createObjectURL(photo);
      }
      return null;
    }).filter(url => url !== null);

    const newVideoPreviews = videos.map(video => {
      if (typeof video === 'string') {
        return `http://localhost:5000/${video}`;
      } else if (video instanceof File) {
        return URL.createObjectURL(video);
      }
      return null;
    }).filter(url => url !== null);

    setPhotoPreviews(newPhotoPreviews);
    setVideoPreviews(newVideoPreviews);

    return () => {
      newPhotoPreviews.forEach(url => URL.revokeObjectURL(url));
      newVideoPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [photos, videos]);

  const handleTextChange = (e) => setText(e.target.value);
  
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files); // Replace the current photos with new ones
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setVideos(files); // Replace the current videos with new ones
  };

  const handleLocationChange = (e) => setLocation(e.target.value);
  const handleCaptionChange = (e) => setCaption(e.target.value);
  const handleBackgroundColorChange = (color) => setBackgroundColor(color);

  const handleEmojiClick = (emojiObject) => {
    setText(prevText => prevText + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handlePostTypeChange = (type) => {
    setPostType(type);
    if (type === 'text') {
      setPhotos([]);
      setVideos([]);
      setLocation('');
    } else if (type === 'media') {
      setText('');
      setBackgroundColor('#ffffff');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('text', text);
    formData.append('location', location);
    formData.append('caption', caption);
    formData.append('backgroundColor', backgroundColor);
    formData.append('postType', postType);
  
    // Append media files
    photos.forEach(photo => formData.append('photos', photo));
    videos.forEach(video => formData.append('videos', video));
  
    try {
      const response = await axios.put(`http://localhost:5000/api/posts/${post._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authState.token}`
        }
      });
  
      if (response.status === 200) {
        toast.success("Post updated successfully!")
        
        onSave(); // Notify parent component, default to no-op
      } else {
        console.error('Unexpected response:', response);
        alert('Error updating post. Please try again.');
        toast.error("Error updating post. Please try again")
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error("Error Updating")
    }
  };
  const handleLocationSelect = (location) => {
    setLocation(location); 
  };
  
  

  return (
    <div className="update-post">
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
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </label>
        </div>

{/* Display the LocationInput map below the media buttons */}
          <div className="location-map-container">
            <LocationInput 
              onLocationSelect={handleLocationSelect} 
              currentLocation={location} // Pass current location to the component
            />
          </div>

            {photoPreviews.map((url, index) => (
              <div key={index} className="photo-preview">
                <img src={url} alt="Preview" />
              </div>
            ))}
            {videoPreviews.map((url, index) => (
              <div key={index} className="video-preview">
                <video controls>
                  <source src={url} type="video/mp4" />
                  console.log("video preview")
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </>
        )}

        <button type="submit" className="submit-button">Update Post</button>
      </form>
    </div>
  );
};

export default UpdatePost;
