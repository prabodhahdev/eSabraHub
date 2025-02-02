const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

// Function to generate a JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET);
};

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    // Create a new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Send response
    res.status(201).json({ token, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate token
    const token = generateToken(user._id);

    // Send response
    res.status(200).json({ token, user });
  } catch (error) {
    
    res.status(400).json({ message: error.message });
  }
};

// Helper function to ensure upload directory exists
const ensureUploadDirExists = () => {
  const uploadPath = path.join(__dirname, '..', 'uploads', 'profiles');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
};

// Get user details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};
// Get user details by userId
exports.getUserDetailsOther = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract userId from the URL params
    const user = await User.findById(userId); // Use the userId from params to fetch the user

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Return the user details
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.editUserDetails = async (req, res) => {
  try {
    const { description, email, address, contactNumber, username } = req.body;

    // Log the incoming data
    console.log('Request body:', req.body);

    const updatedFields = { description, email, address, contactNumber, username };

    // Handle profile image upload
    if (req.file) {
      ensureUploadDirExists(); // Ensure upload directory exists
      const profileImagePath = `/uploads/profiles/${req.file.filename}`;
      updatedFields.profileImage = profileImagePath;
    }

    // Log the fields to be updated
    console.log('Updated fields:', updatedFields);

    // Update user details
    const user = await User.findByIdAndUpdate(req.user.id, { $set: updatedFields }, { new: true });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};
