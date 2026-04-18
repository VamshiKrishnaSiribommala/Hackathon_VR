const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/request', authMiddleware, rideController.requestRide);
router.get('/history', authMiddleware, rideController.getRideHistory);
router.put('/accept/:id', authMiddleware, rideController.acceptRide);
router.put('/status/:id', authMiddleware, rideController.updateRideStatus);
module.exports = router;
