import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import vehicleRoutes from './routes/vehicles.js';
import diagnosticsRoutes from './routes/diagnostics.js';
import serviceRoutes from './routes/services.js';
import tripRoutes from './routes/trips.js';
import tripPlanningRoutes from './routes/tripPlanning.js';
import userRoutes from './routes/users.js';
import notificationRoutes from './routes/notifications.js';
import sosRoutes from './routes/sos.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/diagnostics', diagnosticsRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/trip-planning', tripPlanningRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/sos', sosRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Error Handling Middleware
app.use(errorHandler);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});

export default app;
