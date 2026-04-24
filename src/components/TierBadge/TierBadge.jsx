import './styles.scss';

const ICONS = {
  excelente: '★', bom: '◆', atencao: '●', ruim: '●', critico: '▲',
};

export function TierBadge({ tier, size = 'md' }) {
  if (!tier) return null;
  return (
    <span className={`tier-badge tier-badge--${size} tier-badge--${tier.key}`}>
      <span className="tier-badge__icon">{ICONS[tier.key]}</span>
      {tier.label}
    </span>
  );
}
