import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    licensePlate: {
      type: String,
      required: [true, 'License plate is required'],
      unique: true,
      uppercase: true,
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
    },
    make: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
      required: true,
    },
    vin: {
      type: String,
      unique: true,
      sparse: true,
    },
    mileage: {
      type: Number,
      default: 0,
    },
    diagnostics: {
      engine_temp: Number,
      battery_voltage: Number,
      rpm: Number,
      tire_pressure_fl: Number,
      tire_pressure_fr: Number,
      tire_pressure_rl: Number,
      tire_pressure_rr: Number,
      oil_pressure: Number,
      coolant_temp: Number,
      fuel_level: Number,
      mlPrediction: {
        class: {
          type: String,
          enum: ['Normal', 'Warning', 'Critical'],
        },
        classId: Number,
        confidence: Number,
        probabilities: {
          Normal: Number,
          Warning: Number,
          Critical: Number,
        },
        modelVersion: String,
        timestamp: Date,
      },
    },
    health: {
      type: Number,
      min: 0,
      max: 100,
      default: 85,
    },
    lastService: Date,
    nextServiceDue: Date,
    insuranceProvider: String,
    insurancePolicyNumber: String,
    insuranceExpiry: Date,
    registrationExpiry: Date,
    pollutionCertificateExpiry: Date,
    gpsDeviceId: String,
    iotDeviceId: String,
    isActive: {
      type: Boolean,
      default: true,
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

export default mongoose.model('Vehicle', vehicleSchema);
