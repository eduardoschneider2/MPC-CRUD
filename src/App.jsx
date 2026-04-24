import { useState, useEffect } from 'react';
import { GUARDIANS, RISK_THRESHOLD, READRATE_TOOLTIP } from './data';
import { Header }           from './components/Header/Header';
import { KPI }              from './components/KPI/KPI';
import { TierDistribution } from './components/TierDistribution/TierDistribution';
import { ScoreEvolution }   from './components/ScoreEvolution/ScoreEvolution';
import { GuardiansTable }   from './components/GuardiansTable/GuardiansTable';
import { GuardianDrawer }   from './components/GuardianDrawer/GuardianDrawer';
import { RiskModal }        from './components/RiskModal/RiskModal';
import './App.scss';

const PRIMARY_COLOR = '#8716bb';
const SCHOOL_NAME   = 'Colégio Vila das Flores';
const PERIOD        = 'Março 2026';

function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;
  const h = String(Math.floor(diff / 3_600_000)).padStart(2, '0');
  const m = String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, '0');
  const s = String(Math.floor((diff % 60_000) / 1_000)).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function App() {
  const [selected,     setSelected]     = useState(null);
  const [showRisk,     setShowRisk]     = useState(false);
  const [filter,       setFilter]       = useState({ query: '', tier: 'todos', status: 'todos' });
  const [showEvolution, setShowEvolution] = useState(false);
  const [countdown,    setCountdown]    = useState(getTimeUntilMidnight);

  useEffect(() => {
    const id = setInterval(() => setCountdown(getTimeUntilMidnight()), 1000);
    return () => clearInterval(id);
  }, []);

  const total         = GUARDIANS.length;
  const avg           = Math.round(GUARDIANS.reduce((s, g) => s + g.score, 0) / total);
  const atRisk        = GUARDIANS.filter(g => g.score < RISK_THRESHOLD).length;
  const inadimplentes = GUARDIANS.filter(g => g.overdueStatus === 'inadimplente').length;
  const engaged       = GUARDIANS.filter(g => g.engagement >= 3).length;
  const engagedPct    = Math.round((engaged / total) * 100);
  const avgRead       = Math.round(GUARDIANS.reduce((s, g) => s + g.readRate, 0) / total);
  const avgDelta      = avg - 62; // delta vs. previous month

  const handleTierClick = (key) => {
    setFilter(f => ({ ...f, tier: key || 'todos' }));
    if (key) {
      setTimeout(() => {
        document.querySelector('[data-guardians-table]')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  return (
    <div className="app">

      <main className="app-main">
        {/* title row */}
        <div className="app-title-row">
          <div>
            <h1 className="app-title">MPC</h1>
            <p className="app-subtitle">
              {total} responsáveis ativos · pontuação metrificada por engajamento
            </p>
          </div>
          <div className="app-live">
            <span className="app-live__dot" />
            Próxima atualização em: {countdown}
          </div>
        </div>

        {/* KPI row */}
        <div className="app-kpi-grid">
          <KPI label="Pontuação média"     value={avg}          sub="de 100 pontos possíveis"          tone="primary" trend={avgDelta} />
          <KPI label="Em situação de risco" value={atRisk}      sub={`score abaixo de ${RISK_THRESHOLD}`} tone="danger"  onClick={() => setShowRisk(true)} pulse={atRisk > 0} />
          <KPI label="Responsáveis ativos"  value={`${engagedPct}%`} sub={`${engaged} com 3+ acessos/14d`} />
          <KPI label="Taxa de leitura"      value={`${avgRead}%`}    sub="comunicados abertos" trend={3} tooltip={READRATE_TOOLTIP} />
          <KPI label="Inadimplentes"        value={inadimplentes}    sub={`${Math.round((inadimplentes / total) * 100)}% do total`} />
        </div>

        {/* distribution + optional evolution */}
        <div className={`app-panel-grid app-panel-grid--${showEvolution ? 'double' : 'single'}`}>
          <TierDistribution
            guardians={GUARDIANS}
            activeTier={filter.tier === 'todos' ? null : filter.tier}
            onTierClick={handleTierClick}
          />
          {showEvolution && <ScoreEvolution guardians={GUARDIANS} avg={avg} />}
        </div>

        {/* table */}
        <GuardiansTable
          guardians={GUARDIANS}
          onSelect={setSelected}
          filter={filter}
          setFilter={setFilter}
        />

        {/* footer */}
        <div className="app-footer">
          <div>A pontuação combina 3 sinais: engajamento no app (40%) · leitura de comunicados (35%) · status financeiro (25%)</div>
          <div className="app-footer__actions">
            <button className="app-footer__toggle-btn" onClick={() => setShowEvolution(v => !v)}>
              {showEvolution ? 'Ocultar evolução' : 'Ver evolução'}
            </button>
            <div>V2.4 · ÚLTIMA SINCRONIZAÇÃO 14:32</div>
          </div>
        </div>
      </main>

      {selected  && <GuardianDrawer guardian={selected} avg={avg} onClose={() => setSelected(null)} />}
      {showRisk  && <RiskModal guardians={GUARDIANS} onClose={() => setShowRisk(false)} onSelectGuardian={g => setSelected(g)} />}
    </div>
  );
}
