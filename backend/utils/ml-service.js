import axios from 'axios';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';
const ML_SERVICE_TIMEOUT = parseInt(process.env.ML_SERVICE_TIMEOUT || '5000');

class MLServiceClient {
  /**
   * Check if ML service is available
   */
  async isHealthy() {
    try {
      const response = await axios.get(`${ML_SERVICE_URL}/health`, {
        timeout: ML_SERVICE_TIMEOUT,
      });
      return response.status === 200 && response.data.model_loaded;
    } catch (error) {
      console.warn('ML Service health check failed:', error.message);
      return false;
    }
  }

  /**
   * Get vehicle health prediction from ML model
   * @param {Object} sensors - Sensor data object with OBD-II readings
   * @returns {Promise<Object>} Prediction result { class, confidence, probabilities }
   */
  async predict(sensors) {
    try {
      if (!this._validateSensors(sensors)) {
        throw new Error('Invalid sensor data provided');
      }

      const response = await axios.post(
        `${ML_SERVICE_URL}/predict`,
        { sensors },
        { timeout: ML_SERVICE_TIMEOUT }
      );

      if (response.status === 200 && response.data.success) {
        return response.data.prediction;
      }

      throw new Error(`ML Service returned status ${response.status}`);
    } catch (error) {
      if (error.response) {
        // ML service returned an error
        throw new Error(
          `ML Service Error: ${error.response.data?.message || error.message}`
        );
      } else if (error.code === 'ECONNREFUSED') {
        throw new Error(
          'ML Service unavailable. Make sure it is running on port 5001.'
        );
      } else if (error.code === 'ECONNABORTED') {
        throw new Error(
          'ML Service request timeout. Please try again later.'
        );
      }
      throw error;
    }
  }

  /**
   * Validate sensor data structure
   */
  _validateSensors(sensors) {
    const requiredFields = [
      'engine_temp', 'battery_voltage', 'rpm',
      'tire_pressure_fl', 'tire_pressure_fr', 'tire_pressure_rl', 'tire_pressure_rr',
      'oil_pressure', 'coolant_temp', 'fuel_level'
    ];

    return requiredFields.every(field => typeof sensors[field] === 'number');
  }

  /**
   * Get model metadata and configuration
   */
  async getModelInfo() {
    try {
      const response = await axios.get(`${ML_SERVICE_URL}/model-info`, {
        timeout: ML_SERVICE_TIMEOUT,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch ML model information');
    }
  }
}

export default new MLServiceClient();
