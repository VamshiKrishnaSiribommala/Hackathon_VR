const Ride = require('../models/Ride');
const User = require('../models/User');

exports.requestRide = async (req, res) => {
  try {
    const { pickupLocation, dropLocation, fare } = req.body;
    const ride = new Ride({
      rider: req.user.id,
      pickupLocation,
      dropLocation,
      fare
    });
    await ride.save();
    res.status(201).json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRideHistory = async (req, res) => {
  try {
    const rides = await Ride.find({ 
      $or: [{ rider: req.user.id }, { driver: req.user.id }] 
    }).populate('rider driver', 'name email');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
