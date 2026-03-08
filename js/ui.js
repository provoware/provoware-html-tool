import { categories } from './services/profile-archive.js';
import { getState } from './state.js';
import { formatStatusWithSymbol } from './status-visuals.js';
import { initGuideToolsModule } from './modules/guide-tools-module.js';
import { initDashboardClock } from './modules/dashboard-clock.js';
import { getPluginCatalog } from './modules/plugin-manager.js';
import { escapeHtml } from './services/html-escape.js';
import { renderHeaderSection } from './renderers/ui-header-renderer.js';
import { renderMainSection } from './renderers/ui-main-renderer.js';

const byId = (id) => document.getElementById(id);
let lastA11yAnnouncement = '';
const defaultTodos = Object.freeze(['Erste Aufgabe prüfen']);
const TODO_STORAGE_KEY = 'provoware:todo-start-items';
const FONT_SCALE_STORAGE_KEY = 'provoware:font-scale';
const PANEL_PROPORTION_STORAGE_KEY = 'provoware:panel-proportion-preset';
const PANEL_PROPORTION_PRESETS = Object.freeze({
  balanced: { navMin: '220px', navMax: '320px', mainMin: '620px', widgetsMin: '260px', widgetsMax: '360px' },
  'focus-main': { navMin: '190px', navMax: '250px', mainMin: '760px', widgetsMin: '220px', widgetsMax: '290px' },
  'focus-sidebars': { navMin: '260px', navMax: '340px', mainMin: '520px', widgetsMin: '300px', widgetsMax: '380px' }
});
const HEADER_PROJECT_STATUS_TEXT = Object.freeze({
  waiting: 'Wartet',
  working: 'In Arbeit',
  ready: 'Bereit'
});

const normalizeWhitespace = (value) => String(value || '').replace(/\s+/g, ' ').trim();

const ensureTerminalPunctuation = (value) => {
  if (!value) return '';
  if (/[.!?…]$/.test(value)) return value;
  return `${value}.`;
};

const autoFormatText = (value) => {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return '';
  const withSpaces = normalized.replace(/[_-]+/g, ' ');
  const capitalized = withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
  return ensureTerminalPunctuation(capitalized);
};

const autoFormatHtml = (value) => escapeHtml(autoFormatText(value));

const formatStatusWord = (value) => {
  const normalized = normalizeWhitespace(value);
  return normalized ? normalized.toLowerCase() : '-';
};

const formatDateTime = (value) => {
  const text = String(value || '').trim();
  if (!text) return '-';
  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return '-';
  return parsed.toLocaleString('de-DE');
};

const setText = (id, text) => {
  const node = byId(id);
  if (node) node.textContent = text;
};

const formatOverallStatus = (status) => {
  return formatStatusWithSymbol(status);
};

const formatPermissionStatus = (allowed) => {
  if (typeof allowed !== 'boolean') return '-';
  return formatStatusWithSymbol(allowed ? 'green' : 'red', formatStatusWord(allowed ? 'ok' : 'nein'));
};

const formatWritePermissionStatus = (permissionStatus) => {
  const canRead = permissionStatus?.read;
  const canWrite = permissionStatus?.write;
  if (canRead === true && canWrite === false) {
    return formatStatusWithSymbol('yellow', formatStatusWord('nur lesen'));
  }
  return formatPermissionStatus(canWrite);
};

const fileNameFromPath = (path) => {
  const normalized = String(path || '').trim().replaceAll('\\', '/');
  if (!normalized) return '';
  return normalized.split('/').filter(Boolean).pop() || '';
};

const formatStructureStatus = (selftestResult) => {
  if (!selftestResult) return '-';
  const hasMissingFiles = Boolean(selftestResult.data?.missingFiles?.length);
  return hasMissingFiles
    ? formatStatusWithSymbol('yellow', formatStatusWord('fehlt teilweise'))
    : formatStatusWithSymbol('green', formatStatusWord('ok'));
};

const buildA11yStatusText = (state, messages = {}) => {
  const startupReady = state.debug?.startupReady;
  const startupMessage = startupReady ? messages.startupReady || '' : messages.startupWaiting || messages.startupBlocked || '';
  const overall = formatOverallStatus(state.selftestResult?.overallStatus || 'red');
  if (state.a11yQuietMode) {
    return [
      `Start: ${autoFormatText(startupMessage) || '-'}`,
      `Gesamtstatus: ${overall}`,
      'Ruhiger Modus aktiv.'
    ].join(' ');
  }
  const latestLog = state.logs?.[0]?.message ? autoFormatText(state.logs[0].message) : 'Keine neue Meldung.';
  return [
    `Start: ${autoFormatText(startupMessage) || '-'}`,
    `Gesamtstatus: ${overall}`,
    `Letzte Meldung: ${latestLog}`
  ].join(' ');
};

