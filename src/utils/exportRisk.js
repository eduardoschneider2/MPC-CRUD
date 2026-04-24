import XLSX from 'xlsx-js-style';
import { getTier, RISK_THRESHOLD } from '../data';

const STATUS_LABEL = {
  em_dia:       'Em dia',
  atrasado:     'Atrasado',
  inadimplente: 'Inadimplente',
};

const TIER_FONT_COLOR = {
  excelente: '059669',
  bom:       '8716BB',
  atencao:   'D97706',
  ruim:      'EA580C',
  critico:   'DC2626',
};

const STATUS_FONT_COLOR = {
  em_dia:       '047857',
  atrasado:     'B45309',
  inadimplente: 'B91C1C',
};

const STATUS_BG_COLOR = {
  em_dia:       'ECFDF5',
  atrasado:     'FFFBEB',
  inadimplente: 'FEF2F2',
};

function buildReasons(g) {
  const r = [];
  if (g.engagement < 10) r.push('Baixo engajamento');
  if (g.readRate < 50)   r.push('Comunicados não lidos');
  if (g.overdueStatus === 'inadimplente') r.push(`Inadimplente há ${g.overdueDays} dias`);
  else if (g.overdueStatus === 'atrasado') r.push(`Atraso de ${g.overdueDays} dias`);
  return r.join(', ') || '—';
}

function cell(value, style) {
  return { v: value, t: typeof value === 'number' ? 'n' : 's', s: style };
}

const border = {
  top:    { style: 'hair', color: { rgb: 'E2E8F0' } },
  bottom: { style: 'hair', color: { rgb: 'E2E8F0' } },
  left:   { style: 'hair', color: { rgb: 'E2E8F0' } },
  right:  { style: 'hair', color: { rgb: 'E2E8F0' } },
};

const HEADER_STYLE = {
  font:      { name: 'Calibri', bold: true, sz: 10, color: { rgb: 'FFFFFF' } },
  fill:      { fgColor: { rgb: '334155' } },
  alignment: { horizontal: 'center', vertical: 'center' },
  border: {
    top:    { style: 'thin', color: { rgb: '1E293B' } },
    bottom: { style: 'medium', color: { rgb: '1E293B' } },
    left:   { style: 'thin', color: { rgb: '1E293B' } },
    right:  { style: 'thin', color: { rgb: '1E293B' } },
  },
};

const TITLE_STYLE = {
  font:      { name: 'Calibri', bold: true, sz: 14, color: { rgb: 'FFFFFF' } },
  fill:      { fgColor: { rgb: '1E293B' } },
  alignment: { horizontal: 'left', vertical: 'center', indent: 1 },
};

const SUBTITLE_STYLE = {
  font:      { name: 'Calibri', italic: true, sz: 10, color: { rgb: '64748B' } },
  fill:      { fgColor: { rgb: 'F8FAFC' } },
  alignment: { horizontal: 'left', vertical: 'center', indent: 1 },
};

export function exportRiskToExcel(guardians) {
  const atRisk = [...guardians]
    .filter(g => g.score < RISK_THRESHOLD)
    .sort((a, b) => a.score - b.score);

  const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const ws = {};

  // ── title (row 1) ──────────────────────────────────────────────────────────
  const dateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  ws['A1'] = cell(`Responsáveis em Situação de Risco — ${dateStr}`, TITLE_STYLE);
  COLS.slice(1).forEach(c => { ws[`${c}1`] = cell('', TITLE_STYLE); });

  // ── subtitle (row 2) ───────────────────────────────────────────────────────
  ws['A2'] = cell(
    `${atRisk.length} responsável(is) com pontuação abaixo de ${RISK_THRESHOLD} — requer atenção imediata`,
    SUBTITLE_STYLE,
  );
  COLS.slice(1).forEach(c => { ws[`${c}2`] = cell('', SUBTITLE_STYLE); });

  // ── headers (row 3) ────────────────────────────────────────────────────────
  const headers = ['#', 'Nome', 'Pontuação', 'Nível', 'Engajamento', 'Leitura (%)', 'Financeiro', 'Motivos de Risco'];
  headers.forEach((h, i) => { ws[`${COLS[i]}3`] = cell(h, HEADER_STYLE); });

  // ── data rows ──────────────────────────────────────────────────────────────
  atRisk.forEach((g, idx) => {
    const row   = idx + 4;
    const tier  = getTier(g.score);
    const isEven = idx % 2 === 0;
    const baseBg = isEven ? 'FFFFFF' : 'F8FAFC';

    const base = {
      font:      { name: 'Calibri', sz: 10 },
      fill:      { fgColor: { rgb: baseBg } },
      alignment: { vertical: 'center' },
      border,
    };

    // #
    ws[`A${row}`] = cell(idx + 1, { ...base, alignment: { horizontal: 'center', vertical: 'center' } });

    // Nome
    ws[`B${row}`] = cell(g.name, base);

    // Pontuação
    ws[`C${row}`] = cell(g.score, {
      ...base,
      font:      { name: 'Calibri', bold: true, sz: 10, color: { rgb: TIER_FONT_COLOR[tier.key] } },
      alignment: { horizontal: 'center', vertical: 'center' },
    });

    // Nível
    ws[`D${row}`] = cell(tier.label, {
      ...base,
      font:      { name: 'Calibri', bold: true, sz: 9, color: { rgb: TIER_FONT_COLOR[tier.key] } },
      alignment: { horizontal: 'center', vertical: 'center' },
    });

    // Engajamento
    ws[`E${row}`] = cell(g.engagement, { ...base, alignment: { horizontal: 'center', vertical: 'center' } });

    // Leitura
    ws[`F${row}`] = cell(g.readRate, { ...base, alignment: { horizontal: 'center', vertical: 'center' } });

    // Financeiro
    const finLabel = STATUS_LABEL[g.overdueStatus] + (g.overdueDays > 0 ? ` (${g.overdueDays}d)` : '');
    ws[`G${row}`] = cell(finLabel, {
      ...base,
      font:      { name: 'Calibri', bold: true, sz: 9, color: { rgb: STATUS_FONT_COLOR[g.overdueStatus] } },
      fill:      { fgColor: { rgb: STATUS_BG_COLOR[g.overdueStatus] } },
      alignment: { horizontal: 'center', vertical: 'center' },
    });

    // Motivos
    ws[`H${row}`] = cell(buildReasons(g), base);
  });

  // ── sheet range ────────────────────────────────────────────────────────────
  const lastRow = atRisk.length + 3;
  ws['!ref'] = `A1:H${lastRow}`;

  // ── merges (title + subtitle span all columns) ─────────────────────────────
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } },
  ];

  // ── column widths ──────────────────────────────────────────────────────────
  ws['!cols'] = [
    { wch: 5  },
    { wch: 28 },
    { wch: 11 },
    { wch: 11 },
    { wch: 13 },
    { wch: 12 },
    { wch: 20 },
    { wch: 42 },
  ];

  // ── row heights ────────────────────────────────────────────────────────────
  ws['!rows'] = [
    { hpt: 36 },
    { hpt: 22 },
    { hpt: 28 },
    ...Array(atRisk.length).fill({ hpt: 22 }),
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Responsáveis em Risco');

  const fileName = `responsaveis-em-risco-${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
