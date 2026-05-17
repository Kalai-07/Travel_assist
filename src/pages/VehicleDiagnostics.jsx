import { useState } from 'react';
import { C }     from '../constants/theme';
import Card      from '../components/common/Card';
import Badge     from '../components/common/Badge';
import Btn       from '../components/common/Btn';
import Icon      from '../components/common/Icon';
import { apiClient } from '../utils/apiClient';

const SENSOR_CONFIG = [
  { key: 'engine_temp', label: 'Engine Temperature', unit: '°C', min: 60, max: 130, warnHigh: 95 },
  { key: 'battery_voltage', label: 'Battery Voltage', unit: 'V', min: 10, max: 15.5, warnLow: 12.4 },
  { key: 'rpm', label: 'Engine RPM', unit: '', min: 0, max: 6000, warnHigh: 4500 },
  { key: 'tire_pressure_fl', label: 'Tyre Pressure FL', unit: ' PSI', min: 20, max: 50, warnLow: 26 },
  { key: 'tire_pressure_fr', label: 'Tyre Pressure FR', unit: ' PSI', min: 20, max: 50, warnLow: 26 },
  { key: 'tire_pressure_rl', label: 'Tyre Pressure RL', unit: ' PSI', min: 20, max: 50, warnLow: 26 },
  { key: 'tire_pressure_rr', label: 'Tyre Pressure RR', unit: ' PSI', min: 20, max: 50, warnLow: 26 },
  { key: 'oil_pressure', label: 'Oil Pressure', unit: ' PSI', min: 10, max: 80, warnLow: 30 },
  { key: 'coolant_temp', label: 'Coolant Temp', unit: '°C', min: 60, max: 130, warnHigh: 100 },
  { key: 'fuel_level', label: 'Fuel Level', unit: '%', min: 0, max: 100, warnLow: 20 },
];

const FAULT_HISTORY = [
  { date: '2025-12-14', fault: 'Engine Overheating',               severity: 'Warning',  status: 'Resolved'  },
  { date: '2025-11-30', fault: 'Low Battery Voltage (11.9 V)',     severity: 'Critical', status: 'Resolved'  },
  { date: '2025-11-10', fault: 'Tyre Pressure Low — FL (24 PSI)',  severity: 'Warning',  status: 'Resolved'  },
  { date: '2025-10-05', fault: 'Oil Pressure Check',               severity: 'Normal',   status: 'No Action' },
];

const resultMsg = {
  Normal:   '✅ All OBD-II parameters within safe range. No immediate action required.',
  Warning:  '⚠️ Some sensors near threshold. Schedule a mechanic visit soon.',
  Critical: '🚨 Multiple critical readings detected. Stop safely and call assistance.',
};

