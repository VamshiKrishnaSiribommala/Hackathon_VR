const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickupLocation: {
    address: String,
    lat: Number,
    lng: Number
  },
  dropLocation: {
    address: String,
    lat: Number,
    lng: Number
  },
  estimatedDistance: String,
  estimatedTime: String,
  fare: { type: Number, required: true },
  finalFare: { type: Number }, // Actual fare after ride completion
  status: {
    type: String,
    enum: ['requested', 'accepted', 'ongoing', 'completed', 'cancelled'],
    default: 'requested'
  },
  startedAt: { type: Date },
  endedAt: { type: Date },
  cancelledAt: { type: Date },
  cancelledBy: { type: String, enum: ['rider', 'driver', 'system'] },
  driverLocation: {
    lat: Number,
    lng: Number
  },
  riderRating: { type: Number, min: 1, max: 5 },
  driverRating: { type: Number, min: 1, max: 5 },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
