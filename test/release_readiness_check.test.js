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
});
