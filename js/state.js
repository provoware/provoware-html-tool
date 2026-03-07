const createState = () => ({
  config: null,
  themes: null,
  uiTexts: null,
  projectStructure: null,
  selectedProjectDirectory: null,
  rememberedProjectDirectoryName: null,
  permissionStatus: { read: false, write: false, class: 'unknown' },
  selftestResult: null,
  layoutMode: 'standard',
  logs: [],
  profileArchive: null,
  selectedProfile: 'HardTechno',
  archiveSortMode: 'alpha',
  randomMix: null,
  debug: { startupReady: false }
});

const listeners = new Set();
const state = createState();

const notify = () => listeners.forEach((listener) => listener(getState()));

export const getState = () => structuredClone(state);

export const setState = (patch) => {
  Object.assign(state, patch);
  notify();
};

export const appendLog = (entry) => {
  state.logs = [entry, ...state.logs].slice(0, 30);
  notify();
};

export const subscribeState = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
