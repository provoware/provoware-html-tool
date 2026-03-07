import test from 'node:test';
import assert from 'node:assert/strict';

if (!globalThis.window) {
  globalThis.window = {};
}

const { createUiActionHandlers } = await import('../../js/services/ui-action-handlers.js');
const { createDefaultArchive } = await import('../../js/services/profile-archive.js');

const makeBase = () => {
  let state = {
    selectedProfile: 'HardTechno',
    profileArchive: createDefaultArchive(),
    logs: [],
    templateArchive: { items: [] }
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
