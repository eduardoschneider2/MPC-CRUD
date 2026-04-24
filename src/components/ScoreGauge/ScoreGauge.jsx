import { useState, useEffect } from 'react';
import { MAX_SCORE, getTier } from '../../data';
import './styles.scss';

export function ScoreGauge({ score, size = 220, thick = 14, showValue = true, label = 'PONTOS' }) {
  const cx = size / 2;
  const cy = size * 0.7;
  const r = size / 2 - thick - 4;

  const pointAt = (t, radius = r) => {
    const angle = Math.PI * (1 - t);
    return [cx + radius * Math.cos(angle), cy - radius * Math.sin(angle)];
  };

  const arcPath = (t1, t2, radius = r) => {
    const [x1, y1] = pointAt(t1, radius);
    const [x2, y2] = pointAt(t2, radius);
    return `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;
  };

  const segments = [
    { from: 0,    to: 0.3,  color: '#fecaca' }, // Crítico
    { from: 0.3,  to: 0.5,  color: '#fed7aa' }, // Ruim
    { from: 0.5,  to: 0.65, color: '#fde68a' }, // Atenção
    { from: 0.65, to: 0.8,  color: '#e9d5f7' }, // Bom
    { from: 0.8,  to: 1.0,  color: '#a7f3d0' }, // Excelente
  ];

  const [displayScore, setDisplayScore] = useState(0);
  useEffect(() => {
    const duration = 900;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      setDisplayScore(Math.round(score * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    const frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const animT   = displayScore / MAX_SCORE;
  const finalT  = score / MAX_SCORE;
  const needleRot = (finalT - 0.5) * 180;

  const ticks = [0, 25, 50, 75, 100];

  return (
    <svg
      className="score-gauge"
      viewBox={`-4 -8 ${size + 8} ${size * 0.82 + 8}`}
      width="100%"
    >
      {/* background track */}
      <path d={arcPath(0, 1)} fill="none" stroke="#f1ecf7" strokeWidth={thick} strokeLinecap="round" />

      {/* colored zone segments */}
      {segments.map((s, i) => (
        <path
          key={i}
          d={arcPath(s.from, s.to)}
          fill="none"
          stroke={s.color}
          strokeWidth={thick}
          strokeLinecap="butt"
          opacity="0.8"
        />
      ))}

      {/* animated progress fill */}
      <path
        d={arcPath(0, Math.max(0.002, animT))}
        fill="none"
        stroke="url(#scoreGrad)"
        strokeWidth={thick}
        strokeLinecap="round"
      />

      <defs>
        <linearGradient id="scoreGrad" x1="0" y1="1" x2="1" y2="1">
          <stop offset="0%"   stopColor="#b266e0" />
          <stop offset="100%" stopColor="var(--primary, #8600c2)" />
        </linearGradient>
      </defs>

      {/* tick marks + labels */}
      {ticks.map(v => {
        const t = v / MAX_SCORE;
        const [x1, y1] = pointAt(t, r + thick / 2 + 4);
        const [x2, y2] = pointAt(t, r + thick / 2 + 10);
        const [tx, ty] = pointAt(t, r + thick / 2 + 22);
        return (
          <g key={v}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#b8b0c3" strokeWidth="1.5" />
            <text
              x={tx} y={ty}
              fontSize={size * 0.048}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#8a83a0"
              fontFamily="var(--font-mono)"
            >
              {v}
            </text>
          </g>
        );
      })}

      {/* needle — transition in CSS, transform in style prop */}
      <g
        className="score-gauge__needle"
        style={{ transform: `rotate(${needleRot}deg)`, transformOrigin: `${cx}px ${cy}px` }}
      >
        <line x1={cx} y1={cy} x2={cx} y2={cy - r + 10} stroke="#1a1625" strokeWidth="3" strokeLinecap="round" />
        <circle cx={cx} cy={cy - r + 10} r="4" fill="var(--primary, #8600c2)" />
      </g>

      {/* hub */}
      <circle cx={cx} cy={cy} r="10" fill="#1a1625" />
      <circle cx={cx} cy={cy} r="4"  fill="var(--primary, #8600c2)" />

      {/* score value + label */}
      {showValue && (
        <>
          <text
            x={cx} y={cy - size * 0.22 + 11}
            textAnchor="middle"
            fontSize={size * 0.2}
            fontWeight="700"
            fill="#1a1625"
            fontFamily="var(--font-display)"
            letterSpacing="-1"
            style={{
              textShadow: "-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff"
            }}
          >
            {displayScore}
          </text>
          <text
            x={cx} y={cy - size * 0.1}
            textAnchor="middle"
            fontSize={size * 0.042}
            fill="#8a83a0"
            fontFamily="var(--font-mono)"
            letterSpacing="2"
            fontWeight="500"
          >
            {label}
          </text>
        </>
      )}
    </svg>
  );
}
