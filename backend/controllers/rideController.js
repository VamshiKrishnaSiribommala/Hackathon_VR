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

exports.acceptRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    if (ride.status !== "requested") {
      return res.status(400).json({ error: "Ride already taken" });
    }

    ride.driver = req.user.id;
    ride.status = "accepted";

    await ride.save();

    res.json({
      message: "Ride accepted",
      ride
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateRideStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    ride.status = status;

    await ride.save();

    res.json({
      message: "Ride status updated",
      ride
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};