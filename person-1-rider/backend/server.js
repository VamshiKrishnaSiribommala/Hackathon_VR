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
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('requestRide', (rideData) => {
    // Broadcast to all drivers
    io.emit('newRideRequest', rideData);
  });

  socket.on('acceptRide', ({ rideId, driverId, riderId }) => {
    io.to(riderId).emit('rideAccepted', { rideId, driverId });
  });

  socket.on('updateLocation', ({ userId, location }) => {
    io.emit('locationUpdate', { userId, location });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('Rider API is running');
});

// Import Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Rider Server running on port ${PORT}`);
});
