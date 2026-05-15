const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Dish = require('../models/Dish');

// ─── Cloudinary Config ─────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Cloudinary Storage ────────────────────────────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'resto-dishes',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, height: 600, crop: 'fill' }]
  }
});

const upload = multer({ storage });

// ─── GET all dishes ────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET single dish ───────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).json({ message: 'Dish not found' });
    res.json(dish);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST add new dish ─────────────────────────────────────
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? req.file.path : '';

    const dish = new Dish({ name, description, price, category, image });
    const saved = await dish.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ─── PATCH update dish ─────────────────────────────────────
router.patch('/:id', upload.single('image'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = req.file.path;

    const updated = await Dish.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ─── DELETE dish ───────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).json({ message: 'Dish not found' });

    // Delete image from Cloudinary too
    if (dish.image) {
      const publicId = dish.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`resto-dishes/${publicId}`);
    }

    await Dish.findByIdAndDelete(req.params.id);
    res.json({ message: 'Dish deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;