export const maintenanceSuites = Object.freeze(['Private Duplex', 'Diamante Luxo', 'Prata', 'Bronze']);
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
  const allowed = ['suite', 'item', 'category', 'service_type', 'status', 'performed_on', 'next_due_on', 'description', 'provider', 'cost', 'notes'];
  if (Object.keys(input).some(key => !allowed.includes(key))) throw Error('Campos desconhecidos.');
  const suite = clean(input.suite, 80, true);
  const category = clean(input.category, 80, true);
  if (!maintenanceSuites.includes(suite)) throw Error('Suíte inválida.');
  if (!maintenanceCategories.includes(category)) throw Error('Categoria inválida.');
  if (!maintenanceTypes.includes(input.service_type)) throw Error('Tipo de manutenção inválido.');
  if (!maintenanceStatuses.includes(input.status)) throw Error('Estado inválido.');
  const performed_on = date(input.performed_on, input.status === 'completed');
  const next_due_on = date(input.next_due_on);
  if (performed_on && next_due_on && next_due_on < performed_on) throw Error('A próxima revisão não pode ser anterior à manutenção.');
  const amount = input.cost === '' || input.cost === null || input.cost === undefined ? null : Number(input.cost);
  if (amount !== null && (!Number.isFinite(amount) || amount < 0 || amount > 99999999.99)) throw Error('Informe um custo válido.');
  return {
    suite,
    item: clean(input.item, 120, true),
    category,
    service_type: input.service_type,
    status: input.status,
    performed_on,
    next_due_on,
    description: clean(input.description || '', 2000, true),
    provider: clean(input.provider || '', 160),
    cost: amount,
    notes: clean(input.notes || '', 2000),
  };
}
