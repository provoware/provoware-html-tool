const DEFAULT_APP_TITLE = 'ProvoWare Dashboard';
const DEFAULT_LAYOUT_MODE = 'standard';
const DEFAULT_PROFILE = 'HardTechno';

export const buildDiagnosisExport = (state = {}) => ({
  exportedAt: new Date().toISOString(),
  app: {
    title: state.uiTexts?.titles?.appTitle || DEFAULT_APP_TITLE,
    layoutMode: state.layoutMode || DEFAULT_LAYOUT_MODE
  },
  directory: {
    selectedName: state.selectedProjectDirectory?.name || null,
    rememberedName: state.rememberedProjectDirectoryName || null,
    permissions: state.permissionStatus || null
  },
  selftest: state.selftestResult || null,
  profile: {
    selected: state.selectedProfile || DEFAULT_PROFILE,
    stats: state.profileStats || null
  },
  logs: (state.logs || []).slice(0, 20)
});
