# TravelAssist ML Service

Flask API for Random Forest vehicle health predictions based on OBD-II sensor data.

## Setup

### 1. Generate Model Files from Notebook

First, run the Jupyter notebook to train and save the model:

```bash
cd ../
jupyter notebook TravelAssist_VehicleDiagnostics_RF.ipynb
```

The notebook will save these files in the same directory as itself:
- `travelassist_rf_model.pkl`
- `travelassist_scaler.pkl`
- `travelassist_model_metadata.json`

Copy these files to the `ml_service/` directory:

```bash
cp ../travelassist_rf_model.pkl ./
cp ../travelassist_scaler.pkl ./
cp ../travelassist_model_metadata.json ./
```

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

Or using conda:
```bash
conda create -n travelassist-ml python=3.9
conda activate travelassist-ml
pip install -r requirements.txt
```

## Running the Service

```bash
python app.py
```

The service will start on `http://localhost:5001` by default.

To use a different port:
```bash
PORT=5002 python app.py
```

## API Endpoints

### Health Check
```
GET /health
```

Returns:
```json
{
  "status": "OK",
  "service": "TravelAssist ML Diagnostics",
  "model_loaded": true,
  "timestamp": "2026-05-17T10:30:00.000Z"
}
```

### Predict Vehicle Health
```
POST /predict
Content-Type: application/json

{
  "sensors": {
    "engine_temp": 87.5,
    "battery_voltage": 13.8,
    "rpm": 1500,
    "tire_pressure_fl": 32,
    "tire_pressure_fr": 33,
    "tire_pressure_rl": 31,
    "tire_pressure_rr": 32,
    "oil_pressure": 50,
    "coolant_temp": 88,
    "fuel_level": 65
  }
}
```

Response (200 OK):
```json
{
  "success": true,
  "prediction": {
    "class": "Normal",
    "classId": 0,
    "confidence": 0.9531,
    "probabilities": {
      "Normal": 0.9531,
      "Warning": 0.0402,
      "Critical": 0.0067
    }
  },
  "timestamp": "2026-05-17T10:30:00.000Z",
  "modelVersion": "RF_v1.0"
}
```

### Model Info
```
GET /model-info
```

Returns model metadata, features, and sensor ranges.

## Error Handling

### Service Unavailable (503)
```json
{
  "error": "Model not loaded",
  "message": "ML service is not ready"
}
```

### Invalid Request (400)
```json
{
  "error": "Invalid request",
  "message": "Missing \"sensors\" field in request body"
}
```

### Out of Range Sensors (400)
```json
{
  "error": "Invalid sensor values",
  "details": [
    "engine_temp out of range: 150 (expected 60-135)"
  ]
}
```

## Testing

### Test with curl
```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{
    "sensors": {
      "engine_temp": 85,
      "battery_voltage": 13.8,
      "rpm": 1200,
      "tire_pressure_fl": 32,
      "tire_pressure_fr": 33,
      "tire_pressure_rl": 31,
      "tire_pressure_rr": 32,
      "oil_pressure": 50,
      "coolant_temp": 88,
      "fuel_level": 65
    }
  }'
```

### Test Cases from Notebook

**Demo 1 - Healthy Vehicle (Expected: Normal ~95% confidence)**
```json
{
  "sensors": {
    "engine_temp": 85, "battery_voltage": 13.8, "rpm": 1200,
    "tire_pressure_fl": 32, "tire_pressure_fr": 33,
    "tire_pressure_rl": 31, "tire_pressure_rr": 32,
    "oil_pressure": 50, "coolant_temp": 88, "fuel_level": 65
  }
}
```

**Demo 2 - Warning State (Expected: Warning ~80%+ confidence)**
```json
{
  "sensors": {
    "engine_temp": 98, "battery_voltage": 12.2, "rpm": 4200,
    "tire_pressure_fl": 25, "tire_pressure_fr": 32,
    "tire_pressure_rl": 32, "tire_pressure_rr": 32,
    "oil_pressure": 28, "coolant_temp": 102, "fuel_level": 12
  }
}
```

**Demo 3 - Critical State (Expected: Critical ~90%+ confidence)**
```json
{
  "sensors": {
    "engine_temp": 118, "battery_voltage": 11.2, "rpm": 5500,
    "tire_pressure_fl": 18, "tire_pressure_fr": 32,
    "tire_pressure_rl": 32, "tire_pressure_rr": 32,
    "oil_pressure": 12, "coolant_temp": 120, "fuel_level": 3
  }
}
```

## Troubleshooting

### Model Files Not Found
Ensure the model files are in the `ml_service/` directory:
- `travelassist_rf_model.pkl`
- `travelassist_scaler.pkl`
- `travelassist_model_metadata.json` (optional)

### Port Already in Use
Change the port:
```bash
PORT=5002 python app.py
```

### CORS Issues
The service includes CORS headers. If you still have issues, check that the `flask-cors` package is installed.

## Production Deployment

### Docker
Create a `Dockerfile` in the `ml_service/` directory:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "app.py"]
```

Build and run:
```bash
docker build -t travelassist-ml .
docker run -p 5001:5001 travelassist-ml
```

## Development Notes

- Model file size: ~5-10 MB (ensure it's included in deployment)
- Prediction latency: ~50-100 ms per request
- Single-threaded by default; use Gunicorn for production:
  ```bash
  pip install gunicorn
  gunicorn -w 4 -b 0.0.0.0:5001 app:app
  ```
