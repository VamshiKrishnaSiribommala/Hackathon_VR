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
  driverLocation: {
    lat: Number,
    lng: Number
  },
  status: { 
    type: String, 
    enum: ['requested', 'accepted', 'ongoing', 'completed', 'cancelled'], 
    default: 'requested' 
  },
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
