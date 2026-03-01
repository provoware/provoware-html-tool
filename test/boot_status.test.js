const test = require("node:test");
const assert = require("node:assert/strict");
const {
  createBootStatusController,
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

test("createBootStatusController prueft Weiter-Gate auf alle gruene Phasen", () => {
  const phaseUi = {
    dataset: { bootPhase: "ui", state: "warn" },
    textContent: "",
  };
  const phaseFolder = {
    dataset: { bootPhase: "folder", state: "warn" },
    textContent: "",
  };
  const summary = { dataset: {}, textContent: "" };
  const root = {
    querySelectorAll() {
      return [phaseUi, phaseFolder];
    },
  };

  const controller = createBootStatusController({ root, summary });
  assert.equal(controller.areAllPhasesOk(), false);

  controller.setPhase("ui", "ok", "UI bereit");
  controller.setPhase("folder", "ok", "Ordner bereit");

  assert.equal(controller.areAllPhasesOk(), true);
  assert.equal(controller.getPhaseState("ui"), "ok");
});
