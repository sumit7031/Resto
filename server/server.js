const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Load env variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// ─── Socket.IO Setup ───────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH']
  }
});

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Make io accessible in routes
app.set('io', io);

// ─── Middleware ────────────────────────────────────────────
app.use(cors({ 
  origin: [
    'http://localhost:3000',
    'https://resto-seven-drab.vercel.app'
  ] 
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ───────────────────────────────────────────────
const dishRoutes = require('./routes/dishes');
const orderRoutes = require('./routes/orders');

app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);

// ─── Root Test Route ──────────────────────────────────────
app.get('/', (req, res) => {
  res.send('🍽️ Resto API is running...');
});

// ─── MongoDB Connection ───────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    server.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });