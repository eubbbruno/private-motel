'use client';

import { useState } from 'react';
import { whatsappUrl } from '../data/site';

const fields = [
  { name: 'name', label: 'Seu nome', autoComplete: 'name' },
  { name: 'phone', label: 'Telefone (opcional)', type: 'tel', autoComplete: 'tel', optional: true },
  { name: 'email', label: 'E-mail', type: 'email', autoComplete: 'email' },
  { name: 'subject', label: 'Assunto' },
  { name: 'message', label: 'Como podemos ajudar?', multiline: true },
];

export default function FormularioContato() {
  const [link, setLink] = useState('');
  const [errors, setErrors] = useState({});

  function submit(event) {
    event.preventDefault();
    setLink('');
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const nextErrors = {};
    for (const field of fields) {
      if (!field.optional && !data[field.name].trim()) {
        nextErrors[field.name] = 'Preencha este campo.';
      } else if (!form.elements.namedItem(field.name).validity.valid) {
        nextErrors[field.name] = 'Informe um e-mail válido.';
      }
    }
    if (data.phone.trim()) {
      const digits = data.phone.replace(/\D/g, '');
      const local = digits.length > 11 && digits.startsWith('55') ? digits.slice(2) : digits;
      if (!/^[+\d\s().-]+$/.test(data.phone) || !/^\d{10,11}$/.test(local)) {
        nextErrors.phone = 'Informe um telefone válido com DDD ou deixe em branco.';
      }
    }
    setErrors(nextErrors);
    const first = Array.from(form.elements).find((field) => nextErrors[field.name]);
    if (first) {
      first.focus({ preventScroll: true });
      first.scrollIntoView({ block: 'center', behavior: 'instant' });
      return;
    }
    const message = [
      '*Contato via Site - Private Motel*', '',
      '*Nome:* ' + data.name.trim(),
      '*E-mail:* ' + data.email.trim(),
      '*Telefone:* ' + (data.phone.trim() || 'Não informado'),
      '*Assunto:* ' + data.subject.trim(), '',
      '*Mensagem:*', data.message.trim(),
    ].join('\n');
    const url = whatsappUrl(message);
    setLink(url);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function fieldControl(field) {
    const id = 'contact-' + field.name;
    const props = {
      id, name: field.name, required: !field.optional,
      autoComplete: field.autoComplete,
      'aria-invalid': errors[field.name] ? true : undefined,
      'aria-describedby': errors[field.name] ? id + '-error' : undefined,
    };
    return <div className="field" key={field.name}>
      <label htmlFor={id}>{field.label}</label>
      {field.multiline ? <textarea {...props} /> : <input {...props} type={field.type || 'text'} />}
      {errors[field.name] && <span className="form-note" id={id + '-error'}>{errors[field.name]}</span>}
    </div>;
  }

  return <form className="form" noValidate onSubmit={submit} onChange={(event) => {
    setLink('');
    const name = event.target.name;
    setErrors((current) => { const next = { ...current }; delete next[name]; return next; });
  }}>
    <p className="form-note">Preencha os campos abaixo. O telefone é opcional.</p>
    <div className="form-grid">{fields.slice(0, 2).map(fieldControl)}</div>
    {fields.slice(2).map(fieldControl)}
    {Object.keys(errors).length > 0 && <p role="alert" className="form-feedback">Revise os campos indicados antes de continuar.</p>}
    <button className="button" type="submit">Continuar no WhatsApp</button>
    <p className="form-note">Sua mensagem será aberta no WhatsApp para você revisar e enviar.</p>
    {link && <div className="form-feedback" role="status">Continue no WhatsApp para enviar sua mensagem. <a href={link} target="_blank" rel="noopener noreferrer" className="text-link">Abrir conversa</a></div>}
  </form>;
}
