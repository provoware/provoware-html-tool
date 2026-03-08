import { safeArray, safeObject, safeText, userProblemNextStep } from '../../js/services/module-boundary-utils.js';

const asText = (value) => safeText(value);
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
  const safeInput = safeObject(input);
  const tableName = safeInput.tableName;
  const columns = safeInput.columns;
  const safeColumns = safeArray(columns).map((column, index) => normalizeColumn(column, index));
  return {
    tableName: asText(tableName) || 'tabelle',
    columns: safeColumns,
    records: [],
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
};

export const addRecordToBlueprint = (blueprint, record = {}) => {
  const safe = safeObject(blueprint, createTableBlueprint());
  const normalized = normalizeRecord(record, safe.columns || []);
  return {
    ...safe,
    records: [...(safe.records || []), normalized],
    updatedAt: nowIso()
  };
};

export const validateBlueprint = (blueprint) => {
  if (!blueprint || typeof blueprint !== 'object') {
    return {
      ok: false,
      code: 'BLUEPRINT_INVALID',
      message: userProblemNextStep('Baukasten ist kein Objekt.', 'Bitte Baukasten neu laden oder ein neues Objekt starten.')
    };
  }
  if (!asText(blueprint.tableName)) {
    return {
      ok: false,
      code: 'BLUEPRINT_TABLE_MISSING',
      message: userProblemNextStep('Tabellenname fehlt.', 'Bitte einen kurzen Tabellennamen eingeben.')
    };
  }
  if (!Array.isArray(blueprint.columns)) {
    return {
      ok: false,
      code: 'BLUEPRINT_COLUMNS_INVALID',
      message: userProblemNextStep('Spaltenliste fehlt.', 'Bitte mindestens eine Spalte anlegen.')
    };
  }
  return { ok: true, code: 'BLUEPRINT_OK', message: 'Baukasten ist gültig.' };
};
