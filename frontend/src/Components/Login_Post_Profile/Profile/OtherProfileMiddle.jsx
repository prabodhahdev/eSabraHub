import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../Context/AuthContext';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const OtherProfileMiddle = () => {
  const { authState } = useAuth();
  const { userId } = useParams();
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

  const fetchPosts = useCallback(async () => {
    if (!userId) {
      setError('User ID is not available');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/posts/user/${userId}`);
      const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const initialLikedPosts = {};
      response.data.forEach(post => {
        initialLikedPosts[post._id] = post.likes.some(like => like.userId === authState.user._id);
      });
      setLikedPosts(initialLikedPosts);

      setPosts(sortedPosts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, authState]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/profile/${userId}`, {
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

  useEffect(() => {
    fetchUserData();
  }, [authState.token, userId]);

  const getProfileImageUrl = () => userData.profileImage
    ? `http://localhost:5000${userData.profileImage}`
    : '/uploads/profiles/profile.jpg';

  const likePost = async (postId) => {
    if (likedPosts[postId]) {
      await axios.delete(`http://localhost:5000/api/posts/unlike/${postId}`, { headers: { Authorization: `Bearer ${authState.token}` } });
      setLikedPosts({ ...likedPosts, [postId]: false });
    } else {
      await axios.post(`http://localhost:5000/api/posts/like/${postId}`, {}, { headers: { Authorization: `Bearer ${authState.token}` } });
      setLikedPosts({ ...likedPosts, [postId]: true });
    }
  };

  const Post = ({ _id, postType, user, text, photos, videos, location, backgroundColor, likes, caption }) => {
    const userName = user?.username || 'Unknown User';
    const likeCount = Array.isArray(likes) ? likes.length : likes;
    const isLiked = likedPosts[_id] || false;

    const renderMedia = () => {
      if (photos.length === 0 && videos.length === 0) return null;

      return (
        <>
          {photos.length > 0 && (
            <div className="media-collage">
              {photos.map((item, index) => (
                <img key={index} src={`http://localhost:5000/${item}`} alt={`Post Media ${index}`} className="media-image" />
              ))}
            </div>
          )}
          {videos.length > 0 && (
            <div className="media-video">
              {videos.map((video, index) => (
                <video key={index} controls>
                  <source src={`http://localhost:5000/${video}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ))}
            </div>
          )}
        </>
      );
    };

    return (
      <div className="post">
        <div className="post-header">
          <img src={getProfileImageUrl()} alt="Profile" className="user-profile" />
          <div className="user-info">
            <span className="user-name">{userName}</span>
          </div>
          {location && (
            <div className="post-location">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
              <span className="location-name">{location}</span>
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
            <div className="post-actions-icons-div">
              <FontAwesomeIcon
                icon={faHeart}
                className={`like-icon ${isLiked ? 'liked' : ''}`}
                onClick={() => likePost(_id)}
              />
              <span className="likes-count">{likeCount} Likes</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="posts-container">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        posts.map(post => (
          <Post
            key={post._id}
            _id={post._id}
            postType={post.postType}
            user={post.user || {}}
            text={post.text}
            caption={post.caption}
            photos={post.photos || []}
            videos={post.videos || []}
            location={post.location || 'none'}
            backgroundColor={post.backgroundColor}
            likes={post.likes || []}
          />
        ))
      )}
    </div>
  );
};

export default OtherProfileMiddle;
