import assert from 'node:assert/strict';
import { currentBusinessDate, getSuiteTariff, getDisplayPricing } from '../src/data/tariffs.js';
import { getSuitesForDate } from '../src/data/content.js';
import { quoteReservation } from '../src/data/reservation.js';

const expected = {
  'suite-private': { periodo: 385, pernoite: 437, horaExtra: 80 },
  'suite-diamante-luxo': { periodo: 315, pernoiteSemana: 340, pernoiteFimSemana: 370, horaExtra: 65 },
  'suite-prata': { periodo: 185, pernoiteSemana: 238, pernoiteFimSemana: 265, horaExtra: 55 },
  'suite-bronze': { periodo: 145, pernoiteSemana: 195, pernoiteFimSemana: 223, horaExtra: 42 },
};
const previous = {
  'suite-private': { periodo: 365, pernoite: 417, horaExtra: 65 },
  'suite-diamante-luxo': { periodo: 305, pernoiteSemana: 330, pernoiteFimSemana: 360, horaExtra: 59 },
  'suite-prata': { periodo: 165, pernoiteSemana: 218, pernoiteFimSemana: 245, horaExtra: 48 },
  'suite-bronze': { periodo: 135, pernoiteSemana: 185, pernoiteFimSemana: 213, horaExtra: 35 },
};

assert.equal(currentBusinessDate(new Date('2026-10-01T02:59:00Z')), '2026-09-30');
assert.equal(currentBusinessDate(new Date('2026-10-01T03:00:00Z')), '2026-10-01');

for (const [suite, prices] of Object.entries(expected)) {
  assert.deepEqual(getSuiteTariff(suite, '2026-10-01'), prices);
  assert.deepEqual(getSuiteTariff(suite, '2026-09-30'), previous[suite]);
  assert.equal(getSuitesForDate('2026-10-01').find(item => item.id === suite).pricing.periodo, getDisplayPricing(suite, '2026-10-01').periodo);
  for (const [date, occasion, priceKey, hours] of [
    ['2026-10-01', 'regular', 'periodo', 6],
    ['2026-10-02', 'regular', 'periodo', suite === 'suite-private' ? 6 : 4],
    ['2026-10-03', 'regular', 'periodo', suite === 'suite-private' ? 6 : 4],
    ['2026-10-01', 'eve', 'periodo', suite === 'suite-private' ? 6 : 4],
    ['2026-10-01', 'holiday', 'periodo', 6],
  ]) {
    const quote = quoteReservation({ suite, period: 'periodo', date, time: '18:00', occasion });
    assert.equal(quote.price, prices[priceKey]);
    assert.equal(quote.hours, hours);
  }
  const week = quoteReservation({ suite, period: 'pernoite', date: '2026-10-01', time: '20:00', occasion: 'regular' });
  const weekend = quoteReservation({ suite, period: 'pernoite', date: '2026-10-02', time: '00:30', occasion: 'regular' });
  assert.equal(week.price, prices.pernoite ?? prices.pernoiteSemana);
  assert.equal(weekend.price, prices.pernoite ?? prices.pernoiteFimSemana);
  assert.equal(weekend.arrivalDate, '2026-10-03');
  assert.equal(weekend.tariffStartsAt, '2026-10-01');
  assert.equal(quoteReservation({ suite, period: 'periodo', date: '2026-10-01', time: '06:59', occasion: 'holiday' }).hours, 4);
}

assert.equal(quoteReservation({ suite: 'suite-private', period: 'periodo', date: '2026-09-30', time: '18:00', occasion: 'regular' }).price, 365);
console.log('Tarifas de outubro, virada de data e regras de reserva: OK');
