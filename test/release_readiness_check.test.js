const test = require("node:test");
const assert = require("node:assert/strict");
const {
  parseJsonText,
  runReleaseReadinessCheck,
} = require("../tools/release_readiness_check");

test("parseJsonText verarbeitet gueltiges JSON", () => {
  const result = parseJsonText('{"ok":true}', "Test-JSON");
  assert.equal(result.ok, true);
});

test("parseJsonText wirft Fehler bei ungueltigem JSON", () => {
  assert.throws(
    () => parseJsonText("{ungueltig}", "Test-JSON"),
    /Test-JSON ist ungueltig/,
  );
});

test("runReleaseReadinessCheck prueft A11y und Themes", () => {
  const result = runReleaseReadinessCheck({ rootPath: process.cwd() });
  assert.equal(result.ok, true);
  assert.match(result.message, /Release-Check ok/);
  assert.equal(Array.isArray(result.checks), true);
  assert.equal(result.failed.length, 0);

  const requiredMessages = [
    "Textbereich 'help.what' ist gesetzt",
    "Textbereich 'help.data' ist gesetzt",
    "Textbereich 'help.undo' ist gesetzt",
    "Textbereich 'dashboard.what' ist gesetzt",
    "Textbereich 'dashboard.data' ist gesetzt",
    "Textbereich 'dashboard.undo' ist gesetzt",
    "5-Punkte-Check im Backup-Dialog ist vorhanden",
    "README dokumentiert Doku-Pflicht im Release-Check",
  ];

  for (const message of requiredMessages) {
    assert.equal(
      result.checks.some((item) => item.message === message),
      true,
      `Check fehlt: ${message}`,
    );
  }
});
