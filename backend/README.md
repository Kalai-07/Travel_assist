# TravelAssist Backend

A comprehensive Node.js/Express backend for the TravelAssist application - an AI-Driven IoT Framework for Integrated Roadside Assistance and Intelligent Mobility Services.

## Features

- 🔐 User Authentication & Authorization (JWT)
- 🚗 Vehicle Management & Diagnostics
- 🚨 Emergency SOS System
- 🛣️ Trip Planning & Management
- 🔧 Service Request Management
- 📬 Notification System
- 📍 Geolocation Services
- 💾 MongoDB Database Integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   Edit `.env` and set:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong secret key for JWT tokens
   - `FRONTEND_URL`: Frontend application URL

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token

### Vehicles
- `GET /api/vehicles` - Get all user vehicles
- `GET /api/vehicles/:id` - Get vehicle details
- `POST /api/vehicles` - Add new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `PATCH /api/vehicles/:id/diagnostics` - Update diagnostics
- `DELETE /api/vehicles/:id` - Delete vehicle

### Services
- `GET /api/services` - Get all service requests
- `GET /api/services/:id` - Get service details
- `POST /api/services` - Create service request
- `PATCH /api/services/:id/status` - Update service status
- `POST /api/services/:id/rate` - Rate service

### Trips
- `GET /api/trips` - Get all trips
- `GET /api/trips/:id` - Get trip details
- `POST /api/trips` - Create trip
- `PUT /api/trips/:id` - Update trip
- `PATCH /api/trips/:id/status` - Update trip status
- `DELETE /api/trips/:id` - Delete trip

### SOS (Emergency)
- `GET /api/sos` - Get all SOS alerts
- `GET /api/sos/:id` - Get SOS details
- `POST /api/sos` - Create SOS alert
- `PATCH /api/sos/:id/status` - Update SOS status
- `POST /api/sos/:id/assign-responder` - Assign responder

### Notifications
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/count/unread` - Get unread count
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/mark-all/read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/license` - Update license info
- `PUT /api/users/insurance` - Update insurance info
- `POST /api/users/change-password` - Change password
- `PUT /api/users/preferences` - Update preferences

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB configuration
├── models/
│   ├── User.js              # User model
│   ├── Vehicle.js           # Vehicle model
│   ├── Service.js           # Service request model
│   ├── Trip.js              # Trip model
│   ├── SOS.js               # SOS alert model
│   └── Notification.js      # Notification model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── vehicles.js          # Vehicle routes
│   ├── services.js          # Service routes
│   ├── trips.js             # Trip routes
│   ├── sos.js               # SOS routes
│   ├── users.js             # User routes
│   └── notifications.js     # Notification routes
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── errorHandler.js      # Error handling
├── utils/
│   ├── validators.js        # Input validators
│   └── notifications.js     # Notification utilities
├── server.js                # Main server file
├── package.json             # Dependencies
├── .env.example             # Environment template
└── README.md                # This file
```

## Database Schema

### User
```javascript
{
  name, email, phone, password,
  profileImage, emergencyContact,
  address, licenseNumber, licenseExpiry,
  insuranceProvider, insurancePolicyNumber,
  preferences, role, isActive
}
```

### Vehicle
```javascript
{
  userId, licensePlate, model, make, year,
  color, fuelType, vin, mileage,
  diagnostics: {
    engineTemp, batteryVoltage, tyrePressure,
    engineRPM, fuelLevel, oilLevel, coolantLevel
  },
  health, lastService, insuranceExpiry
}
```

### Service
```javascript
{
  userId, vehicleId, serviceType, status, priority,
  location (GeoJSON Point), description,
  estimatedCost, actualCost, serviceProvider,
  rating: { score, review }
}
```

### Trip
```javascript
{
  userId, vehicleId, title, description,
  startLocation, endLocation, waypoints,
  startDate, endDate, route, attractions,
  budget, weather, status
}
```

### SOS
```javascript
{
  userId, vehicleId, emergencyType, severity, status,
  location (GeoJSON Point), description,
  contactedServices, emergencyContacts,
  responder, mediaAttachments
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Future Enhancements

- Real-time notifications with Socket.io
- Map integration for live tracking
- IoT device integration
- SMS/Email alerts via Twilio/Nodemailer
- Admin dashboard API
- Analytics and reporting
- Payment integration
- Insurance claim management

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the repository or contact support@travelassist.com
