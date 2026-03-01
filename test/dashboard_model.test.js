const test = require("node:test");
const assert = require("node:assert/strict");
const {
  applyLayoutSnapshot,
  buildBootGateHint,
  buildQuickAccess,
  buildSafeModeStatus,
  createLayoutSnapshot,
  getGridColumnCount,
  getModuleRegistry,
  getDefaultModuleStart,
  moveZone,
  normalizeLayoutState,
  reorderZones,
  resolveFavoritesAction,
  resolveSidebarShortcut,
  resolveBootFocusTarget,
} = require("../system-module/dashboard_model");

test("buildQuickAccess kombiniert gepinnt + genutzt ohne Duplikate", () => {
  const result = buildQuickAccess(
    ["Editor", "Terminal"],
    ["Terminal", "Logs", "Backup"],
    4,
  );

  assert.deepEqual(result, ["Editor", "Terminal", "Logs", "Backup"]);
});

test("reorderZones verschiebt Zone nach Zielposition", () => {
  const zones = [{ id: "fav" }, { id: "quick" }, { id: "modules" }];
  const result = reorderZones(zones, 2, 0);

  assert.deepEqual(
    result.map((zone) => zone.id),
    ["modules", "fav", "quick"],
  );
});

test("moveZone bewegt Zone nach unten", () => {
  const zones = [{ id: "fav" }, { id: "quick" }, { id: "modules" }];
  const result = moveZone(zones, "fav", "down");

  assert.deepEqual(
    result.map((zone) => zone.id),
    ["quick", "fav", "modules"],
  );
});

test("normalizeLayoutState begrenzt Breiten und setzt Booleans", () => {
  const result = normalizeLayoutState({
    leftWidth: 120,
    rightWidth: 999,
    leftCollapsed: 1,
    rightCollapsed: 0,
  });

  assert.deepEqual(result, {
    leftWidth: 220,
    rightWidth: 340,
    leftCollapsed: true,
    rightCollapsed: false,
    bootFocusTarget: "module",
    backupDetailOpen: false,
    showBootDebugInSupport: true,
  });
});

test("getGridColumnCount waehlt 1 bis 3 Spalten je Breite", () => {
  assert.equal(getGridColumnCount(500), 1);
  assert.equal(getGridColumnCount(700), 2);
  assert.equal(getGridColumnCount(1100), 3);
  assert.equal(getGridColumnCount(1500), 3);
});

test("createLayoutSnapshot und applyLayoutSnapshot arbeiten mit sicheren Werten", () => {
  const snapshot = createLayoutSnapshot({
    leftWidth: 250,
    rightWidth: 300,
    leftCollapsed: false,
    rightCollapsed: true,
    backupDetailOpen: true,
  });

  const restored = applyLayoutSnapshot(
    {
      leftWidth: 260,
      rightWidth: 280,
      leftCollapsed: false,
      rightCollapsed: false,
    },
    snapshot,
  );

  assert.deepEqual(restored, snapshot);
});

test("resolveSidebarShortcut schaltet Favoritenleiste per Alt+F", () => {
  const result = resolveSidebarShortcut({ key: "f", altKey: true }, false);

  assert.equal(result.handled, true);
  assert.equal(result.nextOpen, true);
  assert.match(result.status, /Favoritenleiste geoeffnet/);
});

test("resolveSidebarShortcut ignoriert andere Tasten", () => {
  const result = resolveSidebarShortcut({ key: "x", altKey: true }, true);

  assert.equal(result.handled, false);
  assert.equal(result.nextOpen, true);
});

test("resolveFavoritesAction liefert Modul-Liste", () => {
  const result = resolveFavoritesAction("show-all-modules", {
    activeModules: [{ title: "Projektmanagement" }, { title: "Support" }],
  });

  assert.equal(result.handled, true);
  assert.match(result.status, /Aktive Module/);
  assert.match(result.status, /Projektmanagement/);
});

test("resolveFavoritesAction meldet fehlendes letztes Modul", () => {
  const result = resolveFavoritesAction("open-last-module", {
    lastModuleTitle: "",
  });

  assert.equal(result.handled, true);
  assert.match(result.status, /Noch kein letztes Modul/);
});

test("getModuleRegistry liefert alle implementierten Module", () => {
  const modules = getModuleRegistry();
  assert.equal(Array.isArray(modules), true);
  assert.equal(modules.length >= 5, true);
  assert.match(modules.map((entry) => entry.title).join(", "), /Support/);
  assert.match(modules.map((entry) => entry.title).join(", "), /Notizen/);
});

test("getDefaultModuleStart liefert genau das Notizmodul", () => {
  const defaults = getDefaultModuleStart();
  assert.deepEqual(defaults, ["notes"]);
});
test("buildBootGateHint liefert Gate-Hinweis fuer offen und gesperrt", () => {
  const open = buildBootGateHint(true, "help");
  const closed = buildBootGateHint(false, "module");

  assert.equal(open.gateOpen, true);
  assert.match(open.hint, /Weiter ist frei/);
  assert.match(open.hint, /Fokusziel: Hilfe/);
  assert.equal(closed.gateOpen, false);
  assert.match(closed.help, /Boot ist noch nicht fertig/);
  assert.match(closed.hint, /Geplantes Fokusziel: Modul/);
});

test("buildSafeModeStatus liefert klare Safe-Mode-Texte", () => {
  const active = buildSafeModeStatus({
    isSafeMode: true,
    reason: "Manifest defekt",
  });
  const inactive = buildSafeModeStatus({ isSafeMode: false });

  assert.equal(active.isSafeMode, true);
  assert.match(active.text, /Safe-Mode aktiv/);
  assert.match(active.text, /Manifest defekt/);
  assert.equal(inactive.isSafeMode, false);
  assert.match(inactive.text, /Safe-Mode aus/);
});

test("normalizeLayoutState setzt Boot-Fokusziel sicher", () => {
  const result = normalizeLayoutState({ bootFocusTarget: "help" });
  assert.equal(result.bootFocusTarget, "help");

  const fallback = normalizeLayoutState({ bootFocusTarget: "abc" });
  assert.equal(fallback.bootFocusTarget, "module");
});

test("resolveBootFocusTarget liefert Fokusziel und Status", () => {
  const helpTarget = resolveBootFocusTarget({ bootFocusTarget: "help" });
  const moduleTarget = resolveBootFocusTarget({ bootFocusTarget: "module" });

  assert.equal(helpTarget.target, "help");
  assert.match(helpTarget.status, /Hilfe/);
  assert.equal(moduleTarget.target, "module");
  assert.match(moduleTarget.status, /ersten Modul/);
});

test("normalizeLayoutState setzt Backup-Detailzustand sicher", () => {
  const opened = normalizeLayoutState({ backupDetailOpen: true });
  assert.equal(opened.backupDetailOpen, true);

  const closed = normalizeLayoutState({ backupDetailOpen: "ja" });
  assert.equal(closed.backupDetailOpen, false);
});

test("normalizeLayoutState setzt Boot-Debug-Schalter sicher", () => {
  const shown = normalizeLayoutState({ showBootDebugInSupport: true });
  assert.equal(shown.showBootDebugInSupport, true);

  const hidden = normalizeLayoutState({ showBootDebugInSupport: false });
  assert.equal(hidden.showBootDebugInSupport, false);
});
