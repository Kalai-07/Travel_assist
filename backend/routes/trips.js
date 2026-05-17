import express from 'express';
import Trip from '../models/Trip.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all trips for user
router.get('/', authenticate, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id })
      .sort({ startDate: -1 });
    res.json({ success: true, trips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get trip by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json({ success: true, trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create trip
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      vehicleId,
      title,
      description,
      startLocation,
      endLocation,
      startDate,
      endDate,
      route,
      attractions,
    } = req.body;

    const trip = new Trip({
      userId: req.user.id,
      vehicleId,
      title,
      description,
      startLocation: {
        type: 'Point',
        coordinates: [startLocation.longitude, startLocation.latitude],
        address: startLocation.address,
        city: startLocation.city,
      },
      endLocation: {
        type: 'Point',
        coordinates: [endLocation.longitude, endLocation.latitude],
        address: endLocation.address,
        city: endLocation.city,
      },
      startDate,
      endDate,
      route: route || 'fastest',
      attractions: attractions || [],
      status: 'planning',
    });

    await trip.save();
    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      trip,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update trip
router.put('/:id', authenticate, async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json({ success: true, message: 'Trip updated successfully', trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update trip status
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;

    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json({ success: true, message: 'Trip status updated', trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete trip
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
