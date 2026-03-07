import { categories } from './services/profile-archive.js';
import { getState } from './state.js';
import { formatStatusWithSymbol, statusVisual } from './status-visuals.js';

const byId = (id) => document.getElementById(id);
let lastA11yAnnouncement = '';
const defaultTodos = Object.freeze(['Erste Aufgabe prüfen']);

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

const formatStatusWord = (value) => {
  const normalized = normalizeWhitespace(value);
  return normalized ? normalized.toLowerCase() : '-';
};

const setText = (id, text) => {
  const node = byId(id);
  if (node) node.textContent = text;
};

const statusClass = (status) => (status === 'green' ? 'check-ok' : status === 'yellow' ? 'check-warn' : 'check-error');

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
  return options.map((name) => `<option value="${name}" ${name === selected ? 'selected' : ''}>${name}</option>`).join('');
};

const renderCategoryList = (archive, profile, category) => {
  const list = archive?.profiles?.[profile]?.[category] || [];
  return list.map((item) => `<li><span>${item.value}</span><div><button class="btn-small" data-edit="${category}" data-value="${item.value}">Bearbeiten</button><button class="btn-small" data-delete="${category}" data-value="${item.value}">Löschen</button></div></li>`).join('');
};

const renderStats = (stats) => {
  if (!stats) return '-';
  return `Genres: ${stats.genres} | Stimmungen: ${stats.moods} | Stile: ${stats.styles} | Gesamt: ${stats.total}`;
};

const escapeHtml = (value) => String(value || '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const renderTemplateList = (items = []) => {
  if (!items.length) return '<li>-</li>';
  return items
    .map((item) => `<li><div><strong>${escapeHtml(item.title)}</strong><br><small>${escapeHtml(item.category)}</small></div><div><button class="btn-small" data-template-copy="${item.id}">Kopieren</button><button class="btn-small" data-template-edit="${item.id}">Bearbeiten</button><button class="btn-small" data-template-favorite="${item.id}">${item.favorite ? '★' : '☆'}</button><button class="btn-small" data-template-delete="${item.id}">Löschen</button></div></li>`)
    .join('');
};

