const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['rider', 'driver', 'admin'], required: true },
  isApproved: { type: Boolean, default: function() { return this.role !== 'driver'; } }, // Auto-approve non-drivers
  status: { type: String, enum: ['online', 'offline', 'busy'], default: 'offline' },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [78.4867, 17.3850] // Default Hyderabad
    }
  },
  socketId: { type: String },
  lastLocationUpdate: { type: Date },
  totalRides: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0, min: 1, max: 5 }
}, { timestamps: true });

// Create 2dsphere index for location queries
userSchema.index({ location: '2dsphere' });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);
