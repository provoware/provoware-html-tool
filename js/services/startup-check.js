import { filesystemAdapter } from '../adapters/filesystem-adapter.js';

const STARTUP_RESULT_META = Object.freeze({
  STARTUP_DIRECTORY_READ_FAILED: Object.freeze({
    code: 'STARTUP_DIRECTORY_REQUIRED',
    message: 'Bitte zuerst einen Projektordner wählen.'
  }),
  STARTUP_PERMISSION_FAILED: Object.freeze({
    code: 'STARTUP_PERMISSION_FAILED',
    message: 'Rechteprüfung ist fehlgeschlagen.'
  }),
  STARTUP_SELFTEST_FAILED: Object.freeze({
    code: 'STARTUP_SELFTEST_FAILED',
    message: 'Selbsttest ist fehlgeschlagen. Bitte Selbsttest erneut starten.'
  }),
  STARTUP_SELFTEST_INVALID_PAYLOAD: Object.freeze({
    code: 'STARTUP_SELFTEST_INVALID_PAYLOAD',
    message: 'Selbsttest-Antwort ist unvollständig. Bitte Selbsttest erneut starten.'
  }),
  STARTUP_READY: Object.freeze({
    code: 'STARTUP_READY',
    message: 'Grundcheck ist erfolgreich.'
  }),
  STARTUP_BLOCKED: Object.freeze({
    code: 'STARTUP_BLOCKED',
    message: 'Grundcheck ist noch nicht erfolgreich.'
  })
});

const safeCall = async (label, task) => {
  try {
    const result = await task();
    return { ok: true, data: result };
  } catch (error) {
    return {
      ok: false,
      code: `${label}_THREW`,
      message: 'Unerwarteter Laufzeitfehler.',
      data: { error: String(error) }
    };
  }
};

const STARTUP_ACTIONS = Object.freeze({
  SELECT_DIRECTORY: Object.freeze({
    target: 'action-select-dir',
    label: 'Ordner jetzt wählen',
    hint: 'Bitte zuerst den Projektordner wählen. Danach geht es automatisch mit dem nächsten Schritt weiter.'
  }),
  RUN_SELFTEST: Object.freeze({
    target: 'action-run-selftest',
    label: 'Grundcheck jetzt starten',
    hint: 'Bitte den Grundcheck erneut starten. Danach siehst du direkt den nächsten klaren Schritt.'
  }),
  ENSURE_STRUCTURE: Object.freeze({
    target: 'action-ensure-structure',
    label: 'Struktur jetzt anlegen',
    hint: 'Lege die fehlende Struktur jetzt an. Danach erneut den Grundcheck starten.'
  }),
  RUN_WRITE_TEST: Object.freeze({
    target: 'action-run-write-test',
    label: 'Schreibtest als Alternative',
    hint: 'Wenn der Grundcheck blockiert ist, hilft der Schreibtest als schneller Gegencheck.'
  }),
  SWITCH_DIRECTORY: Object.freeze({
    target: 'action-switch-dir',
    label: 'Anderen Ordner wählen',
    hint: 'Wenn Rechte blockieren, teste direkt einen anderen Projektordner.'
  })
});

const withAction = (payload, actionKey, alternativeActionKey = '') => {
  const action = STARTUP_ACTIONS[actionKey] || STARTUP_ACTIONS.RUN_SELFTEST;
  const alternative = STARTUP_ACTIONS[alternativeActionKey] || null;
  return {
    ...payload,
    nextAction: {
      target: action.target,
      label: action.label,
      hint: action.hint
    },
    alternativeAction: alternative
      ? {
        target: alternative.target,
        label: alternative.label,
        hint: alternative.hint
      }
      : null
  };
};

const normalizeProjectStructure = (projectStructure) => {
  if (!projectStructure || typeof projectStructure !== 'object') {
    return {
      projectStructure: { requiredDirectories: [], requiredFiles: [], writeTestRules: {} },
      repaired: true,
      reason: 'Projektstruktur war ungültig und wurde auf sichere Defaults gesetzt.'
    };
  }

  return {
    projectStructure,
    repaired: false,
    reason: ''
  };
};

