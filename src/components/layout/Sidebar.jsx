import { C, NAV } from '../../constants/theme';
import Icon from '../common/Icon';

const Sidebar = ({ page, setPage, user, onLogout }) => (
  <div
    style={{
      width:        240,
      minHeight:    '100vh',
      background:   C.card,
      borderRight:  `1px solid ${C.border}`,
      display:      'flex',
      flexDirection:'column',
      padding:      '24px 12px',
      position:     'sticky',
      top:          0,
      height:       '100vh',
      overflow:     'auto',
      flexShrink:   0,
    }}
  >
    {/* Logo */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', marginBottom: 32 }}>
      <div
        style={{
          background:   `linear-gradient(135deg, ${C.primary}, ${C.green})`,
          borderRadius: 12,
          width:        38,
          height:       38,
          display:      'flex',
          alignItems:   'center',
          justifyContent:'center',
          boxShadow:    `0 4px 12px ${C.primary}30`,
          flexShrink:   0,
        }}
      >
        <Icon name="navigation" size={20} color="#fff" />
      </div>
      <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 17, fontWeight: 800, color: C.dark }}>
        TravelAssist
      </span>
    </div>

    {/* Nav items */}
    <nav style={{ flex: 1 }}>
      {NAV.map((n) => {
        const active = page === n.id;
        return (
          <div
            key={n.id}
            className={active ? '' : 'sb-item'}
            onClick={() => setPage(n.id)}
            style={{
              display:        'flex',
              alignItems:     'center',
              gap:            11,
              padding:        '11px 14px',
              borderRadius:   12,
              cursor:         'pointer',
              marginBottom:   3,
              transition:     'all .18s',
              background:     active ? C.primary : 'transparent',
              color:          active ? '#fff' : C.sub,
            }}
          >
            <Icon name={n.icon} size={17} color={active ? '#fff' : C.sub} />
            <span style={{ fontSize: 13.5, fontWeight: active ? 600 : 500, flex: 1, color: active ? '#fff' : C.sub }}>
              {n.label}
            </span>
            {n.badge && (
              <span
                style={{
                  background:   active ? 'rgba(255,255,255,.28)' : C.red,
                  color:        '#fff',
                  borderRadius: 20,
                  padding:      '1px 7px',
                  fontSize:     11,
                  fontWeight:   700,
                }}
              >
                {n.badge}
              </span>
            )}
          </div>
        );
      })}
    </nav>

    {/* User + Logout */}
    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', marginBottom: 4 }}>
        <div
          style={{
            width:          34,
            height:         34,
            borderRadius:   10,
            background:     `linear-gradient(135deg, ${C.primary}, ${C.green})`,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            color:          '#fff',
            fontWeight:     700,
            fontSize:       14,
            flexShrink:     0,
          }}
        >
          {(user?.name || 'U')[0].toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.dark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name || 'User'}
          </div>
          <div style={{ fontSize: 11, color: C.muted }}>{user?.vehicle || 'No vehicle'}</div>
        </div>
      </div>

      <div
        className="sb-item"
        onClick={onLogout}
        style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 14px', borderRadius: 12, cursor: 'pointer', color: C.red, transition: 'all .18s' }}
      >
        <Icon name="logout" size={16} color={C.red} />
        <span style={{ fontSize: 13.5, fontWeight: 500, color: C.red }}>Sign Out</span>
      </div>
    </div>
  </div>
);

export default Sidebar;
