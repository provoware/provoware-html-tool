const notActive = () => ({
  ok: false,
  code: 'DESKTOP_ADAPTER_NOT_ACTIVE',
  message: 'Desktop-Adapter ist noch nicht aktiv.',
  data: null
});

export const desktopFilesystemAdapter = {
  selectProjectDirectory: async () => notActive(),
  checkPermissions: async () => notActive(),
  getDirectoryInfo: async () => notActive(),
  ensureProjectStructure: async () => notActive(),
  readJson: async () => notActive(),
  writeJson: async () => notActive(),
  fileExists: async () => notActive(),
  createFile: async () => notActive(),
  readText: async () => notActive(),
  writeText: async () => notActive(),
  runProjectSelftest: async () => notActive()
};
