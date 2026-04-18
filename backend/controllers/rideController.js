const Ride = require('../models/Ride');
const User = require('../models/User');

const estimateFare = (distanceKm) => {
  const baseFare = 40;
  const perKm = 15;
  return Math.round(baseFare + Math.max(1, distanceKm) * perKm);
};

exports.requestRide = async (req, res) => {
  try {
    if (req.user.role !== 'rider') {
      return res.status(403).json({ error: 'Only riders can request rides.' });
    }

    const { pickupLocation, dropLocation, fare, estimatedDistance, estimatedTime } = req.body;
    const computedFare = fare || estimateFare(Number(estimatedDistance) || 5);

    const ride = new Ride({
      pickupLocation,
      dropLocation,
      fare: computedFare,
      estimatedDistance,
      estimatedTime,
      status: 'requested',
      rider: req.user.id,
      driverLocation: null,
    });
    await ride.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('newRideRequest', {
        rideId: ride._id,
        riderId: req.user.id,
        pickup: pickupLocation.address,
        destination: dropLocation.address,
        fare: ride.fare,
      });
    }

    res.status(201).json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAvailableRides = async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ error: 'Only drivers can view available rides.' });
    }

    const rides = await Ride.find({ status: 'requested' }).populate('rider', 'name email');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.acceptRide = async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ error: 'Only drivers can accept rides.' });
    }

    const { rideId } = req.body;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    if (ride.status !== 'requested') return res.status(400).json({ error: 'Ride already taken' });

    ride.driver = req.user.id;
    ride.status = 'accepted';
    await ride.save();

    await User.findByIdAndUpdate(req.user.id, { status: 'offline' });

    const io = req.app.get('io');
    if (io) {
      io.to(ride.rider.toString()).emit('rideAccepted', { rideId: ride._id, driverId: req.user.id });
    }

    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.startRide = async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ error: 'Only drivers can start rides.' });
    }

    const { rideId } = req.body;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    if (ride.status !== 'accepted') return res.status(400).json({ error: 'Ride must be accepted before starting.' });

    ride.status = 'ongoing';
    await ride.save();

    const io = req.app.get('io');
    if (io) {
      io.to(ride.rider.toString()).emit('rideStarted', { rideId: ride._id });
    }

    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.completeRide = async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ error: 'Only drivers can complete rides.' });
    }

    const { rideId } = req.body;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    if (ride.status !== 'ongoing') return res.status(400).json({ error: 'Ride must be ongoing to complete.' });

    ride.status = 'completed';
    await ride.save();

    const io = req.app.get('io');
    if (io) {
      io.to(ride.rider.toString()).emit('rideCompleted', { rideId: ride._id });
    }

    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRideStatus = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('driver', 'name email').populate('rider', 'name email');
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCurrentRide = async (req, res) => {
  try {
    const filter = req.user.role === 'driver'
      ? { driver: req.user.id, status: { $in: ['accepted', 'ongoing'] } }
      : { rider: req.user.id, status: { $in: ['requested', 'accepted', 'ongoing'] } };
    const ride = await Ride.findOne(filter).sort({ createdAt: -1 });
    res.json(ride || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRideHistory = async (req, res) => {
  try {
    const filter = req.user.role === 'driver'
      ? { driver: req.user.id }
      : { rider: req.user.id };
    const rides = await Ride.find(filter).sort({ createdAt: -1 }).populate('driver', 'name').populate('rider', 'name');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDriverLocation = async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ error: 'Only drivers can update location.' });
    }

    const { rideId, driverLocation } = req.body;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });

    ride.driverLocation = driverLocation;
    await ride.save();
    res.json({ message: 'Driver location updated', ride });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
