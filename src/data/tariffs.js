// Public suite tariffs. The stay date selects the applicable table; no backend payment is implied.
export const octoberTariffStart = '2026-10-01';

const tariffs = {
  'suite-private': {
    current: { periodo: 365, pernoite: 417, horaExtra: 65 },
    october: { periodo: 385, pernoite: 437, horaExtra: 80 },
  },
  'suite-diamante-luxo': {
    current: { periodo: 305, pernoiteSemana: 330, pernoiteFimSemana: 360, horaExtra: 59 },
    october: { periodo: 315, pernoiteSemana: 340, pernoiteFimSemana: 370, horaExtra: 65 },
  },
  'suite-prata': {
    current: { periodo: 165, pernoiteSemana: 218, pernoiteFimSemana: 245, horaExtra: 48 },
    october: { periodo: 185, pernoiteSemana: 238, pernoiteFimSemana: 265, horaExtra: 55 },
  },
  'suite-bronze': {
    current: { periodo: 135, pernoiteSemana: 185, pernoiteFimSemana: 213, horaExtra: 35 },
    october: { periodo: 145, pernoiteSemana: 195, pernoiteFimSemana: 223, horaExtra: 42 },
  },
};

export function currentBusinessDate(now = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
}

export function getSuiteTariff(suiteId, stayDate = currentBusinessDate()) {
  const record = tariffs[suiteId];
  return record ? record[stayDate >= octoberTariffStart ? 'october' : 'current'] : null;
}

export const formatTariff = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function getDisplayPricing(suiteId, stayDate = currentBusinessDate()) {
  const tariff = getSuiteTariff(suiteId, stayDate);
  return tariff ? Object.fromEntries(Object.entries(tariff).map(([key, value]) => [key, formatTariff(value)])) : null;
}
