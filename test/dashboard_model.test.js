const test = require("node:test");
const assert = require("node:assert/strict");
const {
  buildQuickAccess,
  getGridColumnCount,
  moveZone,
  normalizeLayoutState,
  reorderZones,
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

test("getGridColumnCount waehlt 1 bis 4 Spalten je Breite", () => {
  assert.equal(getGridColumnCount(500), 1);
  assert.equal(getGridColumnCount(700), 2);
  assert.equal(getGridColumnCount(1100), 3);
  assert.equal(getGridColumnCount(1500), 4);
});
