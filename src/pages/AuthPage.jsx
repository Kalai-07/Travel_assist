import { useState } from 'react';
import { C } from '../constants/theme';
import GStyle from '../components/common/GStyle';
import Icon from '../components/common/Icon';
import Btn from '../components/common/Btn';
import { apiClient } from '../utils/apiClient';

const FEATURES = [
  { icon: 'activity',   text: 'AI-Powered Vehicle Diagnostics' },
  { icon: 'zap',        text: 'EV Charging Network Locator' },
  { icon: 'wrench',     text: '24/7 Roadside Assistance' },
  { icon: 'map',        text: 'Intelligent Trip Planning' },
  { icon: 'shield',     text: 'Real-time Safety Alerts' },
];

const AuthPage = ({ onLogin }) => {
  const [mode,    setMode]    = useState('login');
  const [form,    setForm]    = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    licenseNumber: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState('');

  const handle = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async () => {
    if (!form.email || !form.password) { setErr('Please fill all required fields.'); return; }
    if (mode === 'register' && !form.name) { setErr('Name is required for registration.'); return; }
    if (mode === 'register' && !form.phone) { setErr('Phone number is required for registration.'); return; }
    if (mode === 'register' && !form.licenseNumber) { setErr('License number is required for registration.'); return; }

    setErr('');
    setLoading(true);

    try {
      let response;
      if (mode === 'login') {
        response = await apiClient.request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
      } else {
        response = await apiClient.request('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
            licenseNumber: form.licenseNumber,
            insuranceProvider: form.insuranceProvider,
            insurancePolicyNumber: form.insurancePolicyNumber,
            emergencyContact: { name: '', phone: '', relationship: '' },
          }),
        });
      }

      if (response.success) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        onLogin({
          name: response.user.name,
          email: response.user.email,
          _id: response.user._id,
        });
      } else {
        setErr(response.message || 'Authentication failed');
      }
    } catch (error) {
      setErr(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => { setMode((m) => (m === 'login' ? 'register' : 'login')); setErr(''); };

  const inp = {
    width:        '100%',
    padding:      '11px 14px',
    border:       `1.5px solid ${C.border}`,
    borderRadius: 10,
    fontSize:     14,
    background:   '#fff',
    color:        C.dark,
    display:      'block',
    marginBottom: 12,
    transition:   'border-color .2s',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: `linear-gradient(135deg, ${C.bg} 0%, #E0EAFF 50%, #D1FAE5 100%)` }}>
      <GStyle />

      {/* ── Left panel ─────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 48 }}>
        <div style={{ maxWidth: 380, width: '100%' }}>

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.green})`, borderRadius: 18, width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 24px ${C.primary}40` }}>
              <Icon name="navigation" size={28} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 800, color: C.dark, lineHeight: 1 }}>TravelAssist</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>AI-Driven Mobility Platform</div>
            </div>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.dark, marginBottom: 8 }}>
            Everything a traveler needs, in one place.
          </h2>
          <p style={{ color: C.sub, fontSize: 14, marginBottom: 32, lineHeight: 1.7 }}>
            From vehicle diagnostics to emergency SOS — TravelAssist keeps you safe and moving.
          </p>

          {/* Feature pills */}
          {FEATURES.map((f) => (
            <div
              key={f.text}
              style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.75)', borderRadius: 12, padding: '11px 16px', backdropFilter: 'blur(8px)', border: `1px solid ${C.border}`, marginBottom: 10 }}
            >
              <div style={{ background: C.pLight, borderRadius: 9, padding: 7 }}>
                <Icon name={f.icon} size={15} color={C.primary} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel (form) ──────────────────────── */}
      <div
        style={{
          width:          460,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        48,
          background:     'rgba(255,255,255,.65)',
          backdropFilter: 'blur(20px)',
          borderLeft:     `1px solid ${C.border}`,
        }}
      >
        <div style={{ width: '100%', maxWidth: 360 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6, color: C.dark }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>
            {mode === 'login' ? 'Sign in to your TravelAssist account' : 'Join thousands of smart travelers'}
          </p>

          {mode === 'register' && (
            <>
              <input style={inp} placeholder="Full Name" value={form.name} onChange={handle('name')} />
              <input style={inp} placeholder="Email address" type="email" value={form.email} onChange={handle('email')} />
              <input style={inp} placeholder="Phone number" type="tel" value={form.phone} onChange={handle('phone')} />
              <input style={inp} placeholder="License Number" value={form.licenseNumber} onChange={handle('licenseNumber')} />
              <input style={inp} placeholder="Insurance Provider (Optional)" value={form.insuranceProvider} onChange={handle('insuranceProvider')} />
              <input style={inp} placeholder="Insurance Policy Number (Optional)" value={form.insurancePolicyNumber} onChange={handle('insurancePolicyNumber')} />
              <input style={inp} placeholder="Password" type="password" value={form.password} onChange={handle('password')} />
            </>
          )}
          {mode === 'login' && (
            <>
              <input style={inp} placeholder="Email address" type="email" value={form.email} onChange={handle('email')} />
              <input style={inp} placeholder="Password" type="password" value={form.password} onChange={handle('password')} />
            </>
          )}

          {err && <p style={{ color: C.red, fontSize: 13, marginBottom: 12 }}>{err}</p>}

          <Btn onClick={submit} size="lg" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}>
            {loading ? '⏳ Please wait...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </Btn>

          <p style={{ textAlign: 'center', fontSize: 14, color: C.muted }}>
            {mode === 'login' ? "No account? " : 'Have an account? '}
            <span style={{ color: C.primary, fontWeight: 600, cursor: 'pointer' }} onClick={switchMode}>
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </span>
          </p>

          {/* Demo hint */}
          <div style={{ marginTop: 24, background: C.pLight, borderRadius: 12, padding: '12px 16px', fontSize: 13, color: C.sub, border: `1px solid ${C.pMid}` }}>
            <strong style={{ color: C.primary }}>Live Mode:</strong> Register a new account or log in with your credentials.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
