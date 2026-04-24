import { TIERS, READRATE_TOOLTIP, getTier } from '../../data';
import { ScoreGauge } from '../ScoreGauge/ScoreGauge';
import { TierBadge }  from '../TierBadge/TierBadge';
import { Tooltip }    from '../Tooltip/Tooltip';
import './styles.scss';

const FINANCIAL = {
  em_dia:       { bg: '#ecfdf5', border: '#04785722', dot: '#10b981', fg: '#047857', title: 'Em dia',       sub: 'sem pendências' },
  atrasado:     { bg: '#fffbeb', border: '#b4530922', dot: '#f59e0b', fg: '#b45309', title: 'Atrasado',     sub: (d) => `${d} dias` },
  inadimplente: { bg: '#fef2f2', border: '#b91c1c22', dot: '#dc2626', fg: '#b91c1c', title: 'Inadimplente', sub: (d) => `${d} dias` },
};

function MetricCell({ label, value, unit, max, tooltip }) {
  return (
    <div className="metric-cell">
      <div className="metric-cell__label">
        {label}
        {tooltip && <Tooltip content={tooltip} width={260} />}
      </div>
      <div className="metric-cell__value-row">
        <span className="metric-cell__value">{value}</span>
        <span className="metric-cell__unit">{unit}</span>
      </div>
      <div className="metric-cell__bar-track">
        <div className="metric-cell__bar-fill" style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  );
}

function FinancialCell({ status, days }) {
  const cfg = FINANCIAL[status];
  const sub = typeof cfg.sub === 'function' ? cfg.sub(days) : cfg.sub;
  return (
    <div
      className="financial-cell"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      <div className="financial-cell__label">Financeiro</div>
      <div className="financial-cell__status-row">
        <span className="financial-cell__dot" style={{ background: cfg.dot }} />
        <span className="financial-cell__status-text" style={{ color: cfg.fg }}>{cfg.title}</span>
      </div>
      <div className="financial-cell__sub" style={{ color: cfg.fg }}>{sub}</div>
    </div>
  );
}

function buildSuggestions(g) {
  const list = [];
  if (g.engagement < 14)
    list.push({ key: 'engagement', title: 'Convidar a abrir o app com mais frequência', desc: `Apenas ${g.engagement} acessos nos últimos 14 dias. Meta: 14+`, gain: '+8 pts', icon: '◉' });
  if (g.readRate < 80)
    list.push({ key: 'readRate', title: 'Enviar lembrete de comunicados não lidos', desc: `${100 - g.readRate}% dos comunicados não foram abertos nas últimas 4 semanas`, gain: '+12 pts', icon: '✉' });
  if (g.overdueStatus === 'atrasado')
    list.push({ key: 'atrasado', title: 'Abrir negociação financeira', desc: `${g.overdueDays} dias de atraso no pagamento atual`, gain: '+15 pts', icon: '$' });
  if (g.overdueStatus === 'inadimplente')
    list.push({ key: 'inadimplente', title: 'Acionar protocolo de inadimplência', desc: `${g.overdueDays} dias em aberto — fora do prazo de negociação simples`, gain: '+22 pts', icon: '!' });
  if (list.length === 0)
    list.push({ key: 'excellent', title: 'Responsável em excelente situação', desc: 'Considere criar uma ação para deixá-lo ciente de que é um dos responsáveis mais engajados.', gain: '—', icon: '★' });
  return list;
}

