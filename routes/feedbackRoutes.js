const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Feedback model
const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// POST feedback
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) return res.status(400).json({ message: 'All fields required' });

        const fb = new Feedback({ name, email, message });
        await fb.save();
        res.json({ message: 'Feedback submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET all feedbacks (for admin)
router.get('/', async (req, res) => {
    try {
        const all = await Feedback.find().sort({ createdAt: -1 });
        res.json(all);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
