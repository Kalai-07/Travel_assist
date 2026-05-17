#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TravelAssist ML Service
Flask API for Vehicle Diagnostics (OBD-II) + Trip Planning (Hotels, Restaurants, Places)
"""

import os
import json
import sys
import io
import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from models import full_trip_plan, get_available_cities, recommend_hotels, recommend_restaurants, recommend_places

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

app = Flask(__name__)
CORS(app)

# Global model and scaler
model = None
scaler = None
metadata = None

CLASS_NAMES = ['Normal', 'Warning', 'Critical']
SENSOR_FEATURES = [
    'engine_temp', 'battery_voltage', 'rpm',
    'tire_pressure_fl', 'tire_pressure_fr', 'tire_pressure_rl', 'tire_pressure_rr',
    'oil_pressure', 'coolant_temp', 'fuel_level'
]

SENSOR_RANGES = {
    'engine_temp': (60, 135),
    'battery_voltage': (10, 15.5),
    'rpm': (0, 6500),
    'tire_pressure_fl': (14, 50),
    'tire_pressure_fr': (14, 50),
    'tire_pressure_rl': (14, 50),
    'tire_pressure_rr': (14, 50),
    'oil_pressure': (5, 80),
    'coolant_temp': (60, 135),
    'fuel_level': (0, 100)
}


def load_model():
    """Load trained model and scaler from disk"""
    global model, scaler, metadata

    model_path = os.path.join(os.path.dirname(__file__), 'travelassist_rf_model.pkl')
    scaler_path = os.path.join(os.path.dirname(__file__), 'travelassist_scaler.pkl')
    metadata_path = os.path.join(os.path.dirname(__file__), 'travelassist_model_metadata.json')

    if not os.path.exists(model_path) or not os.path.exists(scaler_path):
        raise FileNotFoundError(
            f"Model files not found. Expected:\n"
            f"  {model_path}\n"
            f"  {scaler_path}\n"
            "Run the Jupyter notebook first to generate these files."
        )

    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)

    if os.path.exists(metadata_path):
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
    else:
        metadata = {'model_version': 'RF_v1.0', 'features': SENSOR_FEATURES}

    print(f"Model loaded successfully")
    print(f"   Estimators: {model.n_estimators}")
    print(f"   Test Accuracy: {metadata.get('test_accuracy', 'N/A')}%")


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'service': 'TravelAssist ML Diagnostics',
        'model_loaded': model is not None and scaler is not None,
        'timestamp': datetime.utcnow().isoformat()
    }), 200


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict vehicle health from OBD-II sensor readings

    Request JSON:
    {
        "sensors": {
            "engine_temp": 87.5,
            "battery_voltage": 13.8,
            ...
        }
    }
    """
    try:
        if model is None or scaler is None:
            return jsonify({
                'error': 'Model not loaded',
                'message': 'ML service is not ready'
            }), 503

        data = request.get_json()
        if not data or 'sensors' not in data:
            return jsonify({
                'error': 'Invalid request',
                'message': 'Missing "sensors" field in request body'
            }), 400

        sensors = data['sensors']

        # Validate sensor input
        errors = []
        for feature in SENSOR_FEATURES:
            if feature not in sensors:
                errors.append(f"Missing sensor: {feature}")
            else:
                value = sensors[feature]
                min_val, max_val = SENSOR_RANGES[feature]
                if not (min_val <= value <= max_val):
                    errors.append(
                        f"{feature} out of range: {value} "
                        f"(expected {min_val}-{max_val})"
                    )

        if errors:
            return jsonify({
                'error': 'Invalid sensor values',
                'details': errors
            }), 400

        # Prepare sensor array in correct feature order
        sensor_array = np.array([[sensors[f] for f in SENSOR_FEATURES]])

        # Scale and predict
        sensor_scaled = scaler.transform(sensor_array)
        prediction_class = model.predict(sensor_scaled)[0]
        probabilities = model.predict_proba(sensor_scaled)[0]

        # Format response
        class_name = CLASS_NAMES[prediction_class]
        confidence = float(probabilities[prediction_class])

        response = {
            'success': True,
            'prediction': {
                'class': class_name,
                'classId': int(prediction_class),
                'confidence': round(confidence, 4),
                'probabilities': {
                    CLASS_NAMES[i]: round(float(probabilities[i]), 4)
                    for i in range(len(CLASS_NAMES))
                }
            },
            'timestamp': datetime.utcnow().isoformat(),
            'modelVersion': metadata.get('model_version', 'RF_v1.0')
        }

        return jsonify(response), 200

    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({
            'error': 'Prediction failed',
            'message': str(e)
        }), 500


