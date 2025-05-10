import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faMessage, faMapMarkerAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './Posts.css';
import { useAuth } from '../../../Context/AuthContext';

const Posts = () => {
  const { authState } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});
  const [userData, setUserData] = useState({
    profileImage: '/uploads/profiles/profile.jpg',
    username: '',
    description: '',
    email: '',
    address: '',
    contactNumber: '',
  });

  const navigate = useNavigate();

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get('https://esabrahub.onrender.com/api/posts');
      const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);

      const initialLikedPosts = {};
      response.data.forEach(post => {
        initialLikedPosts[post._id] = post.likes.some(like => like.userId === 'currentUserId'); // Replace with actual user ID
      });
      setLikedPosts(initialLikedPosts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://esabrahub.onrender.com/api/users/profile', {
          headers: { Authorization: `Bearer ${authState.token}` },
        });
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
    fetchPosts();
  }, [authState.token, fetchPosts]);

  // Cleanup object URL if profileImage is a File
  useEffect(() => {
    if (userData.profileImage instanceof File) {
      const objectURL = URL.createObjectURL(userData.profileImage);
      return () => {
        URL.revokeObjectURL(objectURL);
      };
    }
  }, [userData.profileImage]);

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(`https://esabrahub.onrender.com/api/posts/${postId}/like`);
      const updatedPost = response.data;

      setLikedPosts(prev => ({
        ...prev,
        [postId]: !prev[postId],
      }));

      setPosts(prev =>
        prev.map(post => (post._id === postId ? { ...post, likes: updatedPost.likes } : post))
      );
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleChat = async (userId, postId) => {
    try {
      const conversationResponse = await axios.get(`https://esabrahub.onrender.com/api/chat/conversation/${postId}`);
      const conversationId = conversationResponse.data._id;
      navigate(`/chat/${conversationId}`);
    } catch (err) {
      console.error('Error handling chat:', err);
    }
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const Post = ({ _id, postType, user, text, photos = [], videos = [], location, backgroundColor, likes, caption }) => {
    const userName = user?.username || 'Unknown User';
    const userProfile = user?.profileImage || '/uploads/profiles/profile.jpg';
    const likeCount = Array.isArray(likes) ? likes.length : likes;
    const isLiked = likedPosts[_id] || false;

    const renderMedia = () => (
      <>
        {photos.length > 0 && (
          photos.length === 1 ? (
            <img src={`https://esabrahub.onrender.com/${photos[0]}`} alt="Post" className="media-image" />
          ) : (
            <div className="media-collage">
              {photos.map((img, i) => (
                <img key={i} src={`https://esabrahub.onrender.com/${img}`} alt={`Post ${i}`} className="media-image" />
              ))}
            </div>
          )
        )}
        {videos.map((video, i) => (
          <video key={i} controls className="media-video">
            <source src={`https://esabrahub.onrender.com/${video}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ))}
      </>
    );

    return (
      <div className="post">
        <div className="post-header">
          <img
            src={`https://esabrahub.onrender.com${userProfile}`}
            alt="User"
            className="user-profile"
            onClick={() => handleProfileClick(user._id)}
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
            <p className="post-content" style={{ fontSize: '16px' }}>{caption}</p>
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
        <Post key={post._id} {...post} />
      ))}
    </div>
  );
};

export default Posts;
