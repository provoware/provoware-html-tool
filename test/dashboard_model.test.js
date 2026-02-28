const test = require("node:test");
const assert = require("node:assert/strict");
const {
  buildQuickAccess,
  moveZone,
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
