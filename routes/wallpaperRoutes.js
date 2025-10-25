const express = require('express');
const router = express.Router();
const multer = require('multer');
const Wallpaper = require('../models/wallpaperModel');
const path = require('path');

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads'); // backend/uploads folder
    console.log('Saving to:', uploadPath); // debug
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({ storage: storage });

// GET all wallpapers
router.get('/', async (req, res) => {
  try {
    const wallpapers = await Wallpaper.find().sort({ _id: -1 });
    res.json(wallpapers);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST: upload wallpaper (admin)
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const newWall = new Wallpaper({
      title,
      category,
      imageUrl: '/uploads/' + req.file.filename,
      downloads: 0
    });
    await newWall.save();
    res.json(newWall);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT: update title/category
router.put('/:id', async (req, res) => {
  try {
    const { title, category } = req.body;
    const w = await Wallpaper.findById(req.params.id);
    if (!w) return res.status(404).json({ message: 'Not found' });
    w.title = title;
    w.category = category;
    await w.save();
    res.json(w);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT: increment downloads
router.put('/:id/download', async (req, res) => {
  try {
    const w = await Wallpaper.findById(req.params.id);
    if (!w) return res.status(404).json({ message: 'Not found' });
    w.downloads += 1;
    await w.save();
    res.json({ downloads: w.downloads });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE wallpaper
router.delete('/:id', async (req, res) => {
  try {
    const w = await Wallpaper.findByIdAndDelete(req.params.id);
    if (!w) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
