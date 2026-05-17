import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, phone, emergencyContact, address, preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        emergencyContact,
        address,
        preferences,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    res.json({ success: true, message: 'Profile updated', user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update license info
router.put('/license', authenticate, async (req, res) => {
  try {
    const { licenseNumber, licenseExpiry } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        licenseNumber,
        licenseExpiry,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    res.json({ success: true, message: 'License info updated', user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update insurance info
router.put('/insurance', authenticate, async (req, res) => {
  try {
    const { insuranceProvider, insurancePolicyNumber, insuranceExpiry } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        insuranceProvider,
        insurancePolicyNumber,
        insuranceExpiry,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    res.json({ success: true, message: 'Insurance info updated', user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Change password
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    const isPasswordValid = await user.matchPassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update preferences
router.put('/preferences', authenticate, async (req, res) => {
  try {
    const { preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferences, updatedAt: Date.now() },
      { new: true }
    );

    res.json({ success: true, message: 'Preferences updated', user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
