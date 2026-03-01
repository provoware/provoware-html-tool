const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizeText,
  setPhaseState,
  statusLabel,
} = require("../templates/boot_status");

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

test("setPhaseState nutzt sicheren Fallback mit naechstem Schritt", () => {
  const node = {
    dataset: {},
    textContent: "",
  };

  const value = setPhaseState(node, "ungueltig", "");
  assert.equal(node.dataset.state, "warn");
  assert.match(
    value,
    /Erneut versuchen, Reparatur starten oder Protokoll oeffnen\./,
  );
});
