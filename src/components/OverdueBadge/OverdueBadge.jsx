import './styles.scss';

const LABELS = {
  em_dia:       () => 'Em dia',
  atrasado:     (days) => `Atrasado · ${days}d`,
  inadimplente: (days) => `Inadimplente · ${days}d`,
};

export function OverdueBadge({ status, days }) {
  return (
    <span className={`overdue-badge overdue-badge--${status}`}>
      <span className="overdue-badge__dot" />
      {LABELS[status](days)}
    </span>
  );
}
