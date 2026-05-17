import { useState, useEffect } from 'react';
import { C }  from '../constants/theme';
import Card   from '../components/common/Card';
import Badge  from '../components/common/Badge';
import Btn    from '../components/common/Btn';
import Icon   from '../components/common/Icon';
import { apiClient } from '../utils/apiClient';
import { getCoordinates, getAddressFromCoordinates, calculateDistance } from '../utils/geolocation';

const TABS = [
  { id: 'emergency', label: 'Emergency', icon: 'sos', type: 'roadside' },
  { id: 'fuel',      label: 'Fuel',      icon: 'fuel', type: 'fuel' },
  { id: 'ev',        label: 'EV Charging',icon: 'zap', type: 'charging' },
  { id: 'repair',    label: 'Repair',    icon: 'wrench', type: 'mechanical' },
];

const TAB_COLORS = { emergency: '#DC2626', fuel: '#D97706', ev: '#059669', repair: '#1A6BDB' };
const TAB_BGS    = { emergency: '#FEF2F2', fuel: '#FFFBEB', ev: '#ECFDF5', repair: '#EEF4FF' };

const DEFAULT_PROVIDERS = {
  emergency: [
    { name: '24×7 Roadside Assistance Pro',  rating: 4.8, latitude: 13.0900, longitude: 80.2800, price: 'Free SOS', avail: true, desc: 'Full breakdown support, towing, lockout' },
    { name: 'National Highway Emergency',     rating: 4.6, latitude: 13.0750, longitude: 80.2850, price: '₹ 299/call', avail: true, desc: 'NHAI-authorized emergency crew' },
    { name: 'AutoRescue Premium',             rating: 4.5, latitude: 13.0650, longitude: 80.2950, price: '₹ 199/call', avail: false, desc: 'Pan-India roadside coverage' },
  ],
  fuel: [
    { name: 'QuickFuel Delivery',   rating: 4.7, latitude: 13.0850, longitude: 80.2750, price: 'Market rate', avail: true, desc: 'Petrol, Diesel & CNG delivery to your location' },
    { name: 'FuelMate Express',     rating: 4.5, latitude: 13.0920, longitude: 80.2820, price: 'Market rate + ₹49', avail: true, desc: 'Doorstep fuel with digital receipt' },
    { name: 'Highway Fuelers',      rating: 4.2, latitude: 13.0550, longitude: 80.3050, price: 'Market rate', avail: false, desc: 'Bulk fuel delivery, highway routes' },
  ],
  ev: [
    { name: 'Tata Power DC Fast Charge', rating: 4.9, latitude: 13.1050, longitude: 80.2650, price: '₹ 18/kWh', avail: true, desc: '150 kW DC charger · 30 min to 80%' },
    { name: 'EESL Charging Hub',         rating: 4.3, latitude: 13.0750, longitude: 80.2950, price: '₹ 15/kWh', avail: true, desc: 'AC/DC · Multiple connectors available' },
    { name: 'Ather Grid Station',        rating: 4.7, latitude: 13.0650, longitude: 80.3100, price: '₹ 20/kWh', avail: false, desc: 'Ather-compatible fast charger' },
  ],
  repair: [
    { name: 'AutoFix Mobile Mechanic', rating: 4.8, latitude: 13.0880, longitude: 80.2780, price: 'From ₹ 499', avail: true, desc: 'On-site tyre, battery & engine service' },
    { name: 'MechanicNow',             rating: 4.6, latitude: 13.0800, longitude: 80.2900, price: 'From ₹ 399', avail: true, desc: 'Certified mechanics, 90-day warranty' },
    { name: 'Royal Garage Towing',     rating: 4.4, latitude: 13.0700, longitude: 80.2600, price: 'From ₹ 699', avail: true, desc: 'Flatbed towing, accident recovery' },
  ],
};

