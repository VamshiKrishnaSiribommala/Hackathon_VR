const User = require('../models/User');
const Ride = require('../models/Ride');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('socket.io: User connected:', socket.id);

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`socket.io: User ${userId} joined room`);
    });

    socket.on('requestRide', async (rideData) => {
      // Find nearest available drivers (simplified for hackathon)
      const availableDrivers = await User.find({ 
        role: 'driver', 
        status: 'online', 
        isApproved: true 
      });
      
      // Emit to all online drivers
      availableDrivers.forEach(driver => {
        io.to(driver._id.toString()).emit('newRideRequest', rideData);
      });
    });

    socket.on('acceptRide', async ({ rideId, driverId, riderId }) => {
      try {
        await Ride.findByIdAndUpdate(rideId, { driver: driverId, status: 'accepted' });
        await User.findByIdAndUpdate(driverId, { status: 'offline' }); // Busy
        
        // Notify rider
        io.to(riderId).emit('rideAccepted', { rideId, driverId });
        console.log(`socket.io: Ride ${rideId} accepted by driver ${driverId}`);
      } catch (err) {
        console.error('socket.io: Accept ride error:', err);
      }
    });

    socket.on('updateLocation', ({ userId, location }) => {
      socket.broadcast.emit('locationUpdate', { userId, location });
    });

    socket.on('disconnect', () => {
      console.log('socket.io: User disconnected');
    });
  });
};
