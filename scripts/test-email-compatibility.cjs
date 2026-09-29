const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const nodemailer = require('nodemailer');

// Exercise the installed mail composer without opening a network connection.
function loadRoute(file, fail = false) {
  const messages = [];
  const configs = [];
  const context = {
    process: { env: { NODE_ENV: 'production', EMAIL_HOST: 'smtp.example.invalid',
      EMAIL_PORT: '587', EMAIL_USER: 'test@example.invalid', EMAIL_PASS: 'mock-pass',
      EMAIL_PASSWORD: 'mock-password', EMAIL_FROM: 'test@example.invalid', EMAIL_TO: 'desk@example.invalid' } },
    console: { log() {}, error() {} },
    NextResponse: { json: (body, options = {}) => ({ body, status: options.status || 200 }) },
    nodemailer: { createTransport(config) {
      configs.push(config);
      const local = nodemailer.createTransport({ streamTransport: true, buffer: true });
      return { async sendMail(mail) {
        if (fail) throw new Error('Simulated SMTP failure');
        assert.equal(typeof mail.html, 'string');
        const result = await local.sendMail(mail);
        assert.ok(result.message.length > 0);
        messages.push(mail);
        return result;
      } };
    } },
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, 'utf8').replace(/^import .*;\r?\n/gm, '').replace(/export /g, ''), context);
  return { post: body => context.POST({ json: async () => body }), messages, configs };
}

(async () => {
  const contactData = { name: 'Teste', email: 'guest@example.invalid', phone: '43999999999', message: 'Mensagem\nTeste', subject: 'Dúvida' };
  const contact = loadRoute('app/api/send-contact/route.js');
  assert.equal((await contact.post({})).status, 400);
  assert.equal(contact.messages.length, 0);
  assert.equal((await contact.post(contactData)).status, 200);
  assert.equal(contact.messages[0].to, 'desk@example.invalid');
  assert.equal(contact.configs[0].auth.pass, 'mock-pass');
  const email = loadRoute('app/api/send-email/route.js');
  assert.equal((await email.post({})).status, 400);
  assert.equal((await email.post({ templateName: 'missing', emailData: contactData })).status, 400);
  for (const templateName of ['contact', 'reservation-confirmation', 'payment-confirmation']) {
    const response = await email.post({ templateName, emailData: contactData });
    assert.equal(response.status, 200, templateName);
    assert.equal(email.messages.at(-1).to, templateName === 'contact' ? 'contato@privatemotel.com.br' : contactData.email);
  }
  assert.equal(email.configs[0].auth.pass, 'mock-password');
  for (const file of ['send-contact', 'send-email']) {
    const failed = loadRoute(`app/api/${file}/route.js`, true);
    assert.equal((await failed.post(file === 'send-contact' ? contactData : { templateName: 'contact', emailData: contactData })).status, 500);
  }
  console.log('PASS: installed Nodemailer composer, both route contracts, three templates, SMTP variable names, invalid input and simulated failures. No network or real email.');
})().catch(error => { console.error(error); process.exitCode = 1; });
