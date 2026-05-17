const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = {
  /**
   * Make an authenticated API request
   */
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  },

  /**
   * Get vehicle diagnostics
   */
  async getDiagnostics(vehicleId) {
    return this.request(`/diagnostics/${vehicleId}`);
  },

  /**
   * Run vehicle health prediction
   */
  async predictVehicleHealth(vehicleId, sensors) {
    return this.request(`/diagnostics/${vehicleId}/predict`, {
      method: 'POST',
      body: JSON.stringify({ sensors }),
    });
  },

  /**
   * Get ML model information
   */
  async getModelInfo(vehicleId) {
    return this.request(`/diagnostics/${vehicleId}/ml-model-info`);
  },

  /**
   * Get nearby services by type and location
   */
  async getNearbyServices(serviceType, latitude, longitude, radiusKm = 50) {
    return this.request(`/services/nearby/${serviceType}?latitude=${latitude}&longitude=${longitude}&radiusKm=${radiusKm}`);
  },

  /**
   * Get all available service providers
   */
  async getServiceProviders() {
    return this.request('/services/providers/all');
  },
};
