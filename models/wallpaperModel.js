const mongoose = require('mongoose');

const wallpaperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  downloads: { type: Number, default: 0 }
});

module.exports = mongoose.model('Wallpaper', wallpaperSchema);
