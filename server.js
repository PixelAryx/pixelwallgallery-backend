const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const wallpaperRoutes = require('./routes/wallpaperRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

dotenv.config();
const app = express();

// ✅ Middleware setup
app.use(cors({
  origin: "https://pixelwallgallery.onrender.com",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
app.get("/", (req, res) => {
  res.send("PixelWallGallery backend is live 🚀");
});
app.use('/api/wallpapers', wallpaperRoutes);
app.use('/api/feedback', feedbackRoutes);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));