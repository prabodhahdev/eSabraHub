const express = require('express');
const router = express.Router();
const { signup, login, getUserDetails, editUserDetails, getUserDetailsOther } = require('../Controllers/AuthController');
const authenticateUser = require('../Middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'profiles');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.get('/verify', authenticateUser, (req, res) => {
  // If this endpoint is hit, the token has already been validated
  res.json({ user: req.user });
});

// Define routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authenticateUser, getUserDetails);
router.put('/profile/edit', authenticateUser, upload.single('profileImage'), editUserDetails);
router.get('/profile/:userId', getUserDetailsOther);



module.exports = router;
