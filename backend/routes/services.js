import express from 'express';
import Service from '../models/Service.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get nearby services based on user location
router.get('/nearby/:serviceType', authenticate, async (req, res) => {
  try {
    const { latitude, longitude, radiusKm = 50 } = req.query;
    const { serviceType } = req.params;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const radiusInMeters = radiusKm * 1000;

    const nearbyServices = await Service.find({
      serviceType,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: radiusInMeters,
        },
      },
    })
      .limit(10)
      .sort({ 'location.coordinates': 1 });

    res.json({ success: true, services: nearbyServices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all available service providers
router.get('/providers/all', async (req, res) => {
  try {
    const providers = [
      {
        id: 1,
        name: 'Quick Fuel Station',
        type: 'fuel',
        location: { latitude: 13.0827, longitude: 80.2707, address: 'Chennai Central' },
        rating: 4.8,
        distance: 2.3,
      },
      {
        id: 2,
        name: 'EV Charging Hub',
        type: 'charging',
        location: { latitude: 13.1939, longitude: 80.1440, address: 'T Nagar' },
        rating: 4.9,
        distance: 5.1,
      },
      {
        id: 3,
        name: 'Roadside Champions',
        type: 'roadside',
        location: { latitude: 13.1646, longitude: 80.2830, address: 'Velachery' },
        rating: 4.7,
        distance: 3.8,
      },
      {
        id: 4,
        name: 'TowIT Pro',
        type: 'towing',
        location: { latitude: 13.0499, longitude: 80.2471, address: 'Guindy' },
        rating: 4.6,
        distance: 6.2,
      },
      {
        id: 5,
        name: 'MechFix Garage',
        type: 'mechanical',
        location: { latitude: 13.2124, longitude: 80.1900, address: 'Kilpauk' },
        rating: 4.9,
        distance: 8.5,
      },
    ];

    res.json({ success: true, providers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all services for authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const services = await Service.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get service by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new service request
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      vehicleId,
      serviceType,
      location,
      description,
      priority,
    } = req.body;

    const service = new Service({
      userId: req.user.id,
      vehicleId,
      serviceType,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
        address: location.address,
        city: location.city,
        state: location.state,
      },
      description,
      priority: priority || 'medium',
      status: 'pending',
    });

    await service.save();
    res.status(201).json({
      success: true,
      message: 'Service request created',
      service,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update service status
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status, notes } = req.body;

    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { 
        status, 
        notes,
        updatedAt: Date.now(),
        ...(status === 'completed' && { completedAt: Date.now() })
      },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ success: true, message: 'Service status updated', service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Rate service
router.post('/:id/rate', authenticate, async (req, res) => {
  try {
    const { score, review } = req.body;

    if (score < 1 || score > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        rating: { score, review },
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ success: true, message: 'Rating submitted', service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
