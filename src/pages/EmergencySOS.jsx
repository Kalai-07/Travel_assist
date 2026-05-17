import { useState, useEffect } from 'react';
import { C }  from '../constants/theme';
import Card   from '../components/common/Card';
import Badge  from '../components/common/Badge';
import Btn    from '../components/common/Btn';
import Icon   from '../components/common/Icon';

const NEARBY = [
  { name: 'Ramu Auto Works',       dist: '1.2 km', phone: '+91 98401 23456', type: 'Mechanic', eta: '6 min'  },
  { name: 'City Police Station',   dist: '2.4 km', phone: '100',             type: 'Police',   eta: '10 min' },
  { name: 'Apollo Hospital',       dist: '3.1 km', phone: '+91 44 2829 3333',type: 'Hospital', eta: '14 min' },
  { name: 'NHAI Highway Patrol',   dist: '4.0 km', phone: '1033',            type: 'Highway',  eta: '18 min' },
];

const EmergencySOS = () => {
  const [sent,      setSent]      = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [elapsed,   setElapsed]   = useState(0);

  /* Countdown before sending */
  const trigger = () => {
    let c = 3;
    setCountdown(c);
    const t = setInterval(() => {
      c--;
      if (c <= 0) { clearInterval(t); setCountdown(null); setSent(true); }
      else setCountdown(c);
    }, 1000);
  };

  /* Elapsed timer after SOS sent */
  useEffect(() => {
    if (!sent) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [sent]);

  const cancel = () => { setSent(false); setElapsed(0); };

  return (
    <div className="fade-in" style={{ padding: '32px 28px', maxWidth: 800, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: C.dark, marginBottom: 4 }}>Emergency SOS</h1>
        <p style={{ color: C.muted, fontSize: 14 }}>Instant distress signal — broadcasts your GPS location to nearest responders</p>
      </div>

      {/* GPS location bar */}
      <Card style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, background: C.pLight, border: `1px solid ${C.pMid}` }}>
        <Icon name="location" size={22} color={C.primary} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>Current GPS Location</div>
          <div style={{ fontSize: 12, color: C.muted }}>NH-44, Near Krishnagiri, Tamil Nadu · 12.5198°N, 78.2137°E</div>
        </div>
        <Badge label="● GPS Active" color="green" />
      </Card>

      {/* SOS button area */}
      <div style={{ textAlign: 'center', padding: '36px 0 40px' }}>
        {!sent ? (
          <>
            <div className={countdown ? 'pulse' : ''} style={{ display: 'inline-block' }}>
              <button
                className="sos-btn"
                onClick={trigger}
                disabled={!!countdown}
                style={{
                  width:          190,
                  height:         190,
                  borderRadius:   '50%',
                  background:     `linear-gradient(135deg, #DC2626, #EF4444)`,
                  border:         '8px solid #FEE2E2',
                  color:          '#fff',
                  cursor:         countdown ? 'not-allowed' : 'pointer',
                  transition:     'all .3s',
                  boxShadow:      '0 0 35px rgba(220,38,38,.45)',
                  display:        'flex',
                  flexDirection:  'column',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontFamily:     'Outfit, sans-serif',
                }}
              >
                {countdown
                  ? <span style={{ fontSize: 72, fontWeight: 900 }}>{countdown}</span>
                  : <>
                      <span style={{ fontSize: 48, marginBottom: 4 }}>🆘</span>
                      <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: 3 }}>SOS</span>
                    </>
                }
              </button>
            </div>
            <p style={{ color: C.muted, fontSize: 13, marginTop: 18 }}>
              Tap to send emergency signal to nearest responders
            </p>
          </>
        ) : (
          <div className="fade-in">
            {/* Sent state */}
            <div style={{ width: 190, height: 190, borderRadius: '50%', background: C.gLight, border: `8px solid ${C.green}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: `0 0 40px ${C.green}40`, fontFamily: 'Outfit, sans-serif' }}>
              <span style={{ fontSize: 50 }}>✅</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: C.green, marginTop: 6 }}>SENT</span>
              <span style={{ fontSize: 12, color: C.muted }}>{elapsed}s ago</span>
            </div>

            <div style={{ marginTop: 20, background: C.gLight, border: `1.5px solid ${C.green}`, borderRadius: 14, padding: '14px 24px', display: 'inline-block', textAlign: 'center' }}>
              <p style={{ fontWeight: 700, color: C.green, marginBottom: 4 }}>SOS Signal Broadcast!</p>
              <p style={{ fontSize: 13, color: C.sub }}>Help is dispatched. Nearest unit ETA: ~6 minutes.</p>
            </div>

            <br />
            <Btn onClick={cancel} variant="ghost" style={{ marginTop: 16 }}>Cancel SOS</Btn>
          </div>
        )}
      </div>

      {/* Nearby emergency contacts */}
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 16 }}>Nearby Emergency Contacts</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {NEARBY.map((n, i) => (
            <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>{n.name}</div>
                <Badge label={n.eta} color="blue" />
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>{n.type} · {n.dist}</div>
              <Btn size="sm" variant="outline" style={{ fontSize: 12 }}>
                <Icon name="phone" size={13} color={C.primary} /> {n.phone}
              </Btn>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default EmergencySOS;
