import { useState } from 'react';
import { C }  from '../constants/theme';
import Icon   from '../components/common/Icon';
import Btn    from '../components/common/Btn';

const INITIAL_NOTIFS = [
  { id: 1, icon: 'alertTriangle', title: 'Engine Temperature Warning',   desc: 'Engine temp crossed 95°C. Check coolant levels immediately.',        time: '5 min ago',    color: 'orange', read: false },
  { id: 2, icon: 'checkCircle',   title: 'Trip Completed',               desc: 'Chennai → Coimbatore: 463 km in 5h 18m. Great drive!',              time: '2 hrs ago',    color: 'green',  read: false },
  { id: 3, icon: 'zap',           title: 'EV Charging Complete',         desc: 'Tata Power session finished. Battery: 98%. Cost: ₹ 234.',           time: 'Yesterday',   color: 'blue',   read: false },
  { id: 4, icon: 'wrench',        title: 'Mechanic En Route',            desc: 'AutoFix Mobile Mechanic is 2.1 km away. ETA: 12 minutes.',          time: 'Yesterday',   color: 'blue',   read: true  },
  { id: 5, icon: 'fuel',          title: 'Fuel Delivery Arriving',       desc: 'QuickFuel driver is 3 km away. 10L Petrol. ETA: 14 min.',           time: '2 days ago',  color: 'orange', read: true  },
  { id: 6, icon: 'shield',        title: 'New Login Detected',           desc: 'Sign-in from Chennai, TN on Chrome. If this was you, no action.', time: '3 days ago',  color: 'red',    read: true  },
];

const COLOR_MAP = { green: '#059669', blue: '#1A6BDB', orange: '#D97706', red: '#DC2626' };
const BG_MAP    = { green: '#ECFDF5', blue: '#EEF4FF', orange: '#FFFBEB', red: '#FEF2F2' };

const Notifications = () => {
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);

  const markRead  = (id) => setNotifs((ns) => ns.map((x) => x.id === id ? { ...x, read: true } : x));
  const markAll   = ()   => setNotifs((ns) => ns.map((x) => ({ ...x, read: true })));

  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div className="fade-in" style={{ padding: '32px 28px', maxWidth: 780, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Notifications</h1>
          <p style={{ color: '#94A3B8', fontSize: 14 }}>{unread} unread · {notifs.length} total</p>
        </div>
        {unread > 0 && (
          <Btn variant="ghost" onClick={markAll}>Mark all as read</Btn>
        )}
      </div>

      {/* Notification list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notifs.map((n) => (
          <div
            key={n.id}
            onClick={() => markRead(n.id)}
            style={{
              display:     'flex',
              gap:         14,
              padding:     '16px 20px',
              background:  n.read ? '#FFFFFF' : `${COLOR_MAP[n.color]}06`,
              border:      `1.5px solid ${n.read ? '#E2E8F0' : COLOR_MAP[n.color] + '40'}`,
              borderRadius: 14,
              cursor:      'pointer',
              transition:  'all .2s',
            }}
          >
            {/* Icon */}
            <div style={{ background: BG_MAP[n.color], borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={n.icon} size={20} color={COLOR_MAP[n.color]} />
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: n.read ? 500 : 700, color: '#0F172A' }}>{n.title}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 12 }}>
                  <span style={{ fontSize: 11, color: '#94A3B8' }}>{n.time}</span>
                  {!n.read && (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLOR_MAP[n.color] }} />
                  )}
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
