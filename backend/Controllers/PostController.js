const mongoose = require('mongoose');
const Post = require('../Models/Post');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const ensureUploadDirsExist = () => {
  const photoDir = path.join(__dirname, '..', 'uploads', 'photos');
  const videoDir = path.join(__dirname, '..', 'uploads', 'videos');
  
  if (!fs.existsSync(photoDir)) {
    fs.mkdirSync(photoDir, { recursive: true });
  }
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }
};

ensureUploadDirsExist();

const createPost = async (req, res) => {
  try {
    const { text, location, caption, backgroundColor, postType } = req.body;
    const photos = req.files?.photos ? req.files.photos.map(file => file.path) : [];
    const videos = req.files?.videos ? req.files.videos.map(file => file.path) : [];

    if (!['text', 'media'].includes(postType)) {
      return res.status(400).json({ message: 'Invalid post type. Must be "text" or "media".' });
    }

    let coordinates = { lat: null, lng: null };
    if (location) {
      // Get coordinates from Google Maps Geocoding API
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: location,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });

      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        coordinates = { lat, lng };
      } else {
        return res.status(400).json({ error: 'Location not found' });
      }
    }

    const post = new Post({
      text,
      photos,
      videos,
      location,
      coordinates,
      caption,
      backgroundColor,
      postType,
      user: req.user._id
    });

    await post.save();

    const populatedPost = await Post.findById(post._id)
                                     .populate('user', 'username email')
                                     .exec();

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username email profileImage');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'username email');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId }).populate('user', 'username email');
    if (!posts || posts.length === 0) {
      return res.status(404).json({ error: 'No posts found for this user' });
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text, location, caption, backgroundColor, postType } = req.body;

    // Get new media files
    const photos = req.files.photos ? req.files.photos.map(file => file.path) : [];
    const videos = req.files.videos ? req.files.videos.map(file => file.path) : [];

    // Fetch the current post to get old media files
    const currentPost = await Post.findById(postId);

    if (!currentPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // If new media is provided, remove old media files
    if (photos.length > 0 || videos.length > 0) {
      if (currentPost.photos) {
        const oldPhotos = currentPost.photos.filter(photo => !photos.includes(photo));
        oldPhotos.forEach(photo => {
          fs.unlink(photo, err => {
            if (err) console.error('Error deleting old photo:', err);
          });
        });
      }

      if (currentPost.videos) {
        const oldVideos = currentPost.videos.filter(video => !videos.includes(video));
        oldVideos.forEach(video => {
          fs.unlink(video, err => {
            if (err) console.error('Error deleting old video:', err);
          });
        });
      }
    }

    // Update the post with new media paths and other fields
    const updatedPost = await Post.findByIdAndUpdate(postId, {
      text,
      location,
      caption,
      backgroundColor,
      postType,
      photos: photos.length > 0 ? photos : currentPost.photos,
      videos: videos.length > 0 ? videos : currentPost.videos
    }, { new: true });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.photos.length > 0) {
      post.photos.forEach(photo => {
        const filePath = path.join(__dirname, '..', photo);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    if (post.videos.length > 0) {
      post.videos.forEach(video => {
        const filePath = path.join(__dirname, '..', video);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const userLike = post.likes.find(like => like.userId.toString() === userId.toString());

    if (userLike) {
      post.likes = post.likes.filter(like => like.userId.toString() !== userId.toString());
    } else {
      post.likes.push({ userId });
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  getPostsByUser,
  updatePost,
  deletePost,
  likePost
};
