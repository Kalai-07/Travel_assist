import express from 'express';
import SOS from '../models/SOS.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all SOS alerts for user
router.get('/', authenticate, async (req, res) => {
  try {
    const alerts = await SOS.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get SOS alert by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const alert = await SOS.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!alert) {
      return res.status(404).json({ message: 'SOS alert not found' });
    }

    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create SOS alert (CRITICAL - high priority)
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      vehicleId,
      emergencyType,
      severity,
      location,
      description,
      emergencyContacts,
    } = req.body;

    const alert = new SOS({
      userId: req.user.id,
      vehicleId,
      emergencyType,
      severity: severity || 'critical',
      status: 'pending',
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
        address: location.address,
        city: location.city,
        state: location.state,
      },
      description,
      emergencyContacts: emergencyContacts || [],
    });

    await alert.save();

    // TODO: Send notifications to emergency services, contacts, etc.

    res.status(201).json({
      success: true,
      message: 'SOS alert created',
      alert,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update SOS status
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body;

    const alert = await SOS.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        status,
        resolutionNotes,
        updatedAt: Date.now(),
        ...(status === 'resolved' && { resolvedAt: Date.now() })
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: 'SOS alert not found' });
    }

    res.json({ success: true, message: 'SOS status updated', alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add responder to SOS
router.post('/:id/assign-responder', authenticate, async (req, res) => {
  try {
    const { responderId, responderName, responderPhone } = req.body;

    const alert = await SOS.findByIdAndUpdate(
      req.params.id,
      {
        status: 'assigned',
        responder: {
          id: responderId,
          name: responderName,
          phone: responderPhone,
          eta: req.body.eta,
        },
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: 'SOS alert not found' });
    }

    res.json({ success: true, message: 'Responder assigned', alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
