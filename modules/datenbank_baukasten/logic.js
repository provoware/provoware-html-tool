const asText = (value) => String(value || '').trim();
const nowIso = () => new Date().toISOString();

const normalizeColumn = (column = {}, index = 0) => ({
  name: asText(column.name) || `spalte_${index + 1}`,
  type: asText(column.type).toLowerCase() || 'text',
  required: Boolean(column.required)
});

const normalizeRecord = (record = {}, columns = []) => {
  const output = {};
  columns.forEach((column) => {
    const key = column.name;
    const raw = record[key];
    if (raw === undefined || raw === null) {
      output[key] = '';
      return;
    }
    output[key] = String(raw).trim();
  });
  return output;
};

export const createDatenbankBaukastenModule = () => ({
  id: 'datenbank_baukasten',
  ready: true,
  version: '1.1.0'
});

export const createTableBlueprint = (input = {}) => {
  const safeInput = input && typeof input === 'object' ? input : {};
  const tableName = safeInput.tableName;
  const columns = safeInput.columns;
  const safeColumns = (Array.isArray(columns) ? columns : []).map((column, index) => normalizeColumn(column, index));
  return {
    tableName: asText(tableName) || 'tabelle',
    columns: safeColumns,
    records: [],
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
};

export const addRecordToBlueprint = (blueprint, record = {}) => {
  const safe = blueprint && typeof blueprint === 'object' ? blueprint : createTableBlueprint();
  const normalized = normalizeRecord(record, safe.columns || []);
  return {
    ...safe,
    records: [...(safe.records || []), normalized],
    updatedAt: nowIso()
  };
};

export const validateBlueprint = (blueprint) => {
  if (!blueprint || typeof blueprint !== 'object') {
    return { ok: false, code: 'BLUEPRINT_INVALID', message: 'Baukasten ist kein Objekt.' };
  }
  if (!asText(blueprint.tableName)) {
    return { ok: false, code: 'BLUEPRINT_TABLE_MISSING', message: 'Tabellenname fehlt.' };
  }
  if (!Array.isArray(blueprint.columns)) {
    return { ok: false, code: 'BLUEPRINT_COLUMNS_INVALID', message: 'Spaltenliste fehlt.' };
  }
  return { ok: true, code: 'BLUEPRINT_OK', message: 'Baukasten ist gültig.' };
};
