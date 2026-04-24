import './styles.scss';

export function Header({ primaryColor, schoolName, period }) {
  return (
    <header className="app-header">
      <div className="app-header__left">
        <div
          className="app-header__logo"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` }}
        >
          V
        </div>
        <div>
          <div className="app-header__school-name">{schoolName}</div>
          <div className="app-header__panel-label">
            PAINEL DE ENGAJAMENTO · {period.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="app-header__right">
        <select className="app-header__select">
          <option>Todas as turmas</option>
          <option>Fundamental I</option>
          <option>Fundamental II</option>
          <option>Ensino Médio</option>
        </select>
        <select className="app-header__select">
          <option>Últimos 30 dias</option>
          <option>Últimos 14 dias</option>
          <option>Últimos 90 dias</option>
        </select>
        <button
          className="app-header__export-btn"
          style={{ background: primaryColor }}
        >
          Exportar relatório
        </button>
        <div className="app-header__avatar" style={{ color: primaryColor }}>
          MF
        </div>
      </div>
    </header>
  );
}
