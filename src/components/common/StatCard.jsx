import { C } from '../../constants/theme';
import Icon from './Icon';

const colorMap = {
  blue:   [C.pLight,  C.primary],
  green:  [C.gLight,  C.green],
  orange: [C.oLight,  C.orange],
  red:    [C.rLight,  C.red],
};

const StatCard = ({ icon, label, value, sub, color = 'blue', trend }) => {
  const [bg, fg] = colorMap[color] || colorMap.blue;

  return (
    <div
      className="card-hover fade-in"
      style={{
        background:    C.card,
        borderRadius:  16,
        padding:       20,
        boxShadow:     C.sh,
        border:        `1px solid ${C.border}`,
        transition:    'all .25s',
        cursor:        'default',
      }}
    >
      {/* Icon + trend */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ background: bg, borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={20} color={fg} />
        </div>
        {trend !== undefined && (
          <span style={{ fontSize: 12, fontWeight: 700, color: trend > 0 ? C.green : C.red }}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>

      {/* Value */}
      <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 26, fontWeight: 800, color: C.dark, marginBottom: 2 }}>
        {value}
      </div>

      {/* Label */}
      <div style={{ fontSize: 13, fontWeight: 600, color: C.sub }}>{label}</div>

      {/* Sub-label */}
      {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{sub}</div>}
    </div>
  );
};

export default StatCard;
