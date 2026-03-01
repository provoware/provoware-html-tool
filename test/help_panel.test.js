const test = require("node:test");
const assert = require("node:assert/strict");
const { buildHelpPanelModel } = require("../system-module/help_panel");

test("buildHelpPanelModel liefert 3 Schritte im Mini-Leitfaden", () => {
  const model = buildHelpPanelModel();

  assert.equal(Array.isArray(model.quickGuide), true);
  assert.equal(model.quickGuide.length, 3);
  assert.match(model.quickGuide[0], /start\.sh/);
});