@app.route('/model-info', methods=['GET'])
def model_info():
    """Get model metadata"""
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 503

    return jsonify({
        'model_type': 'Random Forest Classifier',
        'n_estimators': model.n_estimators,
        'classes': CLASS_NAMES,
        'features': SENSOR_FEATURES,
        'sensor_ranges': SENSOR_RANGES,
        'metadata': metadata
    }), 200


@app.errorhandler(404)
def not_found(error):
    """404 handler"""
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def server_error(error):
    """500 handler"""
    return jsonify({
        'error': 'Internal server error',
        'message': str(error)
    }), 500


# ============================================================================
# TRIP PLANNING API ENDPOINTS
# ============================================================================

@app.route('/api/trip/plan', methods=['POST'])
def trip_plan():
    """Complete trip planning API endpoint."""
    try:
        data = request.json
        result = full_trip_plan(
            from_city=data.get('from_city', ''),
            to_city=data.get('to_city', ''),
            distance_km=float(data.get('distance_km', 100)),
            budget_inr=float(data.get('budget_inr', 50000)),
            days=int(data.get('days', 3)),
            style=data.get('style', 'comfort'),
            interests=data.get('interests', []),
            veg_only=data.get('veg_only', False)
        )
        return jsonify({'success': True, 'data': result}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/trip/cities', methods=['GET'])
def get_cities():
    """Get all available cities."""
    try:
        cities = get_available_cities()
        return jsonify({'success': True, 'cities': cities}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/trip/hotels', methods=['POST'])
def get_hotels():
    """Get hotel recommendations."""
    try:
        data = request.json
        hotels = recommend_hotels(
            city=data.get('city', ''),
            style=data.get('style', 'comfort'),
            budget_per_night=float(data.get('budget_per_night', 10000)) if data.get('budget_per_night') else None,
            top_n=int(data.get('top_n', 5))
        )
        return jsonify({'success': True, 'hotels': hotels}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/trip/restaurants', methods=['POST'])
def get_restaurants():
    """Get restaurant recommendations."""
    try:
        data = request.json
        restaurants = recommend_restaurants(
            city=data.get('city', ''),
            interests=data.get('interests', []),
            veg_only=data.get('veg_only', False),
            style=data.get('style', 'comfort'),
            top_n=int(data.get('top_n', 5))
        )
        return jsonify({'success': True, 'restaurants': restaurants}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/trip/places', methods=['POST'])
def get_places():
    """Get place recommendations."""
    try:
        data = request.json
        places = recommend_places(
            city=data.get('city', ''),
            interests=data.get('interests', []),
            top_n=int(data.get('top_n', 5))
        )
        return jsonify({'success': True, 'places': places}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    try:
        load_model()
        port = int(os.environ.get('PORT', 5001))
        print(f"Starting TravelAssist ML Service on port {port}...")
        print(f"Health check: http://localhost:{port}/health")
        print(f"Predict endpoint: POST http://localhost:{port}/predict")
        print(f"Model info: http://localhost:{port}/model-info\n")
        app.run(host='0.0.0.0', port=port, debug=False)
    except FileNotFoundError as e:
        print(f"Startup Error:\n{e}")
        exit(1)
    except Exception as e:
        print(f"Fatal Error: {e}")
        exit(1)
