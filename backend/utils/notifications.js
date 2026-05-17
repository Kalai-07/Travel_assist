import Notification from '../models/Notification.js';

export const createNotification = async (userId, notificationData) => {
  try {
    const notification = new Notification({
      userId,
      ...notificationData,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const notifyServiceRequest = async (userId, serviceData) => {
  return createNotification(userId, {
    type: 'service',
    title: 'Service Request Confirmed',
    message: `Your ${serviceData.serviceType} service request has been confirmed`,
    relatedEntity: {
      entityType: 'service',
      entityId: serviceData.serviceId,
    },
    priority: 'high',
  });
};

export const notifySOSResponse = async (userId, sosData) => {
  return createNotification(userId, {
    type: 'sos',
    title: 'Emergency Response',
    message: 'Help is on the way!',
    relatedEntity: {
      entityType: 'sos',
      entityId: sosData.sosId,
    },
    priority: 'critical',
    channels: {
      inApp: true,
      email: true,
      sms: true,
      push: true,
    },
  });
};

export const notifyTripUpdate = async (userId, tripData) => {
  return createNotification(userId, {
    type: 'trip',
    title: 'Trip Update',
    message: tripData.message,
    relatedEntity: {
      entityType: 'trip',
      entityId: tripData.tripId,
    },
  });
};

export const notifyVehicleAlert = async (userId, vehicleData) => {
  return createNotification(userId, {
    type: 'vehicle',
    title: 'Vehicle Alert',
    message: vehicleData.message,
    relatedEntity: {
      entityType: 'vehicle',
      entityId: vehicleData.vehicleId,
    },
    priority: vehicleData.priority || 'high',
  });
};
