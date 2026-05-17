import { C } from '../../constants/theme';

const colorMap = {
  green:  [C.gLight,  C.green],
  blue:   [C.pLight,  C.primary],
  orange: [C.oLight,  C.orange],
  red:    [C.rLight,  C.red],
};

const Badge = ({ label, color = 'green' }) => {
  const [bg, fg] = colorMap[color] || colorMap.green;
  return (
    <span
      style={{
        background:   bg,
        color:        fg,
        padding:      '3px 10px',
        borderRadius: 20,
        fontSize:     11,
        fontWeight:   700,
        whiteSpace:   'nowrap',
      }}
    >
      {label}
    </span>
  );
};

export default Badge;
