'use client';

import { useState } from 'react';
import { PageShell, PageIntro, Photo } from '../../src/components/Editorial';
import { suites } from '../../src/data/content';
import { periods, paymentMethods, getDayType, quoteReservation } from '../../src/data/reservation';
import { whatsappUrl } from '../../src/data/site';

function today() {
  const date = new Date();
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

const requiredMessages = {
  suite: 'Selecione uma suíte.',
  occasion: 'Informe se a data é comum, feriado ou véspera.',
  date: 'Informe a data de entrada.',
  time: 'Selecione o horário de entrada.',
  period: 'Selecione o período.',
  name: 'Informe seu nome completo.',
  email: 'Informe um e-mail válido.',
  phone: 'Informe um telefone válido com DDD.',
  paymentMethod: 'Selecione a preferência de pagamento.',
};

export default function ReservasContent() {
  const [suite, setSuite] = useState('');
  const [period, setPeriod] = useState('');
  const [link, setLink] = useState('');
  const [errors, setErrors] = useState({});
  const [date, setDate] = useState(today);
  const [time, setTime] = useState('18:00');
  const [occasion, setOccasion] = useState('');
  const quote = quoteReservation({ suite, period, date, time, occasion });
  const price = quote?.price;
  const nextMorning = period === 'pernoite' && getDayType(date, occasion) === 'weekend';
  const selectedSuite = suites.find((item) => item.id === suite);

  function fieldProps(name) {
    return {
      'aria-invalid': errors[name] ? true : undefined,
      'aria-describedby': errors[name] ? name + '-error' : undefined,
    };
  }

  function errorMessage(name) {
    return errors[name] && <span id={name + '-error'} className="form-note">{errors[name]}</span>;
  }

  function handleChange(event) {
    setLink('');
    const name = event.target.name;
    setErrors((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function submit(event) {
    event.preventDefault();
    setLink('');
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const nextErrors = {};
    for (const [name, message] of Object.entries(requiredMessages)) {
      if (!data[name]?.trim() || !form.elements.namedItem(name).validity.valid) {
        nextErrors[name] = message;
      }
    }
    if (!suites.some((item) => item.id === data.suite)) nextErrors.suite = requiredMessages.suite;
    if (!periods[data.period]) nextErrors.period = requiredMessages.period;
    if (!getDayType(data.date, data.occasion)) nextErrors.occasion = requiredMessages.occasion;
    if (!paymentMethods[data.paymentMethod]) nextErrors.paymentMethod = requiredMessages.paymentMethod;
    const submittedQuote = quoteReservation(data);
    if (submittedQuote?.error) nextErrors.time = submittedQuote.error;
    if (data.name.trim().length < 3) nextErrors.name = requiredMessages.name;
    const digits = data.phone.replace(/\D/g, '');
    const localPhone = digits.length > 11 && digits.startsWith('55') ? digits.slice(2) : digits;
    if (!/^[+\d\s().-]+$/.test(data.phone) || !/^\d{10,11}$/.test(localPhone)) {
      nextErrors.phone = requiredMessages.phone;
    }
    if (data.date && data.date < today()) nextErrors.date = 'Escolha uma data a partir de hoje.';
    setErrors(nextErrors);
    const firstInvalid = Array.from(form.elements).find((field) => nextErrors[field.name]);
    if (firstInvalid) {
      firstInvalid.focus({ preventScroll: true });
      firstInvalid.scrollIntoView({ block: 'center', behavior: 'instant' });
      return;
    }

    const name = suites.find((item) => item.id === data.suite).title;
    const value = submittedQuote.price;
    const message = [
      'Olá, gostaria de fazer uma reserva:',
      '',
      '*' + name + '*',
      '*Data de referência da estadia:* ' + data.date.split('-').reverse().join('/'),
      '*Condição da data:* ' + ({ regular: 'Dia comum', holiday: 'Feriado', eve: 'Véspera de feriado' }[data.occasion]),
      '*Entrada:* ' + submittedQuote.arrivalDate.split('-').reverse().join('/') + ' às ' + submittedQuote.arrivalTime,
      '*Horário:* ' + data.time,
      '*Período:* ' + submittedQuote.label,
      '*Regra:* ' + submittedQuote.rule,
      ...(submittedQuote.checkoutDate ? ['*Saída até:* ' + submittedQuote.checkoutDate.split('-').reverse().join('/') + ' às ' + submittedQuote.checkoutTime] : []),
      '*Valor:* ' + value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      '',
      '*Nome:* ' + data.name.trim(),
      '*Telefone:* ' + data.phone.trim(),
      '*E-mail:* ' + data.email.trim(),
      '',
      '*Preferência de pagamento:* ' + paymentMethods[data.paymentMethod],
      '',
      'Aguardo a confirmação de disponibilidade, tarifa e condições com a equipe.',
    ].join('\n');
    const url = whatsappUrl(message);
    setLink(url);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <PageShell>
      <PageIntro eyebrow="Reserve seu momento" title="O próximo encontro é seu." description="Escolha a suíte e os detalhes da estadia. Nossa equipe confirma sua reserva pelo WhatsApp." />
      <div className="booking-grid wrap">
        <aside className="booking-aside">
          <Photo src={selectedSuite?.images[0] || '/images/suite-private.jpg'} alt={selectedSuite?.title || 'Suíte Private'} priority />
          <h2>Comece a planejar.</h2>
          <p>A reserva será finalizada com um atendente. A seleção de uma data não garante disponibilidade.</p>
          <p>Sem pagamento neste formulário. Você poderá revisar sua mensagem antes de enviá-la no WhatsApp.</p>
        </aside>
        <form className="form" onSubmit={submit} onChange={handleChange} noValidate>
          <p className="form-note">Todos os campos são obrigatórios.</p>
          <div className="field">
            <label htmlFor="suite">Sua suíte</label>
            <select id="suite" name="suite" required value={suite} onChange={(event) => setSuite(event.target.value)} {...fieldProps('suite')}>
              <option value="">Selecione uma suíte</option>
              {suites.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>
            {errorMessage('suite')}
          </div>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="date">{period === "pernoite" ? "Data da noite do pernoite" : "Data de entrada"}</label>
              <input type="date" id="date" name="date" required min={today()} value={date} onChange={(event) => setDate(event.target.value)} {...fieldProps('date')} />
              {errorMessage('date')}
            </div>
            <div className="field">
              <label htmlFor="time">{nextMorning ? 'Entrada na madrugada/manhã seguinte' : 'Horário de entrada'}</label>
              <input type="time" id="time" name="time" value={time} onChange={(event) => setTime(event.target.value)} required {...fieldProps('time')} />
              {errorMessage('time')}
            </div>
          </div>
          <div className="field">
            <label htmlFor="occasion">Condição da data</label>
            <select id="occasion" name="occasion" required value={occasion} onChange={(event) => setOccasion(event.target.value)} {...fieldProps('occasion')}>
              <option value="">Selecione</option>
              <option value="regular">Dia comum (não é feriado nem véspera)</option>
              <option value="holiday">Feriado</option>
              <option value="eve">Véspera de feriado</option>
            </select>
            {errorMessage('occasion')}
          </div>
          <div className="field">
            <label htmlFor="period">Período</label>
            <select id="period" name="period" value={period} onChange={(event) => setPeriod(event.target.value)} required {...fieldProps('period')}>
              <option value="">Selecione o período</option>
              {Object.entries(periods).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            {errorMessage('period')}
          </div>
          <div className="field">
            <label htmlFor="name">Nome completo</label>
            <input id="name" name="name" autoComplete="name" minLength={3} required {...fieldProps('name')} />
            {errorMessage('name')}
          </div>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input id="email" name="email" type="email" autoComplete="email" required {...fieldProps('email')} />
              {errorMessage('email')}
            </div>
            <div className="field">
              <label htmlFor="phone">Telefone com DDD</label>
              <input id="phone" name="phone" type="tel" autoComplete="tel" required {...fieldProps('phone')} />
              {errorMessage('phone')}
            </div>
          </div>
          <div className="field">
            <label htmlFor="paymentMethod">Preferência de pagamento</label>
            <select id="paymentMethod" name="paymentMethod" required {...fieldProps('paymentMethod')}>
              {Object.entries(paymentMethods).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
            {errorMessage('paymentMethod')}
          </div>
          {period === 'pernoite' && <p className="form-note">{nextMorning ? 'A data selecionada identifica a noite. A entrada será no dia seguinte, após 23h59, com saída até 12h.' : 'Pernoite de domingo a quinta e feriados: entrada após 20h e permanência de 12 horas.'}</p>}
          {quote?.error && <p className="form-note">{quote.error}</p>}
          {price && <p className="booking-summary" aria-live="polite">Valor informado no formulário: <strong>{price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong><br />{quote.label}<br /><small>{quote.rule} Confirme a disponibilidade com a equipe.</small></p>}
          {Object.keys(errors).length > 0 && <p className="form-feedback" role="alert">Revise os campos indicados antes de continuar.</p>}
          <button type="submit" className="button">Continuar no WhatsApp</button>
          {link && <div className="form-feedback" role="status">Sua mensagem está pronta. Envie-a no WhatsApp para consultar disponibilidade e confirmar os detalhes com um atendente. <a className="text-link" href={link} target="_blank" rel="noopener noreferrer">Abrir WhatsApp novamente</a></div>}
        </form>
      </div>
    </PageShell>
  );
}
