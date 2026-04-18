const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Update status and location
router.put('/status', authMiddleware, async (req, res) => {
  try {
    const { status, location } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (location) updateData.location = location;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
