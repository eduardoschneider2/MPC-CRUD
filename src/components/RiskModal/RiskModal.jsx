import { useState } from 'react';
import { RISK_THRESHOLD, getTier } from '../../data';
import { TierBadge } from '../TierBadge/TierBadge';
import { exportRiskToExcel } from '../../utils/exportRisk';
import './styles.scss';

export function RiskModal({ guardians, onClose, onSelectGuardian }) {
  const [exporting, setExporting] = useState(false);

  const atRisk = [...guardians]
    .filter(g => g.score < RISK_THRESHOLD)
    .sort((a, b) => a.score - b.score);

  function handleExport() {
    setExporting(true);
    exportRiskToExcel(guardians);
    setExporting(false);
  }

  return (
    <div className="risk-overlay" onClick={onClose}>
      <div className="risk-modal" onClick={e => e.stopPropagation()}>
        {/* header */}
        <div className="risk-modal__header">
          <div className="risk-modal__header-inner">
            <div className="risk-modal__header-left">
              <div className="risk-modal__icon">▲</div>
              <div>
                <div className="risk-modal__title">
                  {atRisk.length} responsáveis em situação de risco
                </div>
                <div className="risk-modal__subtitle">
                  Pontuação abaixo de {RISK_THRESHOLD} — requer atenção imediata
                </div>
              </div>
            </div>
            <button className="risk-modal__close" onClick={onClose}>×</button>
          </div>
        </div>

        {/* list */}
        <div className="risk-modal__list">
          {atRisk.map(g => {
            const tier = getTier(g.score);
            const reasons = [];
            if (g.engagement < 10) reasons.push('baixo engajamento');
            if (g.readRate < 50) reasons.push('comunicados não lidos');
            if (g.overdueStatus === 'inadimplente') reasons.push(`inadimplente ${g.overdueDays}d`);
            else if (g.overdueStatus === 'atrasado') reasons.push(`atraso ${g.overdueDays}d`);

            return (
              <div
                key={g.id}
                className="risk-item"
                onClick={() => onSelectGuardian(g)}
              >
                <div
                  className="risk-item__avatar"
                  style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.color}cc)` }}
                >
                  {g.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div className="risk-item__info">
                  <div className="risk-item__name">{g.name}</div>
                  <div className="risk-item__reasons">{reasons.join(' · ')}</div>
                </div>
                <div className="risk-item__score-block">
                  <div className={`risk-item__score risk-item__score--${g.score < 30 ? 'critical' : 'warning'}`}>
                    {g.score}
                  </div>
                  <div className="risk-item__tier">
                    <TierBadge tier={tier} size="sm" />
                  </div>
                </div>
                <div className="risk-item__arrow">›</div>
              </div>
            );
          })}
        </div>

        {/* footer */}
        <div className="risk-modal__footer">
          <div className="risk-modal__footer-text">
            Envie um plano de ação em massa ou exporte para a coordenação
          </div>
          <div className="risk-modal__footer-btns">
            <button className="btn-secondary" onClick={handleExport} disabled={exporting}>
              {exporting ? 'Exportando…' : 'Exportar Excel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