const Services = () => {
  const [tab,      setTab]      = useState('emergency');
  const [booked,   setBooked]   = useState(null);
  const [location, setLocation] = useState(null);
  const [address,  setAddress]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [providers, setProviders] = useState(DEFAULT_PROVIDERS.emergency);

  // Request geolocation on mount
  useEffect(() => {
    const getLocation = async () => {
      setLoading(true);
      try {
        const coords = await getCoordinates();
        setLocation(coords);

        // Get address from coordinates
        const addressData = await getAddressFromCoordinates(coords.latitude, coords.longitude);
        setAddress(addressData);
        setError('');
      } catch (err) {
        console.log('Geolocation error:', err);
        setError('Unable to access your location. Showing nearby services based on default location.');
        // Use default location (Chennai, India)
        const defaultLoc = { latitude: 13.0827, longitude: 80.2707 };
        setLocation(defaultLoc);
        const addressData = await getAddressFromCoordinates(defaultLoc.latitude, defaultLoc.longitude);
        setAddress(addressData);
      } finally {
        setLoading(false);
      }
    };

    if ('geolocation' in navigator) {
      getLocation();
    } else {
      setError('Geolocation not supported by your browser');
    }
  }, []);

  // Load providers when tab changes
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const response = await apiClient.getServiceProviders();
        if (response.success) {
          const tabProviders = response.providers.filter(p => {
            const TYPE_MAP = {
              emergency: 'roadside',
              fuel: 'fuel',
              ev: 'charging',
              repair: 'mechanical',
            };
            return p.type === TYPE_MAP[tab];
          });
          setProviders(tabProviders.length > 0 ? tabProviders : DEFAULT_PROVIDERS[tab]);
        }
      } catch (err) {
        console.error('Error fetching providers:', err);
        setProviders(DEFAULT_PROVIDERS[tab]);
      }
    };

    loadProviders();
  }, [tab]);

  const activeIcon = TABS.find((t) => t.id === tab).icon;

  // Calculate distances and sort providers
  const sortedProviders = location ? [...providers]
    .map(p => ({
      ...p,
      distance: calculateDistance(location.latitude, location.longitude, p.latitude, p.longitude)
    }))
    .sort((a, b) => {
      if (a.avail !== b.avail) return a.avail ? -1 : 1;
      return (a.distance || 999) - (b.distance || 999);
    })
  : providers;

  return (
    <div className="fade-in" style={{ padding: '32px 28px', maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: C.dark, marginBottom: 4 }}>On-Demand Services</h1>
        <p style={{ color: C.muted, fontSize: 14 }}>
          {location ? `📍 Services near you (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})` : 'Finding services near you...'}
        </p>
        {error && <p style={{ color: C.red, fontSize: 13, marginTop: 8 }}>⚠️ {error}</p>}
      </div>

      {/* Current Location Card */}
      {location && (
        <Card style={{ marginBottom: 20, background: `linear-gradient(135deg, ${C.primary}10, ${C.green}10)`, border: `1px solid ${C.pMid}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Icon name="map-pin" size={24} color={C.primary} />
            <div>
              <div style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>YOUR CURRENT LOCATION</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginTop: 4 }}>
                Latitude: {location.latitude.toFixed(4)} | Longitude: {location.longitude.toFixed(4)}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: C.card, padding: 6, borderRadius: 14, border: `1px solid ${C.border}`, width: 'fit-content' }}>
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <div
              key={t.id}
              onClick={() => { setTab(t.id); setBooked(null); }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 10, cursor: 'pointer', transition: 'all .2s', background: active ? TAB_COLORS[t.id] : 'transparent', color: active ? '#fff' : C.sub, fontWeight: active ? 600 : 400, fontSize: 14 }}
            >
              <Icon name={t.icon} size={15} color={active ? '#fff' : C.sub} />
              {t.label}
            </div>
          );
        })}
      </div>

      {/* Provider list - sorted by distance */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {sortedProviders.map((p, i) => (
          <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px', opacity: p.avail ? 1 : 0.6 }}>
            {/* Icon */}
            <div style={{ background: TAB_BGS[tab], borderRadius: 14, width: 54, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={activeIcon} size={24} color={TAB_COLORS[tab]} />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.dark }}>{p.name}</div>
                {!p.avail && <Badge text="Unavailable" color="red" />}
              </div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>{p.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 13 }}>
                <div style={{ color: C.text }}><strong>⭐ {p.rating}</strong></div>
                <div style={{ color: C.text }}><strong>📍 {p.distance} km away</strong></div>
                <div style={{ color: C.green, fontWeight: 600 }}>{p.price}</div>
              </div>
            </div>

            {/* Action */}
            <Btn
              onClick={() => setBooked(p.name)}
              disabled={!p.avail || booked === p.name}
              variant={booked === p.name ? 'green' : p.avail ? 'primary' : 'outline'}
              style={{ flexShrink: 0 }}
            >
              {booked === p.name ? '✓ Booked' : 'Book'}
            </Btn>
          </Card>
        ))}
      </div>

      {/* Booking confirmation */}
      {booked && (
        <Card style={{ marginTop: 24, background: `linear-gradient(135deg, ${C.green}15, #E0EAFF)`, borderLeft: `4px solid ${C.green}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon name="check-circle" size={24} color={C.green} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.dark }}>✅ Service Booked!</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
                {booked} will arrive shortly. You'll receive a confirmation and live tracking updates.
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Services;