function buildWhatsAppUrl(guardian, suggestions) {
  const firstName = guardian.name.split(' ')[0];
  const keys = new Set(suggestions.map(s => s.key));

  let message = `Olá, ${firstName}! Tudo bem? 😊\n\nAqui é da equipe da escola, passando para dar um alô e ver como vocês estão.`;

  if (keys.has('excellent')) {
    message += `\n\nA gente queria aproveitar para te dar um retorno muito positivo: temos acompanhado seu envolvimento com a escola e você realmente se destaca. É muito bom ter responsáveis tão presentes! Por isso, gostaríamos de te convidar para fazer parte do nosso grupo de embaixadores — uma iniciativa para quem, assim como você, acredita na importância dessa parceria entre família e escola. Se quiser saber mais, é só falar com a gente! 🌟`;
  } else {
    const parts = [];

    if (keys.has('engagement')) {
      parts.push(`notamos que o app da escola não tem sido muito acessado ultimamente — ele tem alguns recursos bem úteis para acompanhar o dia a dia do seu filho(a) e a gente adoraria te apresentar melhor`);
    }

    if (keys.has('readRate')) {
      parts.push(`tem alguns comunicados recentes que ainda não foram visualizados e gostaríamos de garantir que as informações importantes cheguem até você`);
    }

    if (keys.has('atrasado')) {
      parts.push(`também identificamos um pequeno atraso no financeiro e queremos conversar com calma para encontrar juntos a melhor forma de resolver isso, sem nenhuma preocupação`);
    }

    if (keys.has('inadimplente')) {
      parts.push(`vimos que há um pagamento em aberto que precisa de atenção e estamos aqui para ouvir você e buscar a solução que funcione melhor para o seu momento`);
    }

    if (parts.length === 1) {
      message += `\n\n${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)}. Quando tiver um tempinho, a gente pode conversar?`;
    } else {
      const last = parts.pop();
      message += `\n\n${parts.map((p, i) => i === 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p).join(', ')} e ${last}. Quando tiver um tempinho, a gente pode conversar?`;
    }
  }

  message += `\n\nConta sempre com a gente! 💙\nEquipe Escolar`;

  return `https://wa.me/5585982370209?text=${encodeURIComponent(message)}`;
}

export function GuardianDrawer({ guardian, avg, onClose }) {
  if (!guardian) return null;
  const tier     = getTier(guardian.score);
  const nextTier = TIERS.find(t => t.min > guardian.score);
  const toNext   = nextTier ? nextTier.min - guardian.score : 0;
  const delta    = guardian.score - avg;
  const suggestions = buildSuggestions(guardian);

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        {/* header */}
        <div className="drawer__header">
          <span className="drawer__header-label">Perfil do responsável</span>
          <button className="drawer__close" onClick={onClose}>×</button>
        </div>

        {/* identity */}
        <div className="drawer__identity">
          <div className="drawer__identity-inner">
            <div
              className="drawer__avatar"
              style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.color}cc)` }}
            >
              {guardian.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="drawer__name-block">
              <div className="drawer__name">{guardian.name}</div>
              <div className="drawer__id">ID #{String(guardian.id).padStart(4, '0')}</div>
            </div>
          </div>
        </div>

        {/* gauge + stats */}
        <div className="drawer__gauge-section">
          <div className="drawer__gauge-wrap">
            <ScoreGauge score={guardian.score} size={240} />
          </div>
          <div className="drawer__stats">
            <TierBadge tier={tier} />
            <div className="drawer__stat-vs">
              <div className="drawer__stat-label">vs. Média da escola</div>
              <div className="drawer__delta" style={{ color: delta >= 0 ? '#047857' : '#b91c1c' }}>
                {delta >= 0 ? '+' : ''}{delta}
              </div>
              <div className="drawer__avg">média: {avg} pts</div>
            </div>
            {nextTier && (
              <div className="drawer__next-tier">
                <div className="drawer__stat-label">Próximo nível</div>
                <div className="drawer__next-tier-value">{nextTier.label} em {toNext} pts</div>
              </div>
            )}
          </div>
        </div>

        {/* composition */}
        <div className="drawer__composition">
          <div className="drawer__section-title">Composição da pontuação</div>
          <div className="drawer__composition-grid">
            <MetricCell label="Engajamento" value={guardian.engagement} unit="acessos" max={40} />
            <MetricCell label="Leitura" value={guardian.readRate} unit="%" max={100} tooltip={READRATE_TOOLTIP} />
            <FinancialCell status={guardian.overdueStatus} days={guardian.overdueDays} />
          </div>
        </div>

        {/* actions */}
        <div className="drawer__actions">
          <div className="drawer__section-title">Ações sugeridas</div>
          <div className="drawer__suggestions-list">
            {suggestions.map((s, i) => (
              <div key={i} className="suggestion">
                <div className="suggestion__icon">{s.icon}</div>
                <div className="suggestion__content">
                  <div className="suggestion__header">
                    <div className="suggestion__title">{s.title}</div>
                    <div className="suggestion__gain">{s.gain}</div>
                  </div>
                  <div className="suggestion__desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="drawer__btn-row">
            <button
              className="btn-primary w-100"
              onClick={() => window.open(buildWhatsAppUrl(guardian, suggestions), '_blank')}
            >
              Entrar em contato
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
