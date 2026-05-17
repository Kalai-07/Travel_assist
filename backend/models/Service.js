import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    serviceType: {
      type: String,
      enum: ['fuel', 'charging', 'roadside', 'towing', 'mechanical', 'flat-tire', 'lockout', 'other'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
      address: String,
      city: String,
      state: String,
    },
    description: String,
    estimatedCost: Number,
    actualCost: Number,
    serviceProvider: {
      name: String,
      phone: String,
      rating: Number,
    },
    estimatedArrival: Date,
    actualArrival: Date,
    completedAt: Date,
    notes: String,
    rating: {
      score: {
        type: Number,
        min: 1,
        max: 5,
      },
      review: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create geospatial index
serviceSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model('Service', serviceSchema);