const renderProfileOptions = (archive, selected) => {
  const options = Object.keys(archive?.profiles || {});
  return options
    .map((name) => {
      const escapedName = escapeHtml(name);
      return `<option value="${escapedName}" ${name === selected ? 'selected' : ''}>${escapedName}</option>`;
    })
    .join('');
};

const renderCategoryList = (archive, profile, category) => {
  const list = archive?.profiles?.[profile]?.[category] || [];
  return list
    .map((item) => {
      const escapedValue = escapeHtml(item.value);
      const escapedCategory = escapeHtml(category);
      return `<li><span>${escapedValue}</span><div><button class="btn-small" data-edit="${escapedCategory}" data-value="${escapedValue}">Bearbeiten</button><button class="btn-small" data-delete="${escapedCategory}" data-value="${escapedValue}">Löschen</button></div></li>`;
    })
    .join('');
};

const renderStats = (stats) => {
  if (!stats) return '-';
  return `Genres: ${stats.genres} | Stimmungen: ${stats.moods} | Stile: ${stats.styles} | Gesamt: ${stats.total}`;
};


const buildStartupSteps = (state) => {
  const hasDirectory = Boolean(state.selectedProjectDirectory);
  const canRead = state.permissionStatus?.read === true;
  const startupReady = state.debug?.startupReady === true;
  const steps = [
    {
      label: 'Schritt 1/4: Projektordner wählen',
      done: hasDirectory,
      assistantTitle: 'Schritt 1: Projektordner wählen',
      assistantText: 'Öffne zuerst deinen Projektordner. Danach kann das Tool Rechte und Struktur prüfen.',
      actionTarget: 'action-select-dir',
      actionLabel: 'Ordner jetzt wählen'
    },
    {
      label: 'Schritt 2/4: Rechte prüfen',
      done: hasDirectory && canRead,
      assistantTitle: 'Schritt 2: Rechte prüfen',
      assistantText: 'Prüfe die Leserechte. So siehst du sofort, ob der Ordner sauber erreichbar ist.',
      actionTarget: 'action-run-selftest',
      actionLabel: 'Rechte jetzt prüfen'
    },
    {
      label: 'Schritt 3/4: Grundcheck ausführen',
      done: hasDirectory && Boolean(state.selftestResult),
      assistantTitle: 'Schritt 3: Grundcheck ausführen',
      assistantText: 'Starte den Kurzcheck. Das Ergebnis zeigt dir direkt, ob wichtige Basisdateien stimmen.',
      actionTarget: 'action-run-selftest',
      actionLabel: 'Grundcheck starten'
    },
    {
      label: 'Schritt 4/4: Module starten',
      done: startupReady,
      assistantTitle: 'Schritt 4: Module starten',
      assistantText: 'Wenn die Ampel ok ist, kannst du direkt mit den Modulen arbeiten.',
      actionTarget: 'action-ensure-structure',
      actionLabel: 'Struktur falls nötig anlegen'
    }
  ];
  const currentIndex = steps.findIndex((step) => !step.done);
  return { steps, currentIndex: currentIndex === -1 ? steps.length - 1 : currentIndex };
};

const buildDashboardInfo = (state) => {
  const overall = formatOverallStatus(state.selftestResult?.overallStatus || 'red');
  const moduleSummary = state.moduleRegistry?.summary || '-';
  const archiveStats = renderStats(state.profileStats);
  return `Ampel: ${overall} | Module: ${moduleSummary} | Archiv: ${archiveStats}`;
};

const buildHeaderProjectStatus = (state) => {
  if (state.debug?.startupReady === true) return HEADER_PROJECT_STATUS_TEXT.ready;
  if (state.selftestResult?.overallStatus) return formatOverallStatus(state.selftestResult.overallStatus);
  if (state.selectedProjectDirectory) return HEADER_PROJECT_STATUS_TEXT.working;
  return HEADER_PROJECT_STATUS_TEXT.waiting;
};

const buildHeaderAutosaveStatus = (state) => {
  if (!state.editorFilePath) return 'Bereit';
  return state.editorDirty ? 'Offen' : 'Gesichert';
};

const readStoredTodos = () => {
  try {
    const raw = window.localStorage.getItem(TODO_STORAGE_KEY);
    const parsed = JSON.parse(raw || '[]');
    if (!Array.isArray(parsed)) return [...defaultTodos];
    const todos = parsed
      .map((entry) => normalizeWhitespace(entry))
      .filter(Boolean)
      .slice(0, 30);
    return todos.length ? todos : [...defaultTodos];
  } catch {
    return [...defaultTodos];
  }
};

