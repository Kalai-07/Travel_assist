import express from 'express';
import Vehicle from '../models/Vehicle.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all vehicles for user
router.get('/', authenticate, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.user.id });
    res.json({ success: true, vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single vehicle
router.get('/:id', authenticate, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json({ success: true, vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create vehicle
router.post('/', authenticate, async (req, res) => {
  try {
    const { licensePlate, model, make, year, color, fuelType, vin } = req.body;

    const vehicle = new Vehicle({
      userId: req.user.id,
      licensePlate,
      model,
      make,
      year,
      color,
      fuelType,
      vin,
    });

    await vehicle.save();
    res.status(201).json({ success: true, message: 'Vehicle added successfully', vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update vehicle
router.put('/:id', authenticate, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json({ success: true, message: 'Vehicle updated successfully', vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update diagnostics
router.patch('/:id/diagnostics', authenticate, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { diagnostics: req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json({ success: true, message: 'Diagnostics updated', vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete vehicle
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
