import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { faMapMarkerAlt, faTrash, faEdit, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../Context/AuthContext';
import UpdatePost from '../../../Components/PostsPageCompo/UpdatePost/UpdatePost';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ProfileMiddle = () => {
  const { authState } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});
  const [userData, setUserData] = useState({
    profileImage: '/uploads/profiles/profile.jpg',
    username: '',
    description: '',
    email: '',
    address: '',
    contactNumber: '',
  });

  // Fetch posts of authenticated user
  const fetchPosts = useCallback(async () => {
    if (!authState?.user?._id) {
      setError('User is not authenticated');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`https://esabrahub.onrender.com/api/posts/user/${authState.user._id}`);
      const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Mark liked posts
      const initialLikedPosts = {};
      sortedPosts.forEach(post => {
        initialLikedPosts[post._id] = post.likes.some(like => like.userId === authState.user._id);
      });

      setPosts(sortedPosts);
      setLikedPosts(initialLikedPosts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authState]);

  // Fetch profile info
  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get('https://esabrahub.onrender.com/api/users/profile', {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
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
  }, [authState.token]);

  useEffect(() => {
    fetchUserData();
    fetchPosts();
  }, [fetchUserData, fetchPosts]);

  // Get profile image URL
  const getProfileImageUrl = () => {
    if (userData.profileImage instanceof File) {
      return URL.createObjectURL(userData.profileImage);
    }
    return `https://esabrahub.onrender.com${userData.profileImage}`;
  };

  // Clean up object URL
  useEffect(() => {
    let objectURL;
    if (userData.profileImage instanceof File) {
      objectURL = URL.createObjectURL(userData.profileImage);
    }
    return () => {
      if (objectURL) URL.revokeObjectURL(objectURL);
    };
  }, [userData.profileImage]);

  // Delete post
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`https://esabrahub.onrender.com/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      setPosts(prev => prev.filter(post => post._id !== postId));
      toast.success("Post Deleted");
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  // Like/unlike post
  const handleLike = async (postId) => {
    try {
      const response = await axios.post(`https://esabrahub.onrender.com/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${authState.token}` },
      });

      const updatedPost = response.data;

      setLikedPosts(prev => ({
        ...prev,
        [postId]: !prev[postId],
      }));

      setPosts(prev =>
        prev.map(post =>
          post._id === postId ? { ...post, likes: updatedPost.likes } : post
        )
      );
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  // Modal handlers
  const openEditModal = (post) => setEditPost(post);
  const closeEditModal = () => setEditPost(null);

  // Post component
  const Post = ({ _id, postType, user, text, photos, videos, location, backgroundColor, likes, caption }) => {
    const userName = user?.username || 'Unknown User';
    const likeCount = Array.isArray(likes) ? likes.length : 0;
    const isLiked = likedPosts[_id];

    return (
      <div className="post">
        <div className="post-header">
          <img
            src={getProfileImageUrl()}
            alt="Profile"
            className="user-profile"
          />
          <div className="user-info">
            <span className="user-name">{userName}</span>
          </div>
          {location && (
            <div className="post-location">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
              <span className="location-name">{location}</span>
            </div>
          )}
          <div className="post-actions-icons-div">
            <FontAwesomeIcon icon={faEdit} className="edit-icon" onClick={() => openEditModal({ _id, text, location, postType, photos, videos, caption })} />
            <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={() => handleDeletePost(_id)} />
          </div>
        </div>

        {postType === 'text' && (
          <div className="text-post" style={{ backgroundColor: backgroundColor || '#f0f0f0' }}>
            <p className="text-content">{text}</p>
          </div>
        )}

        {postType === 'media' && (
          <div className="media-gallery">
            {caption && <p className='post-content'>{caption}</p>}
            {photos.length > 0 && (
              <div className={`media-${photos.length === 1 ? 'single' : 'collage'}`}>
                {photos.map((photo, i) => (
                  <img key={i} src={`https://esabrahub.onrender.com/${photo}`} alt={`Media ${i}`} className="media-image" />
                ))}
              </div>
            )}
            {videos.map((video, i) => (
              <video key={i} controls className="media-video">
                <source src={`https://esabrahub.onrender.com/${video}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ))}
          </div>
        )}

        <div className="post-footer">
          <div className="post-actions-icons-div" onClick={() => handleLike(_id)}>
            <FontAwesomeIcon icon={faHeart} className={`like-icon ${isLiked ? 'liked' : ''}`} />
            <span className="likes-count">{likeCount} Likes</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="posts-container">
      <Modal
        isOpen={!!editPost}
        onRequestClose={closeEditModal}
        contentLabel="Edit Post Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <button onClick={closeEditModal} className="close-modal-button">X</button>
        {editPost && (
          <UpdatePost
            post={editPost}
            onClose={closeEditModal}
            onSave={fetchPosts}
          />
        )}
      </Modal>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        posts.map(post => (
          <Post
            key={post._id}
            {...post}
            user={post.user || {}}
            photos={post.photos || []}
            videos={post.videos || []}
            location={post.location || 'none'}
            likes={post.likes || []}
          />
        ))
      )}
    </div>
  );
};

export default ProfileMiddle;
