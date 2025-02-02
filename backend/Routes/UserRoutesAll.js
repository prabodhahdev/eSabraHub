const express = require('express');
const { getAllUsers } = require('../Controllers/UserController'); // Adjust the path as per your project structure

const router = express.Router();

// Route to get all user details
router.get('/all', getAllUsers);

module.exports = router;
