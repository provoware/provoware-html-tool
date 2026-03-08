import { safeArray, safeObject, safeText } from '../../js/services/module-boundary-utils.js';

const SEVERITY = new Set(['info', 'warn', 'error']);

const asText = (value) => safeText(value);
const nowIso = () => new Date().toISOString();
const nextId = () => `log_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;

const normalizeSeverity = (value) => {
  const clean = asText(value).toLowerCase();
  return SEVERITY.has(clean) ? clean : 'info';
};

const normalizeContext = (value) => {
  const safeValue = safeObject(value, null);
  if (!safeValue) return {};
  try {
    return JSON.parse(JSON.stringify(safeValue));
  } catch {
    return { info: 'Kontext konnte nicht sicher gespeichert werden.' };
  }
};

export const createLogStore = () => ({
  createdAt: nowIso(),
  entries: []
});

export const addLogEntry = (store, input = {}) => {
  const safeStore = safeObject(store, createLogStore());
  const entry = {
    id: nextId(),
    eventName: asText(input.eventName) || 'Unbenanntes Ereignis',
    severity: normalizeSeverity(input.severity),
    source: asText(input.source) || 'Anwendung',
    message: asText(input.message),
    context: normalizeContext(input.context),
    createdAt: nowIso()
  };
  return {
    ...safeStore,
    entries: [...(safeStore.entries || []), entry]
  };
};

export const exportLogEntries = (store) => {
  const entries = safeArray(store?.entries);
  return JSON.stringify({ exportedAt: nowIso(), count: entries.length, entries }, null, 2);
};