const writeStoredTodos = (todos) => {
  try {
    window.localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // Optional: Speichern kann je nach Browser-Einstellung blockiert sein.
  }
};

const renderTemplateList = (items = []) => {
  if (!items.length) return '<li>-</li>';
  return items
    .map((item) => {
      const escapedId = escapeHtml(item.id);
      return `<li><div><strong>${escapeHtml(item.title)}</strong><br><small>${escapeHtml(item.category)}</small></div><div><button class="btn-small" data-template-copy="${escapedId}">Kopieren</button><button class="btn-small" data-template-edit="${escapedId}">Bearbeiten</button><button class="btn-small" data-template-favorite="${escapedId}">${item.favorite ? '★' : '☆'}</button><button class="btn-small" data-template-delete="${escapedId}">Löschen</button></div></li>`;
    })
    .join('');
};

const renderTemplateQuickButtons = (items = []) => {
  const favorites = items.filter((item) => item.favorite).slice(0, 8);
  if (!favorites.length) return '<p class="sidebar-empty">Noch keine Favoriten.</p>';
  return favorites.map((item) => `<button type="button" class="btn-small" data-template-copy="${escapeHtml(item.id)}">${escapeHtml(item.title)}</button>`).join('');
};

const renderFilePreviewList = (entries = []) => {
  if (!entries.length) return '<li>-</li>';
  return entries
    .map((entry) => `<li><button type="button" class="btn-small" data-preview-open="${escapeHtml(entry.path)}">${escapeHtml(entry.name)}</button></li>`)
    .join('');
};

const renderSidebarModules = (modules = []) => {
  if (!modules.length) {
    return '<p class="sidebar-empty">Noch keine aktiven Module gefunden.</p>';
  }

  return modules
    .map((module) => {
      const status = module.ok ? 'ok' : 'prüfen';
      const label = autoFormatText(module.name || module.id || 'Modul').replace(/[.!?…]+$/, '');
      const moduleId = escapeHtml(module.id || '');
      return `<button type="button" class="btn module-btn" data-module-focus="${moduleId}" title="${escapeHtml(label)}"><span>${escapeHtml(label)}</span><small>${escapeHtml(status)}</small></button>`;
    })
    .join('');
};

const renderPluginOptions = (selectedPluginId) => {
  return getPluginCatalog()
    .map((plugin) => `<option value="${escapeHtml(plugin.id)}" ${plugin.id === selectedPluginId ? 'selected' : ''}>${escapeHtml(plugin.name)}</option>`)
    .join('');
};

const pluginEnabled = (state, pluginId) => state.pluginManager?.plugins?.[pluginId]?.enabled !== false;

export const applyTheme = (themeTokens = {}) => {
  const map = {
    bg: '--bg',
    bgPanel: '--bg-panel',
    bgPanelSoft: '--bg-panel-soft',
    header: '--header',
    textMain: '--text-main',
    textMuted: '--text-muted',
    shadow: '--shadow',
    radius: '--radius',
    gridLine: '--grid-line',
    focus: '--focus',
    accent: '--accent',
    accentStrong: '--accent-strong',
    bodyGradientStart: '--body-gradient-start',
    bodyGradientMid: '--body-gradient-mid',
    bodyGradientEnd: '--body-gradient-end',
    panelBorder: '--panel-border',
    panelOverlay: '--panel-overlay'
  };
  Object.entries(map).forEach(([token, cssVar]) => {
    if (themeTokens[token]) document.documentElement.style.setProperty(cssVar, themeTokens[token]);
  });
};

const readStoredFontScale = () => {
  try {
    const raw = Number(window.localStorage.getItem(FONT_SCALE_STORAGE_KEY));
    if (!Number.isFinite(raw)) return 1;
    return Math.min(1.35, Math.max(0.85, raw));
  } catch {
    return 1;
  }
};

const writeStoredFontScale = (scale) => {
  try {
    window.localStorage.setItem(FONT_SCALE_STORAGE_KEY, String(scale));
  } catch {
    // Speicher kann blockiert sein.
  }
};

export const detectLayoutMode = (config) => {
  const width = window.innerWidth;
  if (width >= (config.minimumSizes?.wide?.minWidth || 1400)) return 'wide';
  if (width >= (config.minimumSizes?.standard?.minWidth || 1100)) return 'standard';
  if (width >= (config.minimumSizes?.kompakt?.minWidth || 900)) return 'kompakt';
  return 'eng';
};

