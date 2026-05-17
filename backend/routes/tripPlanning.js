import express from 'express';
import axios from 'axios';

const router = express.Router();
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// Get available cities for trip planning
router.get('/cities', async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/api/trip/cities`, { timeout: 5000 });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching cities:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get complete trip plan (cost prediction + recommendations)
router.post('/plan', async (req, res) => {
  try {
    const { from_city, to_city, distance_km, budget_inr, days, style, interests, veg_only } = req.body;

    const response = await axios.post(`${ML_SERVICE_URL}/api/trip/plan`, {
      from_city,
      to_city,
      distance_km: parseFloat(distance_km) || 100,
      budget_inr: parseFloat(budget_inr) || 50000,
      days: parseInt(days) || 3,
      style: style || 'comfort',
      interests: interests || [],
      veg_only: veg_only || false,
    }, { timeout: 10000 });

    res.json(response.data);
  } catch (error) {
    console.error('Error generating trip plan:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get hotel recommendations
router.post('/hotels', async (req, res) => {
  try {
    const { city, style, budget_per_night, top_n } = req.body;

    const response = await axios.post(`${ML_SERVICE_URL}/api/trip/hotels`, {
      city,
      style: style || 'comfort',
      budget_per_night: budget_per_night ? parseFloat(budget_per_night) : null,
      top_n: parseInt(top_n) || 5,
    }, { timeout: 5000 });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching hotels:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get restaurant recommendations
router.post('/restaurants', async (req, res) => {
  try {
    const { city, interests, veg_only, style, top_n } = req.body;

    const response = await axios.post(`${ML_SERVICE_URL}/api/trip/restaurants`, {
      city,
      interests: interests || [],
      veg_only: veg_only || false,
      style: style || 'comfort',
      top_n: parseInt(top_n) || 5,
    }, { timeout: 5000 });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching restaurants:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get place recommendations
router.post('/places', async (req, res) => {
  try {
    const { city, interests, top_n } = req.body;

    const response = await axios.post(`${ML_SERVICE_URL}/api/trip/places`, {
      city,
      interests: interests || [],
      top_n: parseInt(top_n) || 5,
    }, { timeout: 5000 });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching places:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
