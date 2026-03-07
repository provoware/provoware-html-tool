import { filesystemAdapter } from '../adapters/filesystem-adapter.js';

export const runStartupCheck = async (projectStructure) => {
  const directoryInfo = await filesystemAdapter.getDirectoryInfo();
  if (!directoryInfo.ok) {
    return {
      ok: false,
      code: 'STARTUP_DIRECTORY_REQUIRED',
      message: 'Bitte zuerst einen Projektordner wählen.',
      data: { ready: false, needsDirectory: true, needsSelftest: true }
    };
  }

  const permission = await filesystemAdapter.checkPermissions();
  if (!permission.ok) {
    return {
      ok: false,
      code: 'STARTUP_PERMISSION_FAILED',
      message: 'Rechteprüfung ist fehlgeschlagen.',
      data: { ready: false, needsDirectory: false, needsSelftest: true }
    };
  }

  const selftest = await filesystemAdapter.runProjectSelftest({ projectStructure, runWriteTest: false });
  const ready = selftest.ok && selftest.data.overallStatus === 'green';

  return {
    ok: ready,
    code: ready ? 'STARTUP_READY' : 'STARTUP_BLOCKED',
    message: ready ? 'Grundcheck ist erfolgreich.' : 'Grundcheck ist noch nicht erfolgreich.',
    data: {
      ready,
      needsDirectory: false,
      needsSelftest: !ready,
      permission: permission.data,
      selftest: selftest.data
    }
  };
};
