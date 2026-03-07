import { browserFilesystemAdapter } from './browser-filesystem.js';
import { desktopFilesystemAdapter } from './desktop-filesystem.js';

const detectMode = () => ('showDirectoryPicker' in window ? 'browser' : 'desktop');

const activeAdapter = detectMode() === 'browser' ? browserFilesystemAdapter : desktopFilesystemAdapter;

export const filesystemAdapter = {
  mode: detectMode(),
  selectProjectDirectory: (...args) => activeAdapter.selectProjectDirectory(...args),
  checkPermissions: (...args) => activeAdapter.checkPermissions(...args),
  getDirectoryInfo: (...args) => activeAdapter.getDirectoryInfo(...args),
  ensureProjectStructure: (...args) => activeAdapter.ensureProjectStructure(...args),
  readJson: (...args) => activeAdapter.readJson(...args),
  writeJson: (...args) => activeAdapter.writeJson(...args),
  fileExists: (...args) => activeAdapter.fileExists(...args),
  createFile: (...args) => activeAdapter.createFile(...args),
  listDirectory: (...args) => activeAdapter.listDirectory(...args),
  readText: (...args) => activeAdapter.readText(...args),
  writeText: (...args) => activeAdapter.writeText(...args),
  runProjectSelftest: (...args) => activeAdapter.runProjectSelftest(...args)
};
