/**
 * Geolocation utility for getting user location and nearby providers
 */

export const getCoordinates = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

/**
 * Reverse geocode coordinates to get address
 * Using Open Street Map Nominatim API (free, no key required)
 */
export const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: { 'Accept-Language': 'en' }
      }
    );
    const data = await response.json();

    // Extract readable address
    const address = data.address || {};
    const addressLine = [
      address.road || address.highway,
      address.suburb || address.quarter || address.neighbourhood,
      address.city || address.town,
      address.state_district || address.state,
    ]
      .filter(Boolean)
      .slice(0, 3)
      .join(', ');

    return {
      address: addressLine || 'Location details unavailable',
      city: address.city || address.town || 'Unknown',
      state: address.state || '',
      lat: latitude,
      lon: longitude,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      city: 'Unknown',
      state: '',
      lat: latitude,
      lon: longitude,
    };
  }
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

/**
 * Get nearby providers sorted by distance
 */
export const getNearbyProviders = (userLat, userLon, providers) => {
  return providers
    .map((provider) => ({
      ...provider,
      distance: calculateDistance(userLat, userLon, provider.latitude, provider.longitude),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5); // Return top 5 nearest
};
