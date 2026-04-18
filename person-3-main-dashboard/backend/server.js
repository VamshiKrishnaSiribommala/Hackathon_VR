const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Admin Backend Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Admin Analytics Socket Logic
io.on('connection', (socket) => {
  console.log('Admin Viewer connected');

  // Emit periodic stats
  const statsInterval = setInterval(async () => {
    try {
      const User = require('./models/User');
      const Ride = require('./models/Ride');
      
      const totalUsers = await User.countDocuments();
      const activeRides = await Ride.countDocuments({ status: { $in: ['requested', 'accepted', 'started'] } });
      const completedRides = await Ride.countDocuments({ status: 'completed' });
      
      socket.emit('adminStats', {
        totalUsers,
        activeRides,
        completedRides,
        revenue: completedRides * 150 // Mock revenue
      });
    } catch (err) {
      console.error('Stats error:', err);
    }
  }, 5000);

  socket.on('disconnect', () => {
    clearInterval(statsInterval);
  });
});

app.get('/', (req, res) => {
  res.send('Admin API is running');
});

// Import Routes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
  console.log(`Admin Server running on port ${PORT}`);
});
