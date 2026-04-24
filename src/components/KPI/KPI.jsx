import './styles.scss';
import { Tooltip } from '../Tooltip/Tooltip';

export function KPI({ label, value, sub, tone = 'default', onClick, trend, pulse, tooltip }) {
  const isPrimary = tone === 'primary';
  const labelMod  = isPrimary ? 'primary' : 'default';
  const valueMod  = isPrimary ? 'primary' : 'default';
  const subMod    = isPrimary ? 'primary' : 'default';
  const arrowMod  = isPrimary ? 'primary' : 'default';

  const trendMod = isPrimary
    ? 'primary'
    : trend >= 0 ? 'pos' : 'neg';

  const cls = [
    'kpi',
    `kpi--${tone}`,
    onClick ? 'kpi--clickable' : '',
    pulse   ? 'kpi--pulse'     : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cls} onClick={onClick}>
      <div className={`kpi__label kpi__label--${labelMod}`}>
        {label}
        {tooltip && <Tooltip content={tooltip} />}
      </div>

      <div className="kpi__value-row">
        <div className={`kpi__value kpi__value--${valueMod}`}>{value}</div>
        {trend !== undefined && (
          <div className={`kpi__trend kpi__trend--${trendMod}`}>
            {trend >= 0 ? '↑' : '↓'}<a style={{fontSize: '13x'}}>{Math.abs(trend)}</a>
          </div>
        )}
      </div>

      {sub && <div className={`kpi__sub kpi__sub--${subMod}`}>{sub}</div>}
      {onClick && <div className={`kpi__arrow kpi__arrow--${arrowMod}`}>→</div>}
    </div>
  );
}
