import { useState, useEffect } from 'react';
import { C } from '../constants/theme';
import Card     from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import Badge    from '../components/common/Badge';
import Icon     from '../components/common/Icon';

const QUICK_ACTIONS = [
  { icon: 'sos',        label: 'SOS Alert',      color: '#DC2626', bg: '#FEF2F2', page: 'sos' },
  { icon: 'fuel',       label: 'Fuel Delivery',  color: '#D97706', bg: '#FFFBEB', page: 'services' },
  { icon: 'zap',        label: 'EV Charging',    color: '#059669', bg: '#ECFDF5', page: 'services' },
  { icon: 'wrench',     label: 'Roadside Help',  color: '#1A6BDB', bg: '#EEF4FF', page: 'services' },
];

const VEHICLES_DB = [
  {
    id: 1,
    plate: 'TN38 AM 1234',
    model: 'Maruti Swift Dzire 2022',
    fuel: 'Petrol',
    color: '#1A6BDB',
    health: 92,
    stats: [
      { label: 'Engine Temp',    value: '87°C',   pct: 62, color: C.green   },
      { label: 'Battery Voltage',value: '13.8V',  pct: 82, color: C.primary },
      { label: 'Tyre Pressure',  value: '32 PSI', pct: 78, color: C.green   },
      { label: 'Engine RPM',     value: '780',    pct: 15, color: C.orange   },
    ],
    lastService: '2 months ago',
    insurance: 'Valid till Dec 2026',
  },
  {
    id: 2,
    plate: 'TN38 AM 5678',
    model: 'Hyundai i20 Active 2021',
    fuel: 'Petrol',
    color: '#059669',
    health: 87,
    stats: [
      { label: 'Engine Temp',    value: '82°C',   pct: 58, color: C.green   },
      { label: 'Battery Voltage',value: '13.5V',  pct: 75, color: C.primary },
      { label: 'Tyre Pressure',  value: '30 PSI', pct: 71, color: C.green   },
      { label: 'Engine RPM',     value: '650',    pct: 12, color: C.green   },
    ],
    lastService: '1 month ago',
    insurance: 'Valid till Jan 2027',
  },
  {
    id: 3,
    plate: 'TN38 AM 9012',
    model: 'Tata Nexon EV 2023',
    fuel: 'Electric',
    color: '#D97706',
    health: 96,
    stats: [
      { label: 'Battery Level',  value: '85%',    pct: 85, color: C.green   },
      { label: 'Motor Temp',     value: '45°C',   pct: 45, color: C.green   },
      { label: 'Brake Health',   value: '92%',    pct: 92, color: C.primary },
      { label: 'Tire Pressure',  value: '33 PSI', pct: 79, color: C.green   },
    ],
    lastService: '3 weeks ago',
    insurance: 'Valid till Aug 2026',
  },
];

const ACTIVITY = [
  { icon: 'checkCircle',    text: 'Trip to Coimbatore completed successfully',  time: '2h ago',      color: 'green'  },
  { icon: 'activity',       text: 'Vehicle check completed — All Normal',        time: '4h ago',      color: 'blue'   },
  { icon: 'zap',            text: 'EV charge session: 45 min, battery +68%',     time: 'Yesterday',   color: 'orange' },
  { icon: 'alertTriangle',  text: 'Engine temp warning — Auto-resolved',          time: '2 days ago',  color: 'red'    },
  { icon: 'fuel',           text: 'Fuel delivery completed — 12L petrol',         time: '3 days ago',  color: 'blue'   },
];

const colorMap = { green: C.green, blue: C.primary, orange: C.orange, red: C.red };
const bgMap    = { green: C.gLight, blue: C.pLight,  orange: C.oLight, red: C.rLight };

