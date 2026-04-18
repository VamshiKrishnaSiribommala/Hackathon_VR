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
      try {
        // Find nearby available drivers (within 5km radius)
        const pickupLat = rideData.pickupLocation?.lat || 17.3850;
        const pickupLng = rideData.pickupLocation?.lng || 78.4867;
        
        const availableDrivers = await User.find({
          role: 'driver',
          status: 'online',
          isApproved: true,
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [pickupLng, pickupLat]
              },
              $maxDistance: 5000 // 5km in meters
            }
          }
        });
        
        console.log(`socket.io: Found ${availableDrivers.length} nearby drivers for ride request`);
        
        // Emit to nearby drivers
        availableDrivers.forEach(driver => {
          io.to(driver._id.toString()).emit('newRideRequest', rideData);
        });
      } catch (err) {
        console.error('socket.io: Request ride error:', err);
      }
    });

    socket.on('acceptRide', async ({ rideId, driverId, riderId }) => {
      try {
        await Ride.findByIdAndUpdate(rideId, { driver: driverId, status: 'accepted' });
        await User.findByIdAndUpdate(driverId, { status: 'busy' }); // Driver is busy
        
        // Notify rider
        io.to(riderId).emit('rideAccepted', { rideId, driverId });
        console.log(`socket.io: Ride ${rideId} accepted by driver ${driverId}`);
      } catch (err) {
        console.error('socket.io: Accept ride error:', err);
      }
    });

    socket.on('startRide', async ({ rideId, riderId, driverId }) => {
      try {
        await Ride.findByIdAndUpdate(rideId, { status: 'ongoing', startedAt: new Date() });
        
        // Notify both parties
        io.to(riderId).emit('rideStarted', { rideId });
        io.to(driverId).emit('rideStarted', { rideId });
        console.log(`socket.io: Ride ${rideId} started`);
      } catch (err) {
        console.error('socket.io: Start ride error:', err);
      }
    });

    socket.on('endRide', async ({ rideId, riderId, driverId, finalFare }) => {
      try {
        await Ride.findByIdAndUpdate(rideId, { 
          status: 'completed', 
          endedAt: new Date(),
          finalFare: finalFare 
        });
        
        // Update driver status back to online
        await User.findByIdAndUpdate(driverId, { status: 'online' });
        
        // Notify both parties
        io.to(riderId).emit('rideCompleted', { rideId, finalFare });
        io.to(driverId).emit('rideCompleted', { rideId, finalFare });
        console.log(`socket.io: Ride ${rideId} completed with fare ₹${finalFare}`);
      } catch (err) {
        console.error('socket.io: End ride error:', err);
      }
    });

    socket.on('cancelRide', async ({ rideId, cancelledBy, riderId, driverId }) => {
      try {
        await Ride.findByIdAndUpdate(rideId, { 
          status: 'cancelled', 
          cancelledBy: cancelledBy,
          cancelledAt: new Date()
        });
        
        // Update driver status if they were busy
        if (driverId) {
          await User.findByIdAndUpdate(driverId, { status: 'online' });
        }
        
        // Notify both parties
        if (riderId) io.to(riderId).emit('rideCancelled', { rideId, cancelledBy });
        if (driverId) io.to(driverId).emit('rideCancelled', { rideId, cancelledBy });
        console.log(`socket.io: Ride ${rideId} cancelled by ${cancelledBy}`);
      } catch (err) {
        console.error('socket.io: Cancel ride error:', err);
      }
    });

    socket.on('updateLocation', async ({ userId, location }) => {
      try {
        await User.findByIdAndUpdate(userId, { 
          location: location,
          lastLocationUpdate: new Date()
        });
        
        // Broadcast location to relevant users (rider during ride, etc.)
        socket.broadcast.emit('locationUpdate', { userId, location });
      } catch (err) {
        console.error('socket.io: Location update error:', err);
      }
    });

    socket.on('updateDriverStatus', async ({ userId, status }) => {
      try {
        await User.findByIdAndUpdate(userId, { status: status });
        console.log(`socket.io: Driver ${userId} status updated to ${status}`);
      } catch (err) {
        console.error('socket.io: Status update error:', err);
      }
    });

    socket.on('disconnect', async () => {
      try {
        // Find user by socket and update status if driver
        const user = await User.findOne({ socketId: socket.id });
        if (user && user.role === 'driver') {
          await User.findByIdAndUpdate(user._id, { status: 'offline' });
          console.log(`socket.io: Driver ${user._id} went offline (disconnect)`);
        }
      } catch (err) {
        console.error('socket.io: Disconnect error:', err);
      }
      console.log('socket.io: User disconnected');
    });
  });
};
