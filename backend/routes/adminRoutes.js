const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Ride = require('../models/Ride');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied. Admins only.' });
  next();
};

router.get('/users', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/approve-driver/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stats', authMiddleware, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingDrivers = await User.countDocuments({ role: 'driver', isApproved: false });
    const activeRides = await Ride.countDocuments({ status: 'active' });
    const completedRides = await Ride.find({ status: 'completed' });
    const revenue = completedRides.reduce((sum, r) => sum + r.fare, 0);

    res.json({ totalUsers, pendingDrivers, activeRides, revenue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/rides', authMiddleware, isAdmin, async (req, res) => {
  try {
    const rides = await Ride.find().populate('rider driver', 'name email');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
