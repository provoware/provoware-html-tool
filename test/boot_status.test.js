const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeText, statusLabel } = require("../templates/boot_status");

test("normalizeText nutzt Fallback bei leerem Text", () => {
  assert.equal(
    normalizeText("", "Naechster Schritt: Erneut versuchen."),
    "Naechster Schritt: Erneut versuchen.",
  );
});

test("statusLabel mappt Ampelwerte", () => {
  assert.equal(statusLabel("ok"), "Gruen");
  assert.equal(statusLabel("warn"), "Gelb");
  assert.equal(statusLabel("fail"), "Rot");
});