const bindWorkspaceControls = () => {
  const app = byId('app');
  if (!app || app.dataset.workspaceControlsBound === 'yes') return;
  app.dataset.workspaceControlsBound = 'yes';
  let fontScale = readStoredFontScale();

  const applyFontScale = (nextScale) => {
    const rounded = Number(nextScale.toFixed(2));
    fontScale = Math.min(1.35, Math.max(0.85, rounded));
    document.documentElement.style.setProperty('--font-scale', String(fontScale));
    const zoomStatus = byId('zoom-status');
    if (zoomStatus) zoomStatus.textContent = `Schriftgröße: ${Math.round(fontScale * 100)}%`;
    writeStoredFontScale(fontScale);
  };

  applyFontScale(fontScale);

  const setSidebarState = (id, cssClass) => {
    const button = byId(id);
    if (!button) return;
    button.addEventListener('click', () => {
      app.classList.toggle(cssClass);
      const isCollapsed = app.classList.contains(cssClass);
      button.setAttribute('aria-pressed', isCollapsed ? 'true' : 'false');
    });
  };

  setSidebarState('toggle-left-sidebar', 'sidebar-left-collapsed');
  setSidebarState('toggle-right-sidebar', 'sidebar-right-collapsed');

  const main = byId('main-content');
  const hiddenPanelsBar = document.createElement('section');
  hiddenPanelsBar.id = 'hidden-panels-bar';
  hiddenPanelsBar.className = 'hidden-panels-bar';
  hiddenPanelsBar.setAttribute('aria-label', 'Ausgeblendete Module');
  const moduleFocusFeedback = document.createElement('p');
  moduleFocusFeedback.id = 'module-focus-feedback';
  moduleFocusFeedback.className = 'module-focus-feedback';
  moduleFocusFeedback.setAttribute('aria-live', 'polite');
  const setModuleFocusFeedback = (text) => {
    moduleFocusFeedback.textContent = text;
  };
  const dashboard = document.querySelector('.workspace-dashboard');
  if (main && dashboard) {
    main.insertBefore(hiddenPanelsBar, dashboard.nextSibling);
    main.insertBefore(moduleFocusFeedback, hiddenPanelsBar.nextSibling);
  }

  const renderHiddenPanelsBar = () => {
    if (!hiddenPanelsBar) return;
    const hiddenPanels = [...document.querySelectorAll('.module-panel.is-hidden')];
    if (!hiddenPanels.length) {
      hiddenPanelsBar.innerHTML = '';
      hiddenPanelsBar.classList.remove('is-visible');
      return;
    }
    hiddenPanelsBar.classList.add('is-visible');
    hiddenPanelsBar.innerHTML = [
      '<strong>Ausgeblendet:</strong>',
      ...hiddenPanels.map((panel) => {
        const title = panel.querySelector('h3')?.textContent?.trim() || 'Modul';
        return `<button type="button" class="btn-small" data-panel-show="${escapeHtml(panel.dataset.panel || '')}">${escapeHtml(title)} einblenden</button>`;
      })
    ].join(' ');
  };

  document.querySelectorAll('.module-panel').forEach((panel) => {
    const controls = panel.querySelector('.module-controls');
    if (!controls) return;
    controls.innerHTML = [
      '<button type="button" class="panel-control" data-panel-hide title="Ausblenden">◫</button>',
      '<button type="button" class="panel-control" data-panel-minimize title="Minimieren">—</button>',
      '<button type="button" class="panel-control" data-panel-maximize title="Maximieren">⛶</button>',
      '<button type="button" class="panel-control" data-panel-restore title="Maximierung aufheben">🗗</button>'
    ].join('');
  });

  document.querySelectorAll('[data-panel-maximize]').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = button.closest('.module-panel');
      if (!panel) return;
      const willMaximize = !panel.classList.contains('is-maximized');
      document.querySelectorAll('.module-panel.is-maximized').forEach((entry) => entry.classList.remove('is-maximized'));
      if (willMaximize) {
        panel.classList.add('is-maximized');
        setModuleFocusFeedback('Modul ist maximiert. Mit „Maximierung aufheben“ kommst du zurück ins 3x3-Grid.');
      }
      app.classList.toggle('has-maximized-panel', willMaximize);
      if (!willMaximize) {
        setModuleFocusFeedback('Maximierung beendet. Alle Module sind wieder im 3x3-Grid sichtbar.');
      }
    });
  });

  document.querySelectorAll('[data-panel-restore]').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = button.closest('.module-panel');
      if (!panel || !panel.classList.contains('is-maximized')) return;
      panel.classList.remove('is-maximized');
      app.classList.remove('has-maximized-panel');
      setModuleFocusFeedback('Maximierung beendet. Alle Module sind wieder im 3x3-Grid sichtbar.');
    });
  });

  document.querySelectorAll('[data-panel-minimize]').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = button.closest('.module-panel');
      if (!panel) return;
      panel.classList.toggle('is-minimized');
    });
  });

  document.querySelectorAll('[data-panel-hide]').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = button.closest('.module-panel');
      if (!panel) return;
      panel.classList.toggle('is-hidden');
      if (panel.classList.contains('is-hidden')) panel.classList.remove('is-maximized');
      app.classList.toggle('has-maximized-panel', Boolean(document.querySelector('.module-panel.is-maximized')));
      renderHiddenPanelsBar();
    });
  });

  hiddenPanelsBar.addEventListener('click', (event) => {
    const panelId = event.target.getAttribute('data-panel-show');
    if (!panelId) return;
    const panel = document.querySelector(`.module-panel[data-panel="${panelId}"]`);
    if (!panel) return;
    panel.classList.remove('is-hidden');
    renderHiddenPanelsBar();
  });

  const sidebarModuleList = byId('sidebar-module-list');
  sidebarModuleList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-module-focus]');
    if (!button) return;
    const moduleId = button.getAttribute('data-module-focus');
    const moduleLabel = button.querySelector('span')?.textContent?.trim() || 'Modul';
    if (!moduleId) {
      setModuleFocusFeedback(`Hinweis: ${moduleLabel} konnte nicht geöffnet werden. Bitte Modulzuordnung prüfen.`);
      return;
    }
    const panel = document.querySelector(`.module-panel[data-module-id="${moduleId}"]`);
    if (!panel) {
      setModuleFocusFeedback(`Hinweis: Für ${moduleLabel} gibt es noch kein sichtbares Modul im Mittelbereich.`);
      return;
    }
    panel.classList.remove('is-hidden');
    panel.classList.remove('is-minimized');
    renderHiddenPanelsBar();
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    document.querySelectorAll('.module-panel.is-maximized').forEach((entry) => entry.classList.remove('is-maximized'));
    panel.classList.add('is-maximized');
    app.classList.add('has-maximized-panel');
    setModuleFocusFeedback(`${moduleLabel} ist jetzt geöffnet und maximiert.`);
  });

  const todoList = byId('todo-list');
  const todoInput = byId('todo-input');
  const todoAdd = byId('todo-add');
  const todos = readStoredTodos();

  const renderTodos = () => {
    if (!todoList) return;
    todoList.innerHTML = todos.map((todo, index) => (
      `<li><span>${escapeHtml(todo)}</span><button type="button" class="btn-small" data-todo-delete="${index}">Erledigt</button></li>`
    )).join('');
    writeStoredTodos(todos);
  };

  renderTodos();

  todoAdd?.addEventListener('click', () => {
    const value = normalizeWhitespace(todoInput?.value || '');
    if (!value) return;
    todos.push(value.slice(0, 120));
    if (todoInput) todoInput.value = '';
    renderTodos();
  });

  todoList?.addEventListener('click', (event) => {
    const index = Number(event.target.getAttribute('data-todo-delete'));
    if (!Number.isInteger(index) || index < 0 || index >= todos.length) return;
    todos.splice(index, 1);
    renderTodos();
  });

  window.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === '0') {
      event.preventDefault();
      applyFontScale(1);
      return;
    }
    if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '=')) {
      event.preventDefault();
      applyFontScale(fontScale + 0.05);
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key === '-') {
      event.preventDefault();
      applyFontScale(fontScale - 0.05);
      return;
    }
    if (event.key !== 'Escape') return;
    document.querySelectorAll('.module-panel.is-maximized').forEach((entry) => entry.classList.remove('is-maximized'));
    app.classList.remove('has-maximized-panel');
    setModuleFocusFeedback('Maximierung beendet. Alle Module sind wieder im 3x3-Grid sichtbar.');
  });

  let lastWheelZoomAt = 0;
  const handleZoomWheel = (event) => {
    if (!(event.ctrlKey || event.metaKey)) return;
    const now = Date.now();
    if (now - lastWheelZoomAt < 28) {
      event.preventDefault();
      return;
    }
    lastWheelZoomAt = now;
    event.preventDefault();
    const step = event.deltaY > 0 ? -0.05 : 0.05;
    applyFontScale(fontScale + step);
  };

  window.addEventListener('wheel', handleZoomWheel, { passive: false });
  document.addEventListener('wheel', handleZoomWheel, { passive: false, capture: true });
};

