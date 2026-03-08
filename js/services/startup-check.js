import { filesystemAdapter } from '../adapters/filesystem-adapter.js';

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

export const runStartupCheck = async (projectStructure, options = {}) => {
  const normalized = normalizeProjectStructure(projectStructure);

  const directoryInfo = await safeCall('STARTUP_DIRECTORY', () => filesystemAdapter.getDirectoryInfo());
  if (!directoryInfo.ok) {
    return {
      ok: false,
      code: directoryInfo.code,
      message: 'Ordnerstatus konnte nicht gelesen werden.',
      data: { ready: false, needsDirectory: true, needsSelftest: true, selfRepair: normalized }
    };
  }

  if (!directoryInfo.data.ok) {
    return {
      ok: false,
      code: 'STARTUP_DIRECTORY_REQUIRED',
      message: 'Bitte zuerst einen Projektordner wählen.',
      data: { ready: false, needsDirectory: true, needsSelftest: true, selfRepair: normalized }
    };
  }

  const permission = await safeCall('STARTUP_PERMISSION', () => filesystemAdapter.checkPermissions({ requestWrite: options.requestWrite === true }));
  if (!permission.ok) {
    return {
      ok: false,
      code: permission.code,
      message: 'Rechteprüfung ist unerwartet abgebrochen.',
      data: { ready: false, needsDirectory: false, needsSelftest: true, selfRepair: normalized }
    };
  }

  if (!permission.data.ok) {
    return {
      ok: false,
      code: 'STARTUP_PERMISSION_FAILED',
      message: 'Rechteprüfung ist fehlgeschlagen.',
      data: { ready: false, needsDirectory: false, needsSelftest: true, selfRepair: normalized }
    };
  }

  const selftest = await safeCall('STARTUP_SELFTEST', () => filesystemAdapter.runProjectSelftest({ projectStructure: normalized.projectStructure, runWriteTest: false }));
  if (!selftest.ok || !selftest.data || typeof selftest.data !== 'object') {
    return {
      ok: false,
      code: selftest.code || 'STARTUP_SELFTEST_FAILED',
      message: 'Selbsttest ist fehlgeschlagen. Bitte Selbsttest erneut starten.',
      data: {
        ready: false,
        needsDirectory: false,
        needsSelftest: true,
        permission: permission.data.data,
        selfRepair: normalized
      }
    };
  }

  const selftestData = selftest.data;
  const selftestPayload = selftestData && typeof selftestData.data === 'object' && selftestData.data
    ? selftestData.data
    : null;

  if (!selftestPayload) {
    return {
      ok: false,
      code: 'STARTUP_SELFTEST_INVALID_PAYLOAD',
      message: 'Selbsttest-Antwort ist unvollständig. Bitte Selbsttest erneut starten.',
      data: {
        ready: false,
        needsDirectory: false,
        needsSelftest: true,
        permission: permission.data.data,
        selfRepair: normalized
      }
    };
  }

  const ready = selftestData.ok && selftestPayload.overallStatus === 'green';

  return {
    ok: ready,
    code: ready ? 'STARTUP_READY' : 'STARTUP_BLOCKED',
    message: ready ? 'Grundcheck ist erfolgreich.' : 'Grundcheck ist noch nicht erfolgreich.',
    data: {
      ready,
      needsDirectory: false,
      needsSelftest: !ready,
      permission: permission.data.data,
      selftest: selftestPayload,
      selfRepair: normalized
    }
  };
};
