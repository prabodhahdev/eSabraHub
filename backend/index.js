const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const multer = require('multer');
const userRoutes = require('./Routes/Auth');
const UserRoutesAll = require('./Routes/UserRoutesAll')
const contactRoutes = require('./Routes/ContactRoutes');
const postRoutes = require('./Routes/PostRoutes');
const serviceRoute = require('./Routes/ServiceRoutes');
const serviceExtraPhotosRoute = require('./Routes/ServiceExtraPhotosRoute'); 
const ChatRoutes=require('./Routes/ChatRoutes');
const { hash } = require('crypto');
dotenv.config();

const app = express();


// Middleware
app.use(cors());
app.use(bodyParser.json()); // For parsing application/json

// Define storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the directory to store uploaded files
    cb(null, path.join(__dirname, 'uploads', 'profiles')); // Adjust path as needed
  },
  filename: (req, file, cb) => {
    // Specify the file naming convention
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  }
});


// Create an instance of Multer with the defined storage
const upload = multer({ storage });

// Ensure upload directories exist
const ensureUploadDirsExist = () => {
  const photoDir = path.join(__dirname, 'uploads', 'photos');
  const videoDir = path.join(__dirname, 'uploads', 'videos');
  const profileDir = path.join(__dirname, 'uploads', 'profiles');
  const mainPhotoDir = path.join(__dirname, 'uploads', 'mainphotos');
  const extraPhotosDir = path.join(__dirname, 'uploads', 'extrapics'); 

  [photoDir, videoDir, profileDir, mainPhotoDir, extraPhotosDir].forEach(dir => { 
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });


};

ensureUploadDirsExist();

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Apply routes
app.use('/api/users', userRoutes);
app.use('/api/users', UserRoutesAll);
app.use('/api/posts', postRoutes);
app.use('/api/service', serviceRoute);
app.use('/api/extraphotos',serviceExtraPhotosRoute ); 
app.use('/api/contact', contactRoutes);
app.use('/api/chat', ChatRoutes);

// MongoDB Connection
mongoose.connect(`mongodb+srv://prabodaharshani95:Mongo94@esabratest.vocqobw.mongodb.net/esabra`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err);
  });

// Check database connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err); // Logs the error details to the console
  res.status(500).json({
      message: 'Something broke!',
      error: err.message
  });
});
// Start Server
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


//GOOGLE_MAPS_API_KEY=AIzaSyBr9_gYL-NcFmcsmPObgzMBroDH5d3M2Xw (previous one)