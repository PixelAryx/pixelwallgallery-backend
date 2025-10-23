const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const wallpaperRoutes = require('./routes/wallpaperRoutes');
const path = require('path');

dotenv.config();
const app = express();

// Middleware
app.use(cors()); // CORS allow frontend requests
app.use(express.json());

//FeedBack
const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/api/feedback', feedbackRoutes);


// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/wallpapers', wallpaperRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
