import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
    },
    description: String,
    startLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: [Number], // [longitude, latitude]
      address: String,
      city: String,
    },
    endLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: [Number],
      address: String,
      city: String,
    },
    waypoints: [
      {
        coordinates: [Number],
        address: String,
        arrivalTime: Date,
      },
    ],
    attractions: [
      {
        name: String,
        category: String,
        coordinates: [Number],
        distance: Number,
        rating: Number,
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    estimatedDistance: Number,
    estimatedDuration: String,
    actualDistance: Number,
    actualDuration: String,
    route: {
      type: String,
      enum: ['fastest', 'shortest', 'scenic'],
      default: 'fastest',
    },
    budget: {
      estimated: Number,
      actual: Number,
      currency: {
        type: String,
        default: 'INR',
      },
    },
    weather: {
      condition: String,
      temperature: Number,
      humidity: Number,
    },
    status: {
      type: String,
      enum: ['planning', 'in-progress', 'completed', 'cancelled'],
      default: 'planning',
    },
    stops: [
      {
        name: String,
        type: String,
        coordinates: [Number],
        duration: String,
        notes: String,
      },
    ],
    companions: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        name: String,
      },
    ],
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

// Create geospatial indexes
tripSchema.index({ 'startLocation.coordinates': '2dsphere' });
tripSchema.index({ 'endLocation.coordinates': '2dsphere' });

export default mongoose.model('Trip', tripSchema);
