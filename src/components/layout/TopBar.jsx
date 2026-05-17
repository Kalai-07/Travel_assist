import { C, NAV } from '../../constants/theme';
import Icon from '../common/Icon';

const TopBar = ({ page, user, setPage }) => (
  <div
    style={{
      position:       'sticky',
      top:            0,
      zIndex:         10,
      background:     'rgba(240,244,255,.88)',
      backdropFilter: 'blur(14px)',
      borderBottom:   `1px solid ${C.border}`,
      padding:        '14px 28px',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
    }}
  >
    {/* Current page label */}
    <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 600, color: C.muted, textTransform: 'capitalize' }}>
      {NAV.find((n) => n.id === page)?.label || 'TravelAssist'}
    </div>

    {/* Right side actions */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {/* GPS pill */}
      <div
        style={{
          background:   C.gLight,
          borderRadius: 10,
          padding:      '5px 13px',
          fontSize:     12,
          fontWeight:   700,
          color:        C.green,
          display:      'flex',
          alignItems:   'center',
          gap:          6,
          border:       `1px solid ${C.green}30`,
        }}
      >
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.green }} />
        GPS Active
      </div>

      {/* Notification bell */}
      <div style={{ cursor: 'pointer', position: 'relative' }} onClick={() => setPage('notifications')}>
        <Icon name="bell" size={20} color={C.sub} />
        <div
          style={{
            position:       'absolute',
            top:            -4,
            right:          -4,
            width:          14,
            height:         14,
            borderRadius:   '50%',
            background:     C.red,
            border:         '2px solid #F0F4FF',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 9, color: '#fff', fontWeight: 700 }}>3</span>
        </div>
      </div>

      {/* Avatar */}
      <div style={{ cursor: 'pointer' }} onClick={() => setPage('profile')}>
        <div
          style={{
            width:          34,
            height:         34,
            borderRadius:   '50%',
            background:     `linear-gradient(135deg, ${C.primary}, ${C.green})`,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            color:          '#fff',
            fontWeight:     700,
            fontSize:       14,
            fontFamily:     'Outfit, sans-serif',
            boxShadow:      `0 2px 8px ${C.primary}30`,
          }}
        >
          {(user?.name || 'U')[0].toUpperCase()}
        </div>
      </div>
    </div>
  </div>
);

export default TopBar;
