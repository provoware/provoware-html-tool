const EVENT = Object.freeze({
  BACKUP_CREATE_STARTED: 'BACKUP_CREATE_STARTED',
  BACKUP_CREATE_FINISHED: 'BACKUP_CREATE_FINISHED',
  BACKUP_IMPORT_STARTED: 'BACKUP_IMPORT_STARTED',
  BACKUP_IMPORT_FINISHED: 'BACKUP_IMPORT_FINISHED',
  BACKUP_IMPORT_FAILED_INVALID_JSON: 'BACKUP_IMPORT_FAILED_INVALID_JSON',
  BACKUP_IMPORT_FAILED_INVALID_SHAPE: 'BACKUP_IMPORT_FAILED_INVALID_SHAPE'
});

const nowIso = () => new Date().toISOString();
const asText = (value) => String(value || '').trim();

const isValidPayload = (payload) => {
  if (!payload || typeof payload !== 'object') return false;
  if (!asText(payload.moduleId)) return false;
  if (!asText(payload.createdAt)) return false;
  if (!Number.isInteger(payload.version) || payload.version < 1) return false;
  if (!payload.data || typeof payload.data !== 'object' || Array.isArray(payload.data)) return false;
  return true;
};

export const createBackupPayload = ({ moduleId, data, version = 1 }) => {
  const id = asText(moduleId) || 'unbekanntes_modul';
  const safeVersion = Number.isInteger(version) && version > 0 ? version : 1;
  return {
    event: EVENT.BACKUP_CREATE_FINISHED,
    payload: {
      moduleId: id,
      createdAt: nowIso(),
      version: safeVersion,
      data: data && typeof data === 'object' ? data : {}
    }
  };
};

export const importBackupPayload = (rawText) => {
  const text = asText(rawText);
  if (!text) {
    return { ok: false, event: EVENT.BACKUP_IMPORT_FAILED_INVALID_JSON, message: 'Kein JSON-Text übergeben.' };
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, event: EVENT.BACKUP_IMPORT_FAILED_INVALID_JSON, message: 'JSON ist ungültig.' };
  }

  if (!isValidPayload(parsed)) {
    return { ok: false, event: EVENT.BACKUP_IMPORT_FAILED_INVALID_SHAPE, message: 'Backup-Form ist ungültig.' };
  }

  return { ok: true, event: EVENT.BACKUP_IMPORT_FINISHED, message: 'Backup wurde geladen.', data: parsed };
};

export const backupEvents = EVENT;
