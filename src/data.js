export const GUARDIANS = [
  { id: 1,  name: "Ana Paula Ribeiro",     score: 94, engagement: 38, readRate: 98, overdueStatus: "em_dia",      overdueDays: 0,   trend: +4 },
  { id: 2,  name: "Carlos Eduardo Matos",  score: 92, engagement: 34, readRate: 95, overdueStatus: "em_dia",      overdueDays: 0,   trend: +3 },
  { id: 3,  name: "Fernanda Lima Souza",   score: 88, engagement: 29, readRate: 92, overdueStatus: "em_dia",      overdueDays: 0,   trend: +2 },
  { id: 4,  name: "Rafael Oliveira",       score: 85, engagement: 27, readRate: 89, overdueStatus: "em_dia",      overdueDays: 0,   trend: +1 },
  { id: 5,  name: "Mariana Costa Pires",   score: 81, engagement: 24, readRate: 88, overdueStatus: "em_dia",      overdueDays: 0,   trend:  0 },
  { id: 6,  name: "Juliana Azevedo",       score: 78, engagement: 22, readRate: 84, overdueStatus: "em_dia",      overdueDays: 0,   trend: +1 },
  { id: 7,  name: "Bruno Henrique Martins",score: 76, engagement: 21, readRate: 82, overdueStatus: "em_dia",      overdueDays: 0,   trend: -1 },
  { id: 8,  name: "Patricia Nogueira",     score: 72, engagement: 19, readRate: 78, overdueStatus: "em_dia",      overdueDays: 0,   trend:  0 },
  { id: 9,  name: "Leonardo Fonseca",      score: 68, engagement: 17, readRate: 74, overdueStatus: "em_dia",      overdueDays: 0,   trend: +2 },
  { id: 10, name: "Camila Teixeira",       score: 66, engagement: 16, readRate: 71, overdueStatus: "em_dia",      overdueDays: 0,   trend: -1 },
  { id: 11, name: "Diego Ramalho",         score: 61, engagement: 14, readRate: 68, overdueStatus: "atrasado",    overdueDays: 8,   trend: -2 },
  { id: 12, name: "Sabrina Vidal",         score: 57, engagement: 13, readRate: 62, overdueStatus: "atrasado",    overdueDays: 12,  trend: -3 },
  { id: 13, name: "Thiago Mendes",         score: 54, engagement: 11, readRate: 58, overdueStatus: "atrasado",    overdueDays: 15,  trend: -1 },
  { id: 14, name: "Vanessa Brandão",       score: 49, engagement: 10, readRate: 54, overdueStatus: "atrasado",    overdueDays: 22,  trend: -3 },
  { id: 15, name: "André Siqueira",        score: 44, engagement:  8, readRate: 48, overdueStatus: "atrasado",    overdueDays: 28,  trend: -2 },
  { id: 16, name: "Priscila Moura",        score: 40, engagement:  6, readRate: 41, overdueStatus: "inadimplente",overdueDays: 45,  trend: -5 },
  { id: 17, name: "Rodrigo Farias",        score: 34, engagement:  4, readRate: 35, overdueStatus: "inadimplente",overdueDays: 62,  trend: -4 },
  { id: 18, name: "Larissa Pimentel",      score: 28, engagement:  3, readRate: 28, overdueStatus: "inadimplente",overdueDays: 78,  trend: -6 },
  { id: 19, name: "Gustavo Almeida",       score: 22, engagement:  2, readRate: 22, overdueStatus: "inadimplente",overdueDays: 91,  trend: -7 },
  { id: 20, name: "Beatriz Carvalho",      score: 16, engagement:  1, readRate: 14, overdueStatus: "inadimplente",overdueDays: 112, trend: -8 },
  { id: 21, name: "Eduardo Prado",         score: 80, engagement: 23, readRate: 86, overdueStatus: "em_dia",      overdueDays: 0,   trend: +2 },
  { id: 22, name: "Tatiana Ruiz",          score: 73, engagement: 20, readRate: 79, overdueStatus: "em_dia",      overdueDays: 0,   trend:  0 },
  { id: 23, name: "Henrique Bastos",       score: 67, engagement: 15, readRate: 72, overdueStatus: "em_dia",      overdueDays: 0,   trend: +1 },
  { id: 24, name: "Natália Arruda",        score: 60, engagement: 13, readRate: 64, overdueStatus: "atrasado",    overdueDays: 6,   trend:  0 },
  { id: 25, name: "Felipe Drummond",       score: 49, engagement:  9, readRate: 52, overdueStatus: "atrasado",    overdueDays: 19,  trend: -2 },
];

export const SCHOOL_HISTORY = [58, 59, 60, 60, 61, 62, 62, 63];

export const TIERS = [
  { key: "excelente", label: "Excelente", min: 80, max: 100, color: "#059669" },
  { key: "bom",       label: "Bom",       min: 65, max: 79,  color: "#8716bb" },
  { key: "atencao",   label: "Atenção",   min: 50, max: 64,  color: "#d97706" },
  { key: "ruim",      label: "Ruim",      min: 30, max: 49,  color: "#ea580c" },
  { key: "critico",   label: "Crítico",   min: 0,  max: 29,  color: "#dc2626" },
];

export const RISK_THRESHOLD = 50;
export const MAX_SCORE = 100;

export const READRATE_TOOLTIP =
  "Inclui leitura de comunicados, confirmação de presença em eventos, resposta de atividades e respostas de autorizações e enquetes.";

export function getTier(score) {
  return TIERS.find(t => score >= t.min && score <= t.max);
}
