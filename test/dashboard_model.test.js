const test = require("node:test");
const assert = require("node:assert/strict");
const {
  applyLayoutSnapshot,
  buildQuickAccess,
  createLayoutSnapshot,
  getGridColumnCount,
  getModuleRegistry,
  moveZone,
  normalizeLayoutState,
  reorderZones,
  resolveFavoritesAction,
  resolveSidebarShortcut,
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
  assert.equal(modules.length >= 4, true);
  assert.match(modules.map((entry) => entry.title).join(", "), /Support/);
});
