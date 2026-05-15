const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET all orders (for kitchen)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.dish', 'name price image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST place new order
router.post('/', async (req, res) => {
  try {
    const { customerName, tableNumber, items, totalPrice, note } = req.body;

    const order = new Order({ customerName, tableNumber, items, totalPrice, note });
    const saved = await order.save();

    // 🔴 Emit real-time event to kitchen
    const io = req.app.get('io');
    io.emit('new_order', saved);

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH update order status (kitchen updates)
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    // 🔴 Emit status update to all clients
    const io = req.app.get('io');
    io.emit('order_updated', updated);

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;