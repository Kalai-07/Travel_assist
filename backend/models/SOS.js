import mongoose from 'mongoose';

const sosSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
    },
    emergencyType: {
      type: String,
      enum: ['accident', 'breakdown', 'medical', 'theft', 'violence', 'fire', 'other'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'high',
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'responded', 'resolved', 'cancelled'],
      default: 'pending',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: [Number], // [longitude, latitude]
      address: String,
      city: String,
      state: String,
    },
    description: String,
    contactedServices: [
      {
        service: String, // police, ambulance, fire, etc.
        status: String,
        contactTime: Date,
        responseTime: Date,
        notes: String,
      },
    ],
    emergencyContacts: [
      {
        name: String,
        phone: String,
        notified: Boolean,
        notifiedAt: Date,
      },
    ],
    responder: {
      id: mongoose.Schema.Types.ObjectId,
      name: String,
      phone: String,
      eta: Date,
      arrivedAt: Date,
    },
    mediaAttachments: [
      {
        type: String, // photo, video, audio
        url: String,
      },
    ],
    resolvedAt: Date,
    resolutionNotes: String,
    incidentReport: String,
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
sosSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model('SOS', sosSchema);
