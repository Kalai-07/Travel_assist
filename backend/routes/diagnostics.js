import express from 'express';
import Vehicle from '../models/Vehicle.js';
import { authenticate } from '../middleware/auth.js';
import mlService from '../utils/ml-service.js';

const router = express.Router();

/**
 * POST /api/diagnostics/:vehicleId/predict
 * Get vehicle health prediction from ML model
 */
router.post('/:vehicleId/predict', authenticate, async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { sensors } = req.body;

    // Validate request
    if (!sensors) {
      return res.status(400).json({
        success: false,
        message: 'Missing sensors data in request body',
      });
    }

    // Verify vehicle exists and belongs to user
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      userId: req.user.id,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    // Get prediction from ML service
    let prediction;
    try {
      prediction = await mlService.predict(sensors);
    } catch (mlError) {
      console.error('ML Service error:', mlError.message);
      return res.status(503).json({
        success: false,
        message: mlError.message || 'ML service unavailable',
      });
    }

    // Update vehicle diagnostics with ML prediction
    vehicle.diagnostics = {
      ...vehicle.diagnostics,
      ...sensors,
      mlPrediction: {
        class: prediction.class,
        classId: prediction.classId,
        confidence: prediction.confidence,
        probabilities: prediction.probabilities,
        modelVersion: 'RF_v1.0',
        timestamp: new Date(),
      },
    };

    await vehicle.save();

    res.json({
      success: true,
      message: 'Diagnostics prediction completed',
      data: {
        vehicleId: vehicle._id,
        prediction: {
          class: prediction.class,
          classId: prediction.classId,
          confidence: prediction.confidence,
          probabilities: prediction.probabilities,
        },
        timestamp: new Date().toISOString(),
        vehicleUpdated: true,
      },
    });
  } catch (error) {
    console.error('Diagnostics prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process diagnostics prediction',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /api/diagnostics/:vehicleId
 * Get latest diagnostics for a vehicle
 */
router.get('/:vehicleId', authenticate, async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      userId: req.user.id,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    res.json({
      success: true,
      data: {
        vehicleId: vehicle._id,
        diagnostics: vehicle.diagnostics,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve diagnostics',
    });
  }
});

/**
 * GET /api/diagnostics/:vehicleId/ml-model-info
 * Get ML model information
 */
router.get('/:vehicleId/ml-model-info', authenticate, async (req, res) => {
  try {
    const modelInfo = await mlService.getModelInfo();
    res.json({
      success: true,
      data: modelInfo,
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'ML service information unavailable',
    });
  }
});

export default router;