export const bindUiActions = (actions) => {
  byId('action-select-dir')?.addEventListener('click', actions.onSelectDirectory);
  byId('action-run-selftest')?.addEventListener('click', () => actions.onRunSelftest(false));
  byId('action-ensure-structure')?.addEventListener('click', actions.onEnsureStructure);
  byId('action-run-write-test')?.addEventListener('click', () => actions.onRunSelftest(true));
  byId('action-switch-dir')?.addEventListener('click', actions.onSwitchDirectory);
  byId('action-export-diagnosis')?.addEventListener('click', async () => {
    const text = await actions.onExportDiagnosis();
    const area = byId('diagnosis-transfer');
    if (area) area.value = text;
  });
  byId('action-logout')?.addEventListener('click', async () => {
    await actions.onLogoutWithAutosave();
  });
  byId('action-toggle-tools')?.addEventListener('click', () => {
    const widgets = byId('widgets-panel');
    const toggleButton = byId('action-toggle-tools');
    if (!widgets || !toggleButton) return;
    const expanded = widgets.classList.toggle('tools-expanded');
    toggleButton.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    toggleButton.textContent = expanded
      ? (getState().uiTexts?.buttons?.showLessTools || 'Weniger Tools')
      : (getState().uiTexts?.buttons?.showMoreTools || 'Mehr Tools');
  });
  byId('a11y-quiet-mode')?.addEventListener('change', (event) => {
    actions.onToggleA11yQuietMode(event.target.checked);
  });
  byId('toggle-grid-help')?.addEventListener('change', (event) => {
    actions.onToggleGridHelp(event.target.checked);
  });
  byId('theme-select')?.addEventListener('change', (event) => {
    actions.onChangeTheme(event.target.value);
  });
  byId('plugin-select')?.addEventListener('change', (event) => {
    actions.onSelectPlugin(event.target.value);
  });
  byId('plugin-toggle')?.addEventListener('click', () => {
    actions.onTogglePluginEnabled();
  });
  byId('startup-assistant-action')?.addEventListener('click', () => {
    const targetId = byId('startup-assistant-action')?.dataset.assistantTarget;
    if (!targetId) return;
    byId(targetId)?.click();
  });
  byId('module-registry-open-next-step')?.addEventListener('click', async () => {
    const filePath = byId('module-registry-open-next-step')?.dataset.filePath || '';
    if (!filePath || typeof actions.onOpenModuleRegistryNextStepFile !== 'function') return;
    await actions.onOpenModuleRegistryNextStepFile(filePath);
  });
  byId('module-registry-create-next-step')?.addEventListener('click', async () => {
    const filePath = byId('module-registry-create-next-step')?.dataset.filePath || '';
    if (!filePath || typeof actions.onCreateModuleRegistryNextStepFile !== 'function') return;
    await actions.onCreateModuleRegistryNextStepFile(filePath);
  });
  byId('module-registry-apply-template')?.addEventListener('click', async () => {
    const filePath = byId('module-registry-apply-template')?.dataset.filePath || '';
    const templateId = byId('module-registry-template-select')?.value || '';
    if (!filePath || !templateId || typeof actions.onApplyModuleRegistryTemplate !== 'function') return;
    await actions.onApplyModuleRegistryTemplate({ path: filePath, templateId });
  });
  byId('panel-proportion-select')?.addEventListener('change', (event) => {
    const selected = applyPanelProportionPreset(event.target.value || 'balanced');
    if (typeof actions.onSetPanelProportionPreset === 'function') actions.onSetPanelProportionPreset(selected);
  });
  document.addEventListener('input', (event) => {
    if (event?.target?.type === 'checkbox') return;
    render();
  });

  byId('profile-select')?.addEventListener('change', (event) => actions.onSelectProfile(event.target.value));
  byId('archive-sort')?.addEventListener('change', (event) => actions.onSortArchive(event.target.value));

  categories.forEach((category) => {
    byId(`save-${category}`)?.addEventListener('click', () => {
      const input = byId(`input-${category}`);
      actions.onSaveCategoryEntry({ category, value: input?.value || '' });
      if (input) input.value = '';
    });
    byId(`input-${category}`)?.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      const input = event.currentTarget;
      actions.onSaveCategoryEntry({ category, value: input.value || '' });
      input.value = '';
    });
  });

  [0, 1, 2].forEach((rowIndex) => {
    byId(`dashboard-note-title-${rowIndex}`)?.addEventListener('input', (event) => {
      actions.onDashboardNoteChangeTitle({ rowIndex, title: event.target.value || '' });
    });

    byId(`dashboard-note-input-${rowIndex}`)?.addEventListener('input', (event) => {
      actions.onDashboardNoteChangeInput({ rowIndex, value: event.target.value || '' });
    });

    byId(`dashboard-note-save-${rowIndex}`)?.addEventListener('click', async () => {
      await actions.onDashboardNoteSave({
        rowIndex,
        title: byId(`dashboard-note-title-${rowIndex}`)?.value || '',
        value: byId(`dashboard-note-input-${rowIndex}`)?.value || ''
      });
    });

    byId(`dashboard-note-open-${rowIndex}`)?.addEventListener('click', async () => {
      await actions.onOpenDashboardNoteLastFileInEditor(rowIndex);
    });

    byId(`dashboard-note-input-${rowIndex}`)?.addEventListener('keydown', async (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      await actions.onDashboardNoteSave({
        rowIndex,
        title: byId(`dashboard-note-title-${rowIndex}`)?.value || '',
        value: event.currentTarget?.value || ''
      });
    });
  });

  byId('archive-list')?.addEventListener('click', async (event) => {
    const editCategory = event.target.getAttribute('data-edit');
    const deleteCategory = event.target.getAttribute('data-delete');
    const value = event.target.getAttribute('data-value');
    if (editCategory && value) {
      const next = window.prompt('Neuer Text', value);
      if (next !== null) {
        await actions.onEditCategoryEntry({ category: editCategory, oldValue: value, newValue: next });
      }
    }
    if (deleteCategory && value) {
      await actions.onDeleteCategoryEntry({ category: deleteCategory, value });
    }
  });

  byId('archive-export')?.addEventListener('click', async () => {
    const text = await actions.onExportArchive();
    const area = byId('archive-transfer');
    if (area) area.value = text;
  });

  byId('archive-import')?.addEventListener('click', async () => {
    const area = byId('archive-transfer');
    await actions.onImportArchive(area?.value || '');
  });

  byId('mix-generate')?.addEventListener('click', async () => {
    const includeCategories = categories.filter((category) => byId(`mix-include-${category}`)?.checked);
    const amountPerCategory = Object.fromEntries(categories.map((category) => [category, Number(byId(`mix-amount-${category}`)?.value || 1)]));
    await actions.onGenerateMix({ includeCategories, amountPerCategory });
  });

  document.querySelectorAll('[data-mix-quick]').forEach((button) => {
    button.addEventListener('click', async () => {
      const amount = Number(button.getAttribute('data-mix-quick'));
      categories.forEach((category) => {
        const input = byId(`mix-amount-${category}`);
        if (input) input.value = String(amount);
      });
      const includeCategories = categories.filter((category) => byId(`mix-include-${category}`)?.checked);
      const amountPerCategory = Object.fromEntries(categories.map((category) => [category, amount]));
      await actions.onGenerateMix({ includeCategories, amountPerCategory });
    });
  });

  byId('template-save')?.addEventListener('click', () => {
    actions.onTemplateSave({
      id: byId('template-id')?.value || null,
      title: byId('template-title')?.value || '',
      category: byId('template-category')?.value || 'Textbaustein',
      content: byId('template-content')?.value || ''
    });
  });

  byId('template-clear')?.addEventListener('click', () => actions.onTemplateResetDraft());

  byId('template-list')?.addEventListener('click', async (event) => {
    const id = event.target.getAttribute('data-template-edit');
    if (id) {
      actions.onTemplateStartEdit(id);
      return;
    }
    const copyId = event.target.getAttribute('data-template-copy');
    if (copyId) {
      await actions.onTemplateCopy(copyId);
      return;
    }
    const favoriteId = event.target.getAttribute('data-template-favorite');
    if (favoriteId) {
      await actions.onTemplateToggleFavorite(favoriteId);
      return;
    }
    const deleteId = event.target.getAttribute('data-template-delete');
    if (deleteId) {
      await actions.onTemplateDelete(deleteId);
    }
  });

  byId('template-favorites')?.addEventListener('click', async (event) => {
    const id = event.target.getAttribute('data-template-copy');
    if (!id) return;
    await actions.onTemplateCopy(id);
  });

  byId('file-preview-path')?.addEventListener('change', (event) => {
    actions.onSetFilePreviewPath(event.target.value || '');
  });

  byId('file-preview-include-other')?.addEventListener('change', async (event) => {
    actions.onToggleFilePreviewIncludeOther(event.target.checked);
    await actions.onLoadFilePreviewList();
  });

  byId('file-preview-load')?.addEventListener('click', async () => {
    actions.onSetFilePreviewPath(byId('file-preview-path')?.value || '');
    await actions.onLoadFilePreviewList();
  });

  byId('file-preview-list')?.addEventListener('click', async (event) => {
    const path = event.target.getAttribute('data-preview-open');
    if (!path) return;
    await actions.onOpenPreviewFile(path);
  });

  byId('file-preview-open-editor')?.addEventListener('click', () => {
    actions.onOpenPreviewInEditor();
  });

  byId('editor-content')?.addEventListener('input', (event) => {
    actions.onEditorChangeContent(event.target.value || '');
  });

  byId('editor-save')?.addEventListener('click', async () => {
    await actions.onSaveEditorFile();
  });

  bindWorkspaceControls();
  initGuideToolsModule();
  initDashboardClock();
};


