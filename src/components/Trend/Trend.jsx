import './styles.scss';

export function Trend({ value }) {
  const mod = value > 0 ? 'pos' : value < 0 ? 'neg' : 'neu';
  return (
    <span className={`trend trend--${mod}`}>
      {value === 0 ? '—' : value > 0 ? '↑' : '↓'} {Math.abs(value)}
    </span>
  );
}
