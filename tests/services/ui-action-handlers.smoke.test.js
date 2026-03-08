import test from 'node:test';
import assert from 'node:assert/strict';

if (!globalThis.window) {
  globalThis.window = {};
}

const { createUiActionHandlers } = await import('../../js/services/ui-action-handlers.js');
const { createDefaultArchive } = await import('../../js/services/profile-archive.js');
const { filesystemAdapter } = await import('../../js/adapters/filesystem-adapter.js');


const withFilesystemAdapterMocks = async (overrides, run) => {
  const original = {
    fileExists: filesystemAdapter.fileExists,
    readText: filesystemAdapter.readText,
    writeText: filesystemAdapter.writeText
  };
  Object.assign(filesystemAdapter, overrides);
  try {
    await run();
  } finally {
    Object.assign(filesystemAdapter, original);
  }
};

const makeBase = () => {
  let state = {
    selectedProfile: 'HardTechno',
    profileArchive: createDefaultArchive(),
    logs: [],
    templateArchive: { items: [] },
    dashboardNotes: {
      basePath: 'data/dashboard3-notes',
      rows: [
        { title: 'pppoppi details ideen', input: '', feedback: '-', lastSavedPath: '' },
        { title: 'Favoriten Genres', input: '', feedback: '-', lastSavedPath: '' },
        { title: 'Templates-Input-Pool', input: '', feedback: '-', lastSavedPath: '' }
      ]
    }
  };

  return {
    getState: () => state,
    setState: (patch) => {
      state = { ...state, ...patch };
    },
    selectDirectory: async () => {},
    runSelftest: async () => {},
    ensureStructure: async () => {},
    buildDiagnosisExport: () => ({ ok: true, from: 'test' }),
    copyToClipboardSafe: async () => {},
    updateArchive: async (mutate) => mutate(state.profileArchive),
    updateTemplateArchive: async () => ({ ok: true }),
    logEvent: () => {}
  };
};

test('smoke: diagnosis export liefert json-text', async () => {
  const actions = createUiActionHandlers(makeBase());
  const text = await actions.onExportDiagnosis();
  assert.equal(typeof text, 'string');
  const parsed = JSON.parse(text);
  assert.equal(parsed.from, 'test');
});

test('smoke: archive import nimmt gültiges json an', async () => {
  const base = makeBase();
  const actions = createUiActionHandlers(base);
  const result = await actions.onImportArchive(JSON.stringify(createDefaultArchive()));
  assert.equal(result.ok, true);
  assert.equal(result.code, 'ARCHIVE_IMPORTED');
});

test('smoke: mix erzeugung liefert ok bei vorhandenen einträgen', async () => {
  const base = makeBase();
  base.getState().profileArchive.profiles.HardTechno.genres.push({ value: 'A', createdAt: new Date().toISOString() });
  const actions = createUiActionHandlers(base);
  const result = await actions.onGenerateMix({ includeCategories: ['genres'], amountPerCategory: { genres: 1 } });
  assert.equal(result.ok, true);
  assert.equal(result.code, 'MIX_CREATED');
});

test('smoke: dashboard-note validierung meldet fehlende felder', async () => {
  const base = makeBase();
  const actions = createUiActionHandlers(base);

  const missingTitle = await actions.onDashboardNoteSave({ rowIndex: 0, title: '', value: 'Eintrag' });
  assert.equal(missingTitle.ok, false);
  assert.equal(missingTitle.code, 'DASHBOARD_NOTE_TITLE_MISSING');

  const missingValue = await actions.onDashboardNoteSave({ rowIndex: 1, title: 'Favoriten Genres', value: '' });
  assert.equal(missingValue.ok, false);
  assert.equal(missingValue.code, 'DASHBOARD_NOTE_VALUE_MISSING');
});

test('smoke: dashboard-note datei öffnen meldet fehlende datei', async () => {
  const base = makeBase();
  const actions = createUiActionHandlers(base);
  const result = await actions.onOpenDashboardNoteLastFileInEditor(0);
  assert.equal(result.ok, false);
  assert.equal(result.code, 'DASHBOARD_NOTE_EDITOR_OPEN_FAILED');
  assert.equal(base.getState().dashboardNotes.rows[0].feedback, 'Noch keine Datei gespeichert.');
});


test('smoke: logout ohne desktop-backend ist erfolgreich', async () => {
  const base = makeBase();
  const actions = createUiActionHandlers(base);
  const result = await actions.onLogoutWithAutosave();
  assert.equal(result.ok, true);
  assert.equal(result.code, 'LOGOUT_DONE');
});


test('smoke: dashboard-note save meldet exists-check-fehler vom adapter', async () => {
  await withFilesystemAdapterMocks({
    fileExists: async () => ({ ok: false, code: 'EXISTS_FAILED', data: { reason: 'disk' } })
  }, async () => {
    const base = makeBase();
    const actions = createUiActionHandlers(base);
    const result = await actions.onDashboardNoteSave({ rowIndex: 0, title: 'Test', value: 'Eintrag' });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'DASHBOARD_NOTE_EXISTS_CHECK_FAILED');
    assert.equal(base.getState().dashboardNotes.rows[0].feedback, 'Dateiprüfung fehlgeschlagen.');
  });
});

test('smoke: dashboard-note save meldet read-fehler vom adapter', async () => {
  await withFilesystemAdapterMocks({
    fileExists: async () => ({ ok: true, data: { exists: true } }),
    readText: async () => ({ ok: false, code: 'READ_FAILED', data: { reason: 'missing' } })
  }, async () => {
    const base = makeBase();
    const actions = createUiActionHandlers(base);
    const result = await actions.onDashboardNoteSave({ rowIndex: 1, title: 'Favoriten Genres', value: 'Neu' });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'DASHBOARD_NOTE_READ_FAILED');
    assert.equal(base.getState().dashboardNotes.rows[1].feedback, 'Datei konnte nicht gelesen werden.');
  });
});

test('smoke: dashboard-note save meldet write-fehler vom adapter', async () => {
  await withFilesystemAdapterMocks({
    fileExists: async () => ({ ok: true, data: { exists: false } }),
    writeText: async () => ({ ok: false, code: 'WRITE_FAILED', data: { reason: 'readonly' } })
  }, async () => {
    const base = makeBase();
    const actions = createUiActionHandlers(base);
    const result = await actions.onDashboardNoteSave({ rowIndex: 2, title: 'Templates-Input-Pool', value: 'Neu' });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'DASHBOARD_NOTE_SAVE_FAILED');
    assert.equal(base.getState().dashboardNotes.rows[2].feedback, 'Eintrag konnte nicht gespeichert werden.');
  });
});


test('smoke: rasterhilfe-toggle setzt den zustand', async () => {
  const base = makeBase();
  const actions = createUiActionHandlers(base);

  actions.onToggleGridHelp(false);
  assert.equal(base.getState().showGridHelp, false);

  actions.onToggleGridHelp(true);
  assert.equal(base.getState().showGridHelp, true);
});
