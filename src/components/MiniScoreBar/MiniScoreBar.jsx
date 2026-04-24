import './styles.scss';
import { MAX_SCORE } from '../../data';

function scoreColor(score) {
  if (score < 30) return '#dc2626'; // Crítico
  if (score < 50) return '#ea580c'; // Ruim
  if (score < 65) return '#d97706'; // Atenção
  if (score < 80) return '#8716bb'; // Bom
  return '#059669';                  // Excelente
}

export function MiniScoreBar({ score }) {
  return (
    <div className="mini-score-bar">
      <span className="mini-score-bar__value">{score}</span>
      <div className="mini-score-bar__track">
        <div
          className="mini-score-bar__fill"
          style={{ width: `${(score / MAX_SCORE) * 100}%`, background: scoreColor(score) }}
        />
      </div>
    </div>
  );
}