const Dashboard = ({ user, setPage }) => {
  const [now, setNow] = useState(new Date());
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES_DB[0]);
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const hr = now.getHours();
  const greeting = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';

  const handleScroll = (direction) => {
    const newPos = scrollPos + (direction === 'left' ? -120 : 120);
    setScrollPos(Math.max(0, Math.min(newPos, (VEHICLES_DB.length - 1) * 120)));
  };

  return (
    <div className="fade-in" style={{ padding: '32px 28px', maxWidth: 1120, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: C.dark, marginBottom: 4 }}>
          {greeting}, {(user?.name || '').split(' ')[0]} 👋
        </h1>
        <p style={{ color: C.muted, fontSize: 14 }}>
          {now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          {' · '}
          {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 22 }}>
        <StatCard icon="map"      label="Trips This Month"  value="12"  sub="3 active routes"      color="blue"   trend={8} />
        <StatCard icon="activity" label="Vehicle Health"    value="92%" sub="All systems normal"   color="green"  trend={2} />
        <StatCard icon="wrench"   label="Services Nearby"   value="7"   sub="Avg 2.3 km away"      color="orange" />
        <StatCard icon="bell"     label="Active Alerts"     value="3"   sub="1 needs attention"    color="red"    />
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 18, marginBottom: 18 }}>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: C.dark }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {QUICK_ACTIONS.map((a) => (
              <div
                key={a.label}
                onClick={() => setPage(a.page)}
                style={{ background: a.bg, borderRadius: 14, padding: '18px 12px', textAlign: 'center', cursor: 'pointer', border: '1.5px solid transparent', transition: 'all .2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.border = `1.5px solid ${a.color}`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.border = '1.5px solid transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                  <Icon name={a.icon} size={28} color={a.color} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: a.color }}>{a.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Vehicle Carousel */}
      <Card style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark }}>My Vehicles</h3>
          <span style={{ fontSize: 12, color: C.muted }}>{selectedVehicle.id} of {VEHICLES_DB.length}</span>
        </div>

        {/* Carousel container */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <div style={{
            display: 'flex',
            gap: 12,
            overflowX: 'hidden',
            scrollBehavior: 'smooth',
          }}>
            {VEHICLES_DB.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle)}
                style={{
                  flex: '0 0 280px',
                  background: selectedVehicle.id === vehicle.id ? `${vehicle.color}15` : '#fff',
                  border: `2.5px solid ${selectedVehicle.id === vehicle.id ? vehicle.color : C.border}`,
                  borderRadius: 16,
                  padding: 16,
                  cursor: 'pointer',
                  transition: 'all .3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: selectedVehicle.id === vehicle.id ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: selectedVehicle.id === vehicle.id ? `0 8px 24px ${vehicle.color}30` : C.sh,
                }}
                onMouseEnter={(e) => {
                  if (selectedVehicle.id !== vehicle.id) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.borderColor = vehicle.color;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedVehicle.id !== vehicle.id) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = C.border;
                  }
                }}
              >
                {/* Vehicle icon with color */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 50,
                    height: 50,
                    borderRadius: 12,
                    background: `${vehicle.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 12px ${vehicle.color}25`,
                  }}>
                    <Icon name="car" size={28} color={vehicle.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: C.dark, fontSize: 13 }}>{vehicle.plate}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>Health: {vehicle.health}%</div>
                  </div>
                </div>

                {/* Vehicle model */}
                <div style={{ fontSize: 12, color: C.sub, marginBottom: 8, lineHeight: 1.4 }}>{vehicle.model}</div>

                {/* Fuel type badge */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <Badge label={vehicle.fuel} color={vehicle.fuel === 'Electric' ? 'green' : 'orange'} />
                  <Badge label={`${vehicle.health}% Healthy`} color="blue" />
                </div>

                {/* Health bar animation */}
                <div style={{ marginTop: 10, background: C.bg, borderRadius: 8, height: 6, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${vehicle.color}, ${vehicle.health > 70 ? C.green : vehicle.health > 50 ? C.orange : C.red})`,
                    width: `${vehicle.health}%`,
                    transition: 'width .8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    animation: selectedVehicle.id === vehicle.id ? 'pulse .3s ease-out' : 'none',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Selected Vehicle Details */}
      <Card style={{ marginBottom: 18, background: `linear-gradient(135deg, ${selectedVehicle.color}08, ${selectedVehicle.color}04)`, borderLeft: `5px solid ${selectedVehicle.color}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 4 }}>{selectedVehicle.plate}</h3>
            <p style={{ fontSize: 13, color: C.muted }}>{selectedVehicle.model}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: selectedVehicle.color, fontFamily: 'Outfit, sans-serif' }}>
              {selectedVehicle.health}%
            </div>
            <div style={{ fontSize: 12, color: C.muted }}>Vehicle Health</div>
          </div>
        </div>

        {/* Vehicle meta info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
          <div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, fontWeight: 600, textTransform: 'uppercase' }}>Fuel Type</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{selectedVehicle.fuel}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, fontWeight: 600, textTransform: 'uppercase' }}>Last Service</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{selectedVehicle.lastService}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, fontWeight: 600, textTransform: 'uppercase' }}>Insurance</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>{selectedVehicle.insurance}</div>
          </div>
        </div>

        {/* Detailed stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {selectedVehicle.stats.map((s) => (
            <div key={s.label} style={{ animation: 'fadeInUp .5s ease-out' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span style={{ color: C.sub, fontWeight: 600 }}>{s.label}</span>
                <span style={{ fontWeight: 800, color: s.color }}>{s.value}</span>
              </div>
              <div style={{ background: C.bg, borderRadius: 8, height: 8, overflow: 'hidden' }}>
                <div style={{
                  width: `${s.pct}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${s.color}, ${s.color}dd)`,
                  borderRadius: 8,
                  transition: 'width .8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Activity + Route map */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

        {/* Recent Activity */}
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 16 }}>Recent Activity</h3>
          {ACTIVITY.map((a, i) => (
            <div
              key={i}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: i < ACTIVITY.length - 1 ? 14 : 0, paddingBottom: i < ACTIVITY.length - 1 ? 14 : 0, borderBottom: i < ACTIVITY.length - 1 ? `1px solid ${C.border}` : '' }}
            >
              <div style={{ background: bgMap[a.color], borderRadius: 9, padding: 7, flexShrink: 0 }}>
                <Icon name={a.icon} size={14} color={colorMap[a.color]} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: C.dark, marginBottom: 2 }}>{a.text}</p>
                <p style={{ fontSize: 11, color: C.muted }}>{a.time}</p>
              </div>
            </div>
          ))}
        </Card>

        {/* Active route mini-map */}
        <Card style={{ padding: 20, background: `linear-gradient(135deg, ${C.primary}08, ${C.green}08)` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 4 }}>Active Route</h3>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 14 }}>Chennai → Madurai · NH-44</p>

          <svg viewBox="0 0 300 160" style={{ width: '100%', borderRadius: 12, marginBottom: 14 }}>
            <rect width="300" height="160" fill="#E8F3FD" rx="10" />
            {[50,100,150,200,250].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="160" stroke="#D0E4F4" strokeWidth="0.5" />)}
            {[40,80,120].map((y)        => <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#D0E4F4" strokeWidth="0.5" />)}
            {/* Road shadow */}
            <path d="M 30 25 Q 100 60 160 90 Q 220 115 270 140" stroke="#C8D8EC" strokeWidth="14" fill="none" strokeLinecap="round" />
            {/* Route */}
            <path d="M 30 25 Q 100 60 160 90 Q 220 115 270 140" stroke={C.primary} strokeWidth="3.5" fill="none" strokeLinecap="round" />
            {/* Origin */}
            <circle cx="30"  cy="25"  r="9" fill={C.green}   /><text x="42"  y="30"  fontSize="9" fill={C.dark} fontWeight="700">Chennai</text>
            {/* You */}
            <circle cx="160" cy="90"  r="8" fill={C.primary} /><circle cx="160" cy="90" r="16" fill={C.primary} fillOpacity=".18" />
            <text x="170" y="86" fontSize="8" fill={C.primary} fontWeight="600">You</text>
            {/* Destination */}
            <circle cx="270" cy="140" r="9" fill={C.red}     /><text x="215" y="136" fontSize="9" fill={C.dark} fontWeight="700">Madurai</text>
          </svg>

          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {[{ v: '463', u: 'km total' }, { v: '5h 20m', u: 'ETA' }, { v: '218', u: 'km left' }].map((s) => (
              <div key={s.u} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 800, color: C.primary }}>{s.v}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{s.u}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
