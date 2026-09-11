import { suites } from './content';

// Prices are read directly from the same records rendered by /suites.
export const reservationPrices = Object.fromEntries(suites.map(({ id, pricing }) => [
  id, Object.fromEntries(Object.entries(pricing).map(([key, value]) => [key, Number(value.replace('R$', '').trim().replace(/\./g, '').replace(',', '.'))])),
]));
export const periods = { periodo: 'Período', pernoite: 'Pernoite' };
export const paymentMethods = { pix: 'PIX', cash: 'Dinheiro', credit_card: 'Cartão de crédito à vista', debit_card: 'Cartão de débito à vista' };
export const reservationRules = {
  weekday: { label: 'Domingo a quinta:', text: 'períodos de 6 horas.', hours: 6 },
  holiday: { label: 'Feriados:', text: 'das 00h às 6h59, períodos de 4 horas. A partir das 7h, períodos de 6 horas.', before: 4, after: 6, cutoff: '07:00' },
  weekend: { label: 'Sexta, sábado e véspera de feriados:', text: 'Suíte Private: período de 6 horas. Diamante Luxo, Prata e Bronze: períodos de 4 horas.', hours: 4, suiteHours: { 'suite-private': 6 } },
  overnightWeek: { label: 'Domingo a quinta e feriados:', text: 'entrada após as 20h, permanência de 12 horas.', start: '20:00', hours: 12 },
  overnightWeekend: { label: 'Sexta, sábado e véspera de feriados:', text: 'entrada após as 23h59 e permanência até 12h.', checkout: '12:00' },
};

function addDays(date, days) {
  const result = new Date(date + 'T12:00:00Z');
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}
export function getDayType(date, occasion) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '') || !['regular', 'holiday', 'eve'].includes(occasion)) return null;
  const parsed = new Date(date + 'T12:00:00Z');
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return null;
  if (occasion === 'eve') return 'weekend';
  if (occasion === 'holiday') return 'holiday';
  return [5, 6].includes(parsed.getUTCDay()) ? 'weekend' : 'weekday';
}
export function quoteReservation({ suite, period, date, time, occasion }) {
  const prices = reservationPrices[suite];
  const dayType = getDayType(date, occasion);
  if (!prices || !periods[period] || !dayType || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time || '')) return null;
  const weekend = dayType === 'weekend';
  const dayLabel = occasion === 'holiday' ? 'Feriado' : occasion === 'eve' ? 'Véspera de feriado' : weekend ? 'Sexta ou sábado' : 'Domingo a quinta';
  if (period === 'periodo') {
    const hours = dayType === 'holiday'
      ? (time < reservationRules.holiday.cutoff ? reservationRules.holiday.before : reservationRules.holiday.after)
      : (reservationRules[dayType].suiteHours?.[suite] ?? reservationRules[dayType].hours);
    return { price: prices.periodo, label: 'Período (' + hours + ' horas)', rule: dayLabel, arrivalDate: date, arrivalTime: time, hours };
  }
  const price = prices.pernoite ?? (weekend ? prices.pernoiteFimSemana : prices.pernoiteSemana);
  if (weekend) {
    if (time >= reservationRules.overnightWeekend.checkout) return { error: 'Escolha um horário entre 00:00 e 11:59 da madrugada/manhã seguinte.' };
    return { price, label: 'Pernoite — saída até 12h', rule: reservationRules.overnightWeekend.text, arrivalDate: addDays(date, 1), arrivalTime: time, checkoutDate: addDays(date, 1), checkoutTime: '12:00' };
  }
  if (time < reservationRules.overnightWeek.start) return { error: 'Para este pernoite, escolha entrada a partir das 20:00.' };
  const checkoutHour = String((Number(time.slice(0, 2)) + 12) % 24).padStart(2, '0');
  return { price, label: 'Pernoite (12 horas)', rule: reservationRules.overnightWeek.text, arrivalDate: date, arrivalTime: time, checkoutDate: addDays(date, 1), checkoutTime: checkoutHour + time.slice(2) };
}