const readPanelProportionPreset = () => {
  try {
    const raw = window.localStorage.getItem(PANEL_PROPORTION_STORAGE_KEY) || '';
    return PANEL_PROPORTION_PRESETS[raw] ? raw : 'balanced';
  } catch {
    return 'balanced';
  }
};

const storePanelProportionPreset = (preset) => {
  try {
    window.localStorage.setItem(PANEL_PROPORTION_STORAGE_KEY, PANEL_PROPORTION_PRESETS[preset] ? preset : 'balanced');
  } catch {
    // Speicher kann blockiert sein.
  }
};

export const applyPanelProportionPreset = (preset = 'balanced') => {
  const key = PANEL_PROPORTION_PRESETS[preset] ? preset : 'balanced';
  const values = PANEL_PROPORTION_PRESETS[key];
  const root = document.documentElement;
  root.style.setProperty('--panel-nav-min', values.navMin);
  root.style.setProperty('--panel-nav-max', values.navMax);
  root.style.setProperty('--panel-main-min', values.mainMin);
  root.style.setProperty('--panel-widgets-min', values.widgetsMin);
  root.style.setProperty('--panel-widgets-max', values.widgetsMax);
  storePanelProportionPreset(key);
  return key;
};

export const resolveInitialPanelProportionPreset = () => readPanelProportionPreset();

