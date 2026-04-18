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
  .then(() => console.log('Driver Backend Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('Driver connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`Driver ${userId} joined their room`);
  });

  socket.on('acceptRide', ({ rideId, driverId, riderId }) => {
    console.log(`Driver ${driverId} accepted ride ${rideId}`);
    // In a real app, update DB here
    io.emit('rideAccepted', { rideId, driverId, riderId });
  });

  socket.on('updateLocation', ({ userId, location }) => {
    io.emit('locationUpdate', { userId, location });
  });

  socket.on('disconnect', () => {
    console.log('Driver disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('Driver API is running');
});

// Import Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`Driver Server running on port ${PORT}`);
});
