export const maintenanceSuites = Object.freeze(['Private Duplex', 'Diamante Luxo', 'Prata', 'Bronze']);
export const maintenanceRooms = Object.freeze([
  ...['20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','40','41','42','43','44','45'].map(number => ({ number, suite: 'Bronze' })),
  ...['50','51','52','53','55','57','59','61','62','63','64','65','66','67','68','69'].map(number => ({ number, suite: 'Prata' })),
  ...['54','56','58','60','70','71'].map(number => ({ number, suite: 'Diamante Luxo' })),
  ...['72','73','74','75'].map(number => ({ number, suite: 'Private Duplex' })),
]);
export const maintenanceCategories = Object.freeze([
  'Acabamentos', 'Climatização', 'Elétrica', 'Eletrônicos', 'Hidráulica',
  'Hidromassagem', 'Mobiliário', 'Sauna', 'Segurança', 'Outros',
]);
export const maintenanceTypes = Object.freeze(['preventive', 'corrective', 'inspection', 'installation']);
export const maintenanceStatuses = Object.freeze(['completed', 'scheduled', 'in_progress', 'cancelled']);

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const clean = (value, max, required = false) => {
  if (typeof value !== 'string') throw Error('Preencha os campos obrigatórios.');
  const result = value.trim();
  if ((required && !result) || result.length > max) throw Error(required ? 'Preencha os campos obrigatórios.' : 'Um dos campos excede o tamanho permitido.');
  return result;
};
const date = (value, required = false) => {
  if ((value === '' || value === null || value === undefined) && !required) return null;
  if (typeof value !== 'string' || !datePattern.test(value) || Number.isNaN(Date.parse(`${value}T12:00:00Z`))) throw Error('Informe uma data válida.');
  return value;
};

export function validateMaintenance(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw Error('Registro inválido.');
  const allowed = ['suite', 'suite_number', 'item', 'category', 'service_type', 'status', 'performed_on', 'completed_on', 'next_due_on', 'description', 'provider', 'cost', 'notes'];
  if (Object.keys(input).some(key => !allowed.includes(key))) throw Error('Campos desconhecidos.');
  const suiteNumber = clean(input.suite_number, 20, true);
  const room = maintenanceRooms.find(item => item.number === suiteNumber);
  if (!room) throw Error('Selecione um número de suíte válido.');
  const suite = clean(input.suite, 80, true);
  const category = clean(input.category, 80, true);
  if (!maintenanceSuites.includes(suite) || room.suite !== suite) throw Error('A categoria não corresponde ao número da suíte.');
  if (!maintenanceCategories.includes(category)) throw Error('Categoria inválida.');
  if (!maintenanceTypes.includes(input.service_type)) throw Error('Tipo de manutenção inválido.');
  if (!maintenanceStatuses.includes(input.status)) throw Error('Estado inválido.');
  const performed_on = date(input.performed_on, true);
  const completed_on = date(input.completed_on, input.status === 'completed');
  const next_due_on = date(input.next_due_on);
  if (completed_on && completed_on < performed_on) throw Error('A conclusão não pode ser anterior à data do serviço.');
  if (next_due_on && next_due_on < performed_on) throw Error('A próxima revisão não pode ser anterior à data do serviço.');
  const amount = input.cost === '' || input.cost === null || input.cost === undefined ? null : Number(input.cost);
  if (amount !== null && (!Number.isFinite(amount) || amount < 0 || amount > 99999999.99)) throw Error('Informe um custo válido.');
  return {
    suite,
    suite_number: suiteNumber,
    item: clean(input.item, 120, true),
    category,
    service_type: input.service_type,
    status: input.status,
    performed_on,
    completed_on: input.status === 'completed' ? completed_on : null,
    next_due_on,
    description: clean(input.description || '', 2000),
    provider: clean(input.provider || '', 160),
    cost: amount,
    notes: clean(input.notes || '', 2000),
  };
}