const VehicleDiagnostics = ({ vehicleId = 'demo-vehicle' }) => {
  const [sensors, setSensors] = useState({
    engine_temp: 87,
    battery_voltage: 13.8,
    rpm: 780,
    tire_pressure_fl: 32,
    tire_pressure_fr: 33,
    tire_pressure_rl: 31,
    tire_pressure_rr: 32,
    oil_pressure: 45,
    coolant_temp: 88,
    fuel_level: 65,
  });
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [faultHistory, setFaultHistory] = useState(FAULT_HISTORY);

  const runDiag = async () => {
    setRunning(true);
    setError(null);
    setResult(null);

    try {
      const response = await apiClient.predictVehicleHealth(vehicleId, {
        engine_temp: sensors.engine_temp,
        battery_voltage: sensors.battery_voltage,
        rpm: sensors.rpm,
        tire_pressure_fl: sensors.tire_pressure_fl,
        tire_pressure_fr: sensors.tire_pressure_fr,
        tire_pressure_rl: sensors.tire_pressure_rl,
        tire_pressure_rr: sensors.tire_pressure_rr,
        oil_pressure: sensors.oil_pressure,
        coolant_temp: sensors.coolant_temp,
        fuel_level: sensors.fuel_level,
      });

      if (response.success && response.data.prediction) {
        const prediction = response.data.prediction;
        setResult({
          cls: prediction.class,
          conf: Math.round(prediction.confidence * 100),
          probabilities: prediction.probabilities,
          timestamp: new Date(response.data.timestamp),
        });

        // Add to fault history if not Normal
        if (prediction.class !== 'Normal') {
          const newFault = {
            date: new Date().toISOString().split('T')[0],
            fault: `ML Prediction: ${prediction.class} (${Math.round(prediction.confidence * 100)}% confidence)`,
            severity: prediction.class,
            status: 'Pending',
          };
          setFaultHistory((prev) => [newFault, ...prev]);
        }
      } else {
        setError(response.message || 'Failed to get prediction');
      }
    } catch (err) {
      setError(
        err.message.includes('ML Service')
          ? 'ML service unavailable. Please try again later.'
          : 'Failed to run diagnostics. Please check your connection.'
      );
      console.error('Diagnostics error:', err);
    } finally {
      setRunning(false);
    }
  };

  const health = result
    ? Math.round(result.probabilities.Normal * 100)
    : Math.max(20, 100 - (sensors.engine_temp > 95 ? 18 : 0) - (sensors.battery_voltage < 12.4 ? 15 : 0) - (sensors.oil_pressure < 30 ? 12 : 0) - (sensors.coolant_temp > 100 ? 10 : 0));
  const rColor  = result ? (result.cls === 'Normal' ? C.green : result.cls === 'Warning' ? C.orange : C.red) : C.border;

  return (
    <div className="fade-in" style={{ padding: '32px 28px', maxWidth: 1120, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: C.dark, marginBottom: 4 }}>Vehicle Health Check</h1>
        <p style={{ color: C.muted, fontSize: 14 }}>
          Get a complete analysis of your vehicle's condition —&nbsp;
          <strong>Normal / Warning / Critical</strong>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 310px', gap: 18, marginBottom: 18 }}>

        {/* Sensor sliders */}
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 4 }}>Live Vehicle Sensors</h3>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>Drag sliders to simulate different vehicle conditions</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {SENSOR_CONFIG.map((s) => {
              const v = sensors[s.key];
              const bad = s.warnHigh ? v > s.warnHigh : v < s.warnLow;
              const pct = ((v - s.min) / (s.max - s.min)) * 100;
              const barColor = bad ? C.orange : C.green;

              return (
                <div key={s.key} style={{ background: C.bg, borderRadius: 12, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.sub }}>{s.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: bad ? C.orange : C.dark }}>
                      {v}{s.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step="0.1"
                    value={v}
                    onChange={(e) => setSensors((p) => ({ ...p, [s.key]: parseFloat(e.target.value) }))}
                    style={{ width: '100%', accentColor: barColor, marginBottom: 8 }}
                  />
                  <div style={{ background: C.border, borderRadius: 4, height: 5 }}>
                    <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, height: '100%', background: barColor, borderRadius: 4, transition: 'width .3s' }} />
                  </div>
                </div>
              );
            })}
          </div>

          <Btn onClick={runDiag} disabled={running} size="lg" style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}>
            {running ? '🔍 Analyzing sensors...' : '🤖 Check Vehicle Health'}
          </Btn>
        </Card>

        {/* Health gauge + ML result */}
        <div>

          {/* Health gauge */}
          <Card style={{ textAlign: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 16 }}>Health Score</h3>
            <svg width={150} height={90} viewBox="0 0 150 90" style={{ margin: '0 auto', display: 'block' }}>
              <path d="M 15 75 A 60 60 0 0 1 135 75" stroke={C.border} strokeWidth="13" fill="none" strokeLinecap="round" />
              <path
                d="M 15 75 A 60 60 0 0 1 135 75"
                stroke={health > 70 ? C.green : health > 40 ? C.orange : C.red}
                strokeWidth="13"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(health / 100) * 188} 188`}
                style={{ transition: 'stroke-dasharray .8s ease' }}
              />
              <text x="75" y="68" textAnchor="middle" fontSize="24" fontWeight="800" fill={C.dark} fontFamily="Outfit">{health}</text>
              <text x="75" y="82" textAnchor="middle" fontSize="10" fill={C.muted}>/ 100</text>
            </svg>
            <p style={{ fontSize: 13, fontWeight: 700, marginTop: 8, color: health > 70 ? C.green : health > 40 ? C.orange : C.red }}>
              {health > 80 ? 'Excellent' : health > 60 ? 'Good' : health > 40 ? 'Fair' : 'Needs Attention'}
            </p>
          </Card>

          {/* ML result card */}
          <Card style={{ border: `1.5px solid ${rColor}`, background: result ? `${rColor}08` : C.card, transition: 'all .4s' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 12 }}>Vehicle Status</h3>
            {error ? (
              <div style={{ textAlign: 'center', padding: '28px 12px', color: C.red }}>
                <Icon name="alert-circle" size={36} color={C.red} />
                <p style={{ marginTop: 12, fontSize: 13 }}>{error}</p>
              </div>
            ) : !result ? (
              <div style={{ textAlign: 'center', padding: '28px 0', color: C.muted }}>
                <Icon name="activity" size={36} color={C.muted} />
                <p style={{ marginTop: 12, fontSize: 13 }}>Run diagnosis to see ML result</p>
              </div>
            ) : (
              <div className="fade-in">
                <div style={{ textAlign: 'center', padding: '12px 0 16px' }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 38, fontWeight: 900, color: rColor }}>
                    {result.cls}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                    Confidence: <strong style={{ color: C.dark }}>{result.conf}%</strong>
                  </div>
                </div>
                {/* Probability breakdown */}
                <div style={{ background: 'rgba(255,255,255,.6)', borderRadius: 10, padding: 12, marginBottom: 12 }}>
                  {['Normal', 'Warning', 'Critical'].map((cls) => (
                    <div key={cls} style={{ display: 'flex', alignItems: 'center', marginBottom: cls === 'Critical' ? 0 : 8, fontSize: 12 }}>
                      <span style={{ minWidth: 60, fontWeight: 600, color: C.dark }}>{cls}</span>
                      <div style={{ flex: 1, background: C.border, borderRadius: 4, height: 5, margin: '0 8px' }}>
                        <div style={{
                          width: `${(result.probabilities[cls] || 0) * 100}%`,
                          height: '100%',
                          background: cls === 'Normal' ? C.green : cls === 'Warning' ? C.orange : C.red,
                          borderRadius: 4,
                          transition: 'width .3s'
                        }} />
                      </div>
                      <span style={{ minWidth: 40, textAlign: 'right', color: C.muted }}>
                        {Math.round((result.probabilities[cls] || 0) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(255,255,255,.8)', borderRadius: 10, padding: 12, fontSize: 13, color: C.sub, lineHeight: 1.5 }}>
                  {resultMsg[result.cls]}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Fault history table */}
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 16 }}>Diagnostic History</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                {['Date', 'Fault Description', 'Severity', 'Status'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: C.muted, fontWeight: 600, fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {faultHistory.map((f, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '12px 12px', color: C.muted, whiteSpace: 'nowrap' }}>{f.date}</td>
                  <td style={{ padding: '12px 12px', fontWeight: 500, color: C.dark }}>{f.fault}</td>
                  <td style={{ padding: '12px 12px' }}>
                    <Badge label={f.severity} color={f.severity === 'Normal' ? 'green' : f.severity === 'Warning' ? 'orange' : 'red'} />
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <Badge label={f.status} color={f.status === 'Resolved' ? 'blue' : f.status === 'Pending' ? 'orange' : 'green'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default VehicleDiagnostics;
