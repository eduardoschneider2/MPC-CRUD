import { useMemo } from 'react';
import { TIERS, getTier } from '../../data';
import './styles.scss';

const ORDER = ['excelente', 'bom', 'atencao', 'ruim', 'critico'];

export function TierDistribution({ guardians, activeTier, onTierClick }) {
  const counts = useMemo(() => {
    const c = {};
    TIERS.forEach(t => { c[t.key] = 0; });
    guardians.forEach(g => {
      const t = getTier(g.score);
      if (t) c[t.key]++;
    });
    return c;
  }, [guardians]);

  const total = guardians.length;

  return (
    <div className="tier-dist">
      <div className="tier-dist__header">
        <div>
          <div className="tier-dist__title">Distribuição por nível</div>
          <div className="tier-dist__subtitle">Clique em um nível para filtrar a lista</div>
        </div>
        <div className="tier-dist__period">ÚLT. 14 DIAS</div>
      </div>

      {/* stacked bar */}
      <div className="tier-dist__bar">
        {ORDER.map(key => {
          const tier = TIERS.find(t => t.key === key);
          const pct  = (counts[key] / total) * 100;
          if (!pct) return null;
          const isActive = activeTier === key;
          const isDimmed = activeTier && activeTier !== key;
          return (
            <div
              key={key}
              className={`tier-dist__segment${isActive ? ' tier-dist__segment--active' : ''}${isDimmed ? ' tier-dist__segment--dimmed' : ''}`}
              onClick={() => onTierClick?.(key)}
              title={`${tier.label}: ${counts[key]} responsáveis — clique para filtrar`}
              style={{ width: `${pct}%`, background: tier.color }}
            />
          );
        })}
      </div>

      {/* legend grid */}
      <div className="tier-dist__grid">
        {ORDER.map(key => {
          const tier    = TIERS.find(t => t.key === key);
          const n       = counts[key];
          const pct     = ((n / total) * 100).toFixed(0);
          const isActive = activeTier === key;
          const isDimmed = activeTier && activeTier !== key;
          return (
            <div
              key={key}
              className={`tier-dist__cell${isActive ? ' tier-dist__cell--active' : ''}${isDimmed ? ' tier-dist__cell--dimmed' : ''}`}
              onClick={() => onTierClick?.(key)}
              style={isActive ? { border: `1px solid ${tier.color}55` } : undefined}
            >
              <div className="tier-dist__cell-header">
                <span className="tier-dist__dot" style={{ background: tier.color }} />
                <span className="tier-dist__cell-label">{tier.label}</span>
              </div>
              <div className="tier-dist__count">{n}</div>
              <div className="tier-dist__pct">{pct}% · {tier.min}–{tier.max}</div>
            </div>
          );
        })}
      </div>

      {activeTier && (
        <div className="tier-dist__filter-row">
          <span>Filtrando por</span>
          <span className="tier-dist__filter-name">
            {TIERS.find(t => t.key === activeTier).label}
          </span>
          <button className="tier-dist__clear-btn" onClick={() => onTierClick?.(null)}>
            Limpar filtro ×
          </button>
        </div>
      )}
    </div>
  );
}
