import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faMessage, faMapMarkerAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './Posts.css';
import { useAuth } from '../../../Context/AuthContext'; // Adjust the path as needed

const Posts = () => {
  const { authState } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});
  const [userData, setUserData] = useState({
    profileImage:'/uploads/profiles/profile.jpg', // Set default image initially
    username: '',
    description: '',
    email: '',
    address: '',
    contactNumber: '',
  });

  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch and sort posts by creation time
  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts');
      const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by creation time
      setPosts(sortedPosts);

      // Initialize likedPosts state
      const initialLikedPosts = {};
      response.data.forEach(post => {
        initialLikedPosts[post._id] = post.likes.some(like => like.userId === 'currentUserId'); // Adjust 'currentUserId' as needed
      });
      setLikedPosts(initialLikedPosts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Fetching user data');
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${authState.token}`, // Use the token from AuthContext
          },
        });
        console.log('User data fetched:', response.data);
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
    fetchUserData();
    fetchPosts();
  }, [authState.token, fetchPosts]);

  // Construct the image URL based on the backend path
  const getProfileImageUrl = () => {
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
  };

  // Clean up URL.createObjectURL resources
  useEffect(() => {
    if (userData.profileImage instanceof File) {
      const objectURL = getProfileImageUrl();
      return () => {
        console.log('Revoking object URL:', objectURL);
        URL.revokeObjectURL(objectURL);
      };
    }
  }, [userData.profileImage]);

  const handleLike = async (postId) => {
    if (!postId) {
      console.error('Post ID is missing');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${postId}/like`);
      const updatedPost = response.data;

      setLikedPosts(prevLikedPosts => ({
        ...prevLikedPosts,
        [postId]: !prevLikedPosts[postId]
      }));

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId ? { ...post, likes: updatedPost.likes } : post
        )
      );
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleNewPost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]); // Add the new post to the top
  };

  const handleChat = async (userId, postId) => {
    try {
      // Step 1: Get or create a conversation for the given post
      const conversationResponse = await axios.get(`http://localhost:5000/api/chat/conversation/${postId}`);
      const conversationId = conversationResponse.data._id;
  
      // Step 2: Navigate to the chat page with the user ID
      navigate(`/chat/${userId}`);
    } catch (err) {
      console.error('Error handling chat:', err);
    }
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`); // Navigate to the user profile page
  };

  const Post = ({ _id, postType, user, text, photos, videos, location, backgroundColor, likes, caption }) => {
    const userName = user?.username || 'Unknown User';
    const userProfile = user?.profileImage || 'https://via.placeholder.com/50';

    const likeCount = Array.isArray(likes) ? likes.length : likes;
    const isLiked = likedPosts[_id] || false;

    const renderMedia = () => (
      <div>
        {photos.length === 1 ? (
          <img src={`http://localhost:5000/${photos[0]}`} alt="Post Media" className="media-image" />
        ) : (
          <div className="media-collage">
            {photos.map((item, index) => (
              <img key={index} src={`http://localhost:5000/${item}`} alt={`Post Media ${index}`} className="media-image" />
            ))}
          </div>
        )}
        {videos.map((video, index) => (
          <video key={index} controls className="media-video">
            <source src={`http://localhost:5000/${video}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ))}
      </div>
    );

    return (
      <div className="post">
        <div className="post-header">
          <img
            src={`http://localhost:5000${userProfile}`} 
            alt="Profile"
            className="user-profile"
            onClick={() => handleProfileClick(user._id)} // Add onClick handler
          />
          <div className="user-info">
            <span className="user-name">{userName}</span>
          </div>
          {location && (
  <div className="post-location">
    <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
    <span 
      className="location-name" 
      onClick={() => window.open(`https://www.google.com/maps?q=${encodeURIComponent(location)}`, '_blank')}
      style={{ cursor: 'pointer', color: 'green' }}
    >
      {location}
    </span>
    <FontAwesomeIcon icon={faUserPlus} className="follow-icon" />
  </div>
)}

        </div>

        {postType === 'text' && (
          <div className="text-post" style={{ backgroundColor: backgroundColor || '#f0f0f0' }}>
            <p className="text-content">{text}</p>
          </div>
        )}

        {postType === 'media' && (
          <div className="media-gallery">
            <p className="post-content">{caption}</p>
            {renderMedia()}
          </div>
        )}

        <div className="post-footer">
          <div className="post-actions">
            <div className="post-actions-icons-div" onClick={() => handleLike(_id)}>
              <FontAwesomeIcon icon={faHeart} className={`like-icon ${isLiked ? 'liked' : ''}`} />
              <span className="likes-count">{likeCount} Likes</span>
            </div>
            <div className="post-actions-icons-div" onClick={() => handleChat(user._id, _id)}>
              <FontAwesomeIcon icon={faMessage} className="share-icon" />
              <span className="likes-count">Chat</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="posts-container">
      {posts.map((post) => (
        <Post
          key={post._id}
          _id={post._id}
          postType={post.postType}
          user={post.user}
          text={post.text}
          photos={post.photos}
          videos={post.videos}
          location={post.location}
          backgroundColor={post.backgroundColor}
          caption={post.caption}
          likes={post.likes}
        />
      ))}
    </div>
  );
};

export default Posts;
