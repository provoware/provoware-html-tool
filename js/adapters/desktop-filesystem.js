const notActive = () => ({
  ok: false,
  code: 'DESKTOP_ADAPTER_NOT_ACTIVE',
  message: 'Desktop-Adapter ist noch nicht aktiv. Bitte Browser-Modus mit Ordnerwahl nutzen oder Desktop-Integration ergänzen.',
  data: { nextStep: 'Nutze zuerst die Browser-Version mit "Ordner wählen".' }
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
  listDirectory: async () => notActive(),
  readText: async () => notActive(),
  writeText: async () => notActive(),
  runProjectSelftest: async (_options) => notActive()
};
