const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/request-ride', authMiddleware, rideController.requestRide);
router.get('/available', authMiddleware, rideController.getAvailableRides);
router.post('/accept-ride', authMiddleware, rideController.acceptRide);
router.post('/start-ride', authMiddleware, rideController.startRide);
router.post('/complete-ride', authMiddleware, rideController.completeRide);
router.post('/cancel-ride', authMiddleware, rideController.cancelRide);
router.get('/ride-status/:id', authMiddleware, rideController.getRideStatus);
router.get('/current-ride', authMiddleware, rideController.getCurrentRide);
router.get('/history', authMiddleware, rideController.getRideHistory);
router.post('/update-driver-location', authMiddleware, rideController.updateDriverLocation);

module.exports = router;
