import { useState, useMemo } from 'react';
import { TIERS, getTier } from '../../data';
import { MiniScoreBar } from '../MiniScoreBar/MiniScoreBar';
import { TierBadge }    from '../TierBadge/TierBadge';
import { OverdueBadge } from '../OverdueBadge/OverdueBadge';
import { Trend }        from '../Trend/Trend';
import './styles.scss';

function SortTh({ sortKey, current, onSort, align, children }) {
  const isActive = current.key === sortKey;
  return (
    <th
      className={`gt-th${align === 'right' ? ' gt-th--right' : ''}`}
      onClick={() => onSort(sortKey)}
    >
      {children}
      {isActive && (
        <span className="gt-sort-icon">{current.dir === 'asc' ? '↑' : '↓'}</span>
      )}
    </th>
  );
}

export function GuardiansTable({ guardians, onSelect, filter, setFilter }) {
  const [sort, setSort] = useState({ key: 'score', dir: 'desc' });

  const filtered = useMemo(() => {
    let list = guardians;
    if (filter.query) {
      const q = filter.query.toLowerCase();
      list = list.filter(g => g.name.toLowerCase().includes(q));
    }
    if (filter.tier !== 'todos') {
      list = list.filter(g => getTier(g.score).key === filter.tier);
    }
    if (filter.status !== 'todos') {
      list = list.filter(g => g.overdueStatus === filter.status);
    }
    return [...list].sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1;
      const av = a[sort.key], bv = b[sort.key];
      return typeof av === 'string' ? av.localeCompare(bv) * dir : (av - bv) * dir;
    });
  }, [guardians, filter, sort]);

  const toggleSort = (key) =>
    setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' });

  return (
    <div className="guardians-table" data-guardians-table="true">
      {/* filter bar */}
      <div className="gt-filters">
        <span className="gt-title">Responsáveis</span>
        <span className="gt-count">{filtered.length} de {guardians.length}</span>
        <div className="gt-spacer" />

        <div className="gt-search">
          <input
            className="gt-search__input"
            value={filter.query}
            onChange={e => setFilter({ ...filter, query: e.target.value })}
            placeholder="Buscar responsável..."
          />
          <span className="gt-search__icon">⌕</span>
        </div>

        <select
          className="gt-select"
          value={filter.tier}
          onChange={e => setFilter({ ...filter, tier: e.target.value })}
        >
          <option value="todos">Todos os níveis</option>
          {TIERS.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
        </select>

        <select
          className="gt-select"
          value={filter.status}
          onChange={e => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="todos">Todos os status</option>
          <option value="em_dia">Em dia</option>
          <option value="atrasado">Atrasado</option>
          <option value="inadimplente">Inadimplente</option>
        </select>
      </div>

      {/* table */}
      <div className="gt-body">
        <table className="gt-table">
          <thead className="gt-thead">
            <tr>
              <SortTh sortKey="name"       current={sort} onSort={toggleSort}>Responsável</SortTh>
              <SortTh sortKey="score"      current={sort} onSort={toggleSort}>Pontuação</SortTh>
              <th className="gt-th gt-th--plain">Nível</th>
              <SortTh sortKey="engagement" current={sort} onSort={toggleSort} align="right">Acessos/14d</SortTh>
              <SortTh sortKey="readRate"   current={sort} onSort={toggleSort} align="right">Leitura</SortTh>
              <th className="gt-th gt-th--plain">Financeiro</th>
              <SortTh sortKey="trend"      current={sort} onSort={toggleSort} align="right">30d</SortTh>
              <th className="gt-th gt-th--empty" />
            </tr>
          </thead>
          <tbody>
            {filtered.map(g => {
              const tier = getTier(g.score);
              return (
                <tr key={g.id} className="gt-row" onClick={() => onSelect(g)}>
                  <td className="gt-td">
                    <div className="gt-guardian">
                      <div
                        className="gt-avatar"
                        style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.color}cc)` }}
                      >
                        {g.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div className="gt-guardian-info">
                        <div className="gt-guardian-name">{g.name}</div>
                        <div className="gt-guardian-id">ID #{String(g.id).padStart(4, '0')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="gt-td"><MiniScoreBar score={g.score} /></td>
                  <td className="gt-td"><TierBadge tier={tier} size="sm" /></td>
                  <td className="gt-td gt-td--right gt-td--mono">{g.engagement}</td>
                  <td className="gt-td gt-td--right gt-td--mono">{g.readRate}%</td>
                  <td className="gt-td"><OverdueBadge status={g.overdueStatus} days={g.overdueDays} /></td>
                  <td className="gt-td gt-td--right"><Trend value={g.trend} /></td>
                  <td className="gt-td gt-td--muted">›</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
