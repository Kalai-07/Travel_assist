import { C } from '../../constants/theme';

const sizes = {
  sm: { padding: '7px 14px',  fontSize: 13 },
  md: { padding: '10px 20px', fontSize: 14 },
  lg: { padding: '13px 28px', fontSize: 15 },
};

const variants = {
  primary: { background: C.primary, color: '#fff',    border: 'none',                          className: 'btn-primary' },
  green:   { background: C.green,   color: '#fff',    border: 'none',                          className: 'btn-green'   },
  outline: { background: 'transparent', color: C.primary, border: `1.5px solid ${C.primary}`, className: ''            },
  ghost:   { background: C.bg,      color: C.text,    border: `1px solid ${C.border}`,         className: ''            },
  danger:  { background: C.red,     color: '#fff',    border: 'none',                          className: ''            },
};

const Btn = ({
  children,
  onClick,
  variant  = 'primary',
  size     = 'md',
  style    = {},
  disabled = false,
}) => {
  const v = variants[variant] || variants.primary;
  const s = sizes[size]       || sizes.md;

  return (
    <button
      className={v.className}
      onClick={onClick}
      disabled={disabled}
      style={{
        display:      'inline-flex',
        alignItems:   'center',
        gap:          8,
        borderRadius: 10,
        cursor:       disabled ? 'not-allowed' : 'pointer',
        fontWeight:   600,
        transition:   'all .2s',
        opacity:      disabled ? 0.6 : 1,
        ...s,
        ...v,
        ...style,
      }}
    >
      {children}
    </button>
  );
};

export default Btn;