export const render = () => {
  const state = getState();
  const texts = state.uiTexts || {};
  const messages = texts.messages || {};

  renderHeaderSection({
    state,
    texts,
    messages,
    setText,
    byId,
    autoFormatText,
    buildHeaderProjectStatus,
    buildHeaderAutosaveStatus
  });

  setText('nav-title', 'Nutzer-Module');
  setText('startup-title', texts.titles?.startup || 'Startstatus');
  setText('status-title', 'Einstellungen & Stabilität');
  setText('log-title', texts.titles?.logs || 'Letzte Meldungen');

  setText('action-select-dir', texts.buttons?.selectDirectory || 'Ordner wählen');
  setText('action-run-selftest', texts.buttons?.runSelftest || 'Selbsttest starten');
  setText('action-ensure-structure', texts.buttons?.ensureStructure || 'Projektstruktur anlegen');
  setText('action-run-write-test', texts.buttons?.runWriteTest || 'Schreibtest ausführen');
  setText('action-switch-dir', texts.buttons?.switchDirectory || 'Ordner wechseln');
  setText('action-export-diagnosis', 'Diagnose exportieren');
  setText('action-logout', texts.buttons?.logout || 'Logout (sicher)');
  const toolsToggle = byId('action-toggle-tools');
  const toolsExpanded = byId('widgets-panel')?.classList.contains('tools-expanded') === true;
  if (toolsToggle) {
    toolsToggle.textContent = toolsExpanded
      ? (texts.buttons?.showLessTools || 'Weniger Tools')
      : (texts.buttons?.showMoreTools || 'Mehr Tools');
    toolsToggle.setAttribute('aria-expanded', toolsExpanded ? 'true' : 'false');
  }

  const a11yText = buildA11yStatusText(state, messages);
  if (a11yText !== lastA11yAnnouncement) {
    setText('a11y-status', a11yText);
    lastA11yAnnouncement = a11yText;
  }

  renderMainSection({
    state,
    byId,
    setText,
    formatPermissionStatus,
    formatWritePermissionStatus,
    formatStructureStatus,
    formatOverallStatus,
    formatDateTime,
    autoFormatText,
    autoFormatHtml,
    renderStats,
    renderProfileOptions,
    renderCategoryList,
    fileNameFromPath,
    buildStartupSteps,
    buildDashboardInfo,
    renderPluginOptions,
    pluginEnabled,
    renderSidebarModules,
    renderTemplateList,
    renderTemplateQuickButtons,
    renderFilePreviewList
  });


  const themeSelect = byId('theme-select');
  const themeEntries = Object.entries(state.themes || {});
  if (themeSelect && themeEntries.length) {
    themeSelect.innerHTML = themeEntries
      .map(([name]) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`)
      .join('');
    themeSelect.value = state.currentTheme || themeEntries[0][0];
  }

  document.getElementById('app')?.setAttribute('data-layout-mode', state.layoutMode || 'standard');
};
