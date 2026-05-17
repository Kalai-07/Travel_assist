import { C } from '../../constants/theme';

const Card = ({ children, style = {}, className = '' }) => (
  <div
    className={`fade-in ${className}`}
    style={{
      background:   C.card,
      borderRadius: 16,
      padding:      24,
      boxShadow:    C.sh,
      border:       `1px solid ${C.border}`,
      ...style,
    }}
  >
    {children}
  </div>
);

export default Card;