const renderTemplateQuickButtons = (items = []) => {
  const favorites = items.filter((item) => item.favorite).slice(0, 8);
  if (!favorites.length) return '<p class="sidebar-empty">Noch keine Favoriten.</p>';
  return favorites.map((item) => `<button type="button" class="btn-small" data-template-copy="${item.id}">${escapeHtml(item.title)}</button>`).join('');
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
      return `<button type="button" class="btn module-btn" title="${label}"><span>${label}</span><small>${status}</small></button>`;
    })
    .join('');
};

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
    focus: '--focus'
  };
  Object.entries(map).forEach(([token, cssVar]) => {
    if (themeTokens[token]) document.documentElement.style.setProperty(cssVar, themeTokens[token]);
  });
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
  let uiScale = 1;

  const applyUiScale = (nextScale) => {
    const rounded = Number(nextScale.toFixed(2));
    uiScale = Math.min(1.2, Math.max(0.72, rounded));
    document.documentElement.style.setProperty('--ui-scale', String(uiScale));
  };

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

  document.querySelectorAll('.module-panel').forEach((panel) => {
    const controls = panel.querySelector('.module-controls');
    if (!controls) return;
    controls.innerHTML = [
      '<button type="button" class="panel-control" data-panel-hide title="Ausblenden">◫</button>',
      '<button type="button" class="panel-control" data-panel-minimize title="Minimieren">—</button>',
      '<button type="button" class="panel-control" data-panel-maximize title="Maximieren">⛶</button>'
    ].join('');
  });

  document.querySelectorAll('[data-panel-maximize]').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = button.closest('.module-panel');
      if (!panel) return;
      const willMaximize = !panel.classList.contains('is-maximized');
      document.querySelectorAll('.module-panel.is-maximized').forEach((entry) => entry.classList.remove('is-maximized'));
      if (willMaximize) panel.classList.add('is-maximized');
      app.classList.toggle('has-maximized-panel', willMaximize);
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
    });
  });

  const todoList = byId('todo-list');
  const todoInput = byId('todo-input');
  const todoAdd = byId('todo-add');
  const todos = [...defaultTodos];

  const renderTodos = () => {
    if (!todoList) return;
    todoList.innerHTML = todos.map((todo, index) => (
      `<li><span>${escapeHtml(todo)}</span><button type="button" class="btn-small" data-todo-delete="${index}">Erledigt</button></li>`
    )).join('');
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
      applyUiScale(1);
      return;
    }
    if (event.key !== 'Escape') return;
    document.querySelectorAll('.module-panel.is-maximized').forEach((entry) => entry.classList.remove('is-maximized'));
    app.classList.remove('has-maximized-panel');
  });

  window.addEventListener('wheel', (event) => {
    if (!event.ctrlKey) return;
    event.preventDefault();
    const step = event.deltaY > 0 ? -0.04 : 0.04;
    applyUiScale(uiScale + step);
  }, { passive: false });
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
  byId('a11y-quiet-mode')?.addEventListener('change', (event) => {
    actions.onToggleA11yQuietMode(event.target.checked);
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
};

export const render = () => {
  const state = getState();
  const texts = state.uiTexts || {};
  const messages = texts.messages || {};

  setText('app-title', texts.titles?.appTitle || 'ProvoWare Dashboard');
  setText('app-subtitle', texts.titles?.appSubtitle || 'Projektstart');
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

  const nextStep = byId('next-step');
  if (nextStep) {
    const startupReady = state.debug?.startupReady;
    const nextMessage = startupReady ? messages.startupReady || '' : messages.startupWaiting || messages.startupBlocked || '';
    nextStep.innerHTML = `<strong>${messages.actionNext || 'Nächster Schritt'}:</strong> ${autoFormatText(nextMessage)}`;
  }

  const a11yText = buildA11yStatusText(state, messages);
  if (a11yText !== lastA11yAnnouncement) {
    setText('a11y-status', a11yText);
    lastA11yAnnouncement = a11yText;
  }

  const selectedName = state.selectedProjectDirectory?.name;
  const rememberedName = state.rememberedProjectDirectoryName;
  const folderText = selectedName || (rememberedName ? `${rememberedName} (zuletzt gewählt)` : '-');
  setText('status-folder', folderText);
  setText('status-read', formatPermissionStatus(state.permissionStatus?.read));
  setText('status-write', formatWritePermissionStatus(state.permissionStatus));
  setText('status-structure', formatStructureStatus(state.selftestResult));
  setText('status-last-test', autoFormatText(state.selftestResult?.summary || '-'));
  setText('status-overall', formatOverallStatus(state.selftestResult?.overallStatus || 'red'));
  setText('status-layout', state.layoutMode || '-');
  const quietModeToggle = byId('a11y-quiet-mode');
  if (quietModeToggle) quietModeToggle.checked = Boolean(state.a11yQuietMode);

  const checksList = byId('checks-list');
  if (checksList) {
    const checks = state.selftestResult?.checks || [];
    checksList.innerHTML = checks.map((check) => {
      const visual = statusVisual(check.status);
      return `<article class="check-item ${statusClass(check.status)}"><strong>${visual.symbol} ${autoFormatText(check.name)}</strong><br><span>${autoFormatText(check.message)}</span></article>`;
    }).join('');
  }

  setText('archive-stats', renderStats(state.profileStats));
  const profileSelect = byId('profile-select');
  if (profileSelect) {
    profileSelect.innerHTML = renderProfileOptions(state.profileArchive, state.selectedProfile);
  }
  const sortSelect = byId('archive-sort');
  if (sortSelect) sortSelect.value = state.archiveSortMode || 'alpha';

  const archiveList = byId('archive-list');
  if (archiveList) {
    archiveList.innerHTML = categories.map((category) => `<section class="archive-category"><h4>${category}</h4><ul>${renderCategoryList(state.profileArchive, state.selectedProfile, category) || '<li>-</li>'}</ul></section>`).join('');
  }

  const noteRows = state.dashboardNotes?.rows || [];
  noteRows.forEach((row, rowIndex) => {
    const titleField = byId(`dashboard-note-title-${rowIndex}`);
    if (titleField && document.activeElement !== titleField) titleField.value = row.title || '';
    const inputField = byId(`dashboard-note-input-${rowIndex}`);
    if (inputField && document.activeElement !== inputField) inputField.value = row.input || '';
    const openButton = byId(`dashboard-note-open-${rowIndex}`);
    if (openButton) openButton.disabled = !row.lastSavedPath;
    setText(`dashboard-note-feedback-${rowIndex}`, row.feedback || '-');
    const lastFile = fileNameFromPath(row.lastSavedPath);
    setText(`dashboard-note-file-${rowIndex}`, `Letzte Datei: ${lastFile || '-'}`);
  });

  setText('module-registry-summary', state.moduleRegistry?.summary || '-');
  setText('module-registry-summary-main', state.moduleRegistry?.summary || '-');
  const sidebarModuleList = byId('sidebar-module-list');
  if (sidebarModuleList) {
    sidebarModuleList.innerHTML = renderSidebarModules(state.moduleRegistry?.modules || []);
  }
  setText('template-design-status', autoFormatText(state.templateDesignStatus?.message || '-'));

  const templateDraft = state.templateDraft || { id: null, title: '', content: '', category: 'Textbaustein' };
  const templateId = byId('template-id');
  if (templateId) templateId.value = templateDraft.id || '';
  const templateTitle = byId('template-title');
  if (templateTitle) templateTitle.value = templateDraft.title || '';
  const templateCategory = byId('template-category');
  if (templateCategory) templateCategory.value = templateDraft.category || 'Textbaustein';
  const templateContent = byId('template-content');
  if (templateContent) templateContent.value = templateDraft.content || '';

  const templateList = byId('template-list');
  if (templateList) {
    templateList.innerHTML = renderTemplateList(state.templateArchive?.items || []);
  }

  const templateFavorites = byId('template-favorites');
  if (templateFavorites) {
    templateFavorites.innerHTML = renderTemplateQuickButtons(state.templateArchive?.items || []);
  }

  const templateFeedback = byId('template-feedback');
  if (templateFeedback) {
    const text = state.templateFeedback?.message || '';
    templateFeedback.textContent = text;
    templateFeedback.style.visibility = text ? 'visible' : 'hidden';
  }

  const archiveEvents = byId('archive-events');
  if (archiveEvents) {
    archiveEvents.innerHTML = (state.profileArchive?.events || []).slice(0, 6).map((item) => `<li><span>${item.timestamp.slice(11, 19)}</span> ${autoFormatText(item.message)}</li>`).join('');
  }

  const logList = byId('log-list');
  if (logList) {
    logList.innerHTML = (state.logs || [])
      .slice(0, 10)
      .map((item) => `<li><span class="log-time">${item.timestamp.slice(11, 19)}</span><strong>${autoFormatText(item.type)}</strong> ${autoFormatText(item.message)}</li>`)
      .join('');
  }

  const filePreviewPath = byId('file-preview-path');
  if (filePreviewPath) filePreviewPath.value = state.filePreviewPath || '';

  const includeOther = byId('file-preview-include-other');
  if (includeOther) includeOther.checked = Boolean(state.filePreviewIncludeOtherFiles);

  setText('file-preview-status', state.filePreviewStatus || '-');

  const filePreviewList = byId('file-preview-list');
  if (filePreviewList) filePreviewList.innerHTML = renderFilePreviewList(state.filePreviewEntries || []);

  const filePreviewContent = byId('file-preview-content');
  if (filePreviewContent) filePreviewContent.value = state.filePreviewContent || '';

  const editorContent = byId('editor-content');
  if (editorContent && document.activeElement !== editorContent) {
    editorContent.value = state.editorContent || '';
  }

  const dirtyBadge = state.editorDirty ? ' *ungespeichert' : '';
  setText('editor-file-path', state.editorFilePath ? `${state.editorFilePath}${dirtyBadge}` : '-');
  setText('editor-status', state.editorStatus || '-');

  document.getElementById('app')?.setAttribute('data-layout-mode', state.layoutMode || 'standard');
};
