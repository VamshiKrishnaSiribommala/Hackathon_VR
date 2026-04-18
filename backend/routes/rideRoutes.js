const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/request', authMiddleware, rideController.requestRide);
router.get('/history', authMiddleware, rideController.getRideHistory);

module.exports = router;
