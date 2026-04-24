import { SCHOOL_HISTORY, getTier } from '../../data';
import './styles.scss';

function MoversList({ title, items }) {
  return (
    <div className="movers">
      <div className="movers__title">{title}</div>
      <div className="movers__list">
        {items.map(g => {
          const tier = getTier(g.score);
          return (
            <div key={g.id} className="movers__item">
              <div
                className="movers__avatar"
                style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.color}cc)` }}
              >
                {g.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div className="movers__info">
                <div className="movers__name">{g.name}</div>
                <div className="movers__pts">{g.score} pts</div>
              </div>
              <div className={`movers__trend movers__trend--${g.trend >= 0 ? 'pos' : 'neg'}`}>
                {g.trend >= 0 ? '↑' : '↓'} {Math.abs(g.trend)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ScoreEvolution({ guardians, avg }) {
  const fullHistory = [...SCHOOL_HISTORY.slice(0, -1), avg];
  const min   = Math.min(...fullHistory) - 20;
  const max   = Math.max(...fullHistory) + 20;
  const range = max - min;
  const w = 100, h = 100;

  const pts = fullHistory.map((v, i) => [
    (i / (fullHistory.length - 1)) * w,
    h - ((v - min) / range) * h,
  ]);

  const linePath = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`;
  const delta    = avg - fullHistory[0];

  const topGainers = [...guardians].sort((a, b) => b.trend - a.trend).slice(0, 3);
  const topLosers  = [...guardians].sort((a, b) => a.trend - b.trend).slice(0, 3);

  return (
    <div className="score-evo">
      {/* left: chart */}
      <div>
        <div className="score-evo__header">
          <div className="score-evo__title">Evolução da média</div>
          <div className="score-evo__period">ÚLT. 8 SEMANAS</div>
        </div>
        <div className="score-evo__avg-row">
          <div className="score-evo__avg-value">{avg}</div>
          <div className={`score-evo__avg-delta score-evo__avg-delta--${delta >= 0 ? 'pos' : 'neg'}`}>
            {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)} pts vs. 8 semanas atrás
          </div>
        </div>
        <svg
          className="score-evo__chart"
          viewBox={`-4 -4 ${w + 8} ${h + 8}`}
          width="100%"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="evoGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="var(--primary, #8600c2)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--primary, #8600c2)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map(f => (
            <line key={f} x1="0" y1={h * f} x2={w} y2={h * f} stroke="#f1ecf7" strokeWidth="0.5" strokeDasharray="2 2" />
          ))}
          <path d={areaPath} fill="url(#evoGrad)" />
          <path d={linePath} fill="none" stroke="var(--primary, #8600c2)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          {pts.map(([x, y], i) => (
            <circle
              key={i} cx={x} cy={y}
              r={i === pts.length - 1 ? 2.4 : 1.4}
              fill={i === pts.length - 1 ? 'var(--primary, #8600c2)' : '#fff'}
              stroke="var(--primary, #8600c2)" strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      {/* right: movers */}
      <div className="score-evo__right">
        <MoversList title="Maiores altas (30d)"   items={topGainers} />
        <MoversList title="Maiores quedas (30d)" items={topLosers}  />
      </div>
    </div>
  );
}