const buildSelftestRetryData = (permissionData, normalized) => withAction({
  ready: false,
  needsDirectory: false,
  needsSelftest: true,
  permission: permissionData,
  selfRepair: normalized
}, 'RUN_SELFTEST', 'RUN_WRITE_TEST');

const extractSelftestPayload = (selftestData) => {
  if (!selftestData || typeof selftestData !== 'object') {
    return null;
  }

  return selftestData.data && typeof selftestData.data === 'object'
    ? selftestData.data
    : null;
};

const startupMeta = (key) => STARTUP_RESULT_META[key];

export const runStartupCheck = async (projectStructure, options = {}) => {
  const normalized = normalizeProjectStructure(projectStructure);

  const directoryInfo = await safeCall('STARTUP_DIRECTORY', () => filesystemAdapter.getDirectoryInfo());
  if (!directoryInfo.ok) {
    return {
      ok: false,
      code: directoryInfo.code,
      message: 'Ordnerstatus konnte nicht gelesen werden.',
      data: withAction({ ready: false, needsDirectory: true, needsSelftest: true, selfRepair: normalized }, 'SELECT_DIRECTORY')
    };
  }

  if (!directoryInfo.data.ok) {
    const meta = startupMeta('STARTUP_DIRECTORY_READ_FAILED');
    return {
      ok: false,
      code: meta.code,
      message: meta.message,
      data: withAction({ ready: false, needsDirectory: true, needsSelftest: true, selfRepair: normalized }, 'SELECT_DIRECTORY')
    };
  }

  const permission = await safeCall('STARTUP_PERMISSION', () => filesystemAdapter.checkPermissions({ requestWrite: options.requestWrite === true }));
  if (!permission.ok) {
    return {
      ok: false,
      code: permission.code,
      message: 'Rechteprüfung ist unerwartet abgebrochen.',
      data: withAction({ ready: false, needsDirectory: false, needsSelftest: true, selfRepair: normalized }, 'RUN_SELFTEST', 'SWITCH_DIRECTORY')
    };
  }

  if (!permission.data.ok) {
    const meta = startupMeta('STARTUP_PERMISSION_FAILED');
    return {
      ok: false,
      code: meta.code,
      message: meta.message,
      data: withAction({ ready: false, needsDirectory: false, needsSelftest: true, selfRepair: normalized }, 'RUN_SELFTEST', 'SWITCH_DIRECTORY')
    };
  }

  const selftest = await safeCall('STARTUP_SELFTEST', () => filesystemAdapter.runProjectSelftest({ projectStructure: normalized.projectStructure, runWriteTest: false }));
  if (!selftest.ok || !selftest.data || typeof selftest.data !== 'object') {
    const meta = startupMeta('STARTUP_SELFTEST_FAILED');
    return {
      ok: false,
      code: selftest.code || meta.code,
      message: meta.message,
      data: buildSelftestRetryData(permission.data.data, normalized)
    };
  }

  const selftestData = selftest.data;
  const selftestPayload = extractSelftestPayload(selftestData);

  if (!selftestPayload) {
    const meta = startupMeta('STARTUP_SELFTEST_INVALID_PAYLOAD');
    return {
      ok: false,
      code: meta.code,
      message: meta.message,
      data: buildSelftestRetryData(permission.data.data, normalized)
    };
  }

  const ready = selftestData.ok && selftestPayload.overallStatus === 'green';
  const meta = startupMeta(ready ? 'STARTUP_READY' : 'STARTUP_BLOCKED');

  return {
    ok: ready,
    code: meta.code,
    message: meta.message,
    data: withAction({
      ready,
      needsDirectory: false,
      needsSelftest: !ready,
      permission: permission.data.data,
      selftest: selftestPayload,
      selfRepair: normalized
    }, ready ? 'RUN_SELFTEST' : 'ENSURE_STRUCTURE', ready ? '' : 'RUN_WRITE_TEST')
  };
};
