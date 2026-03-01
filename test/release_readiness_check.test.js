const test = require("node:test");
const assert = require("node:assert/strict");
const {
  checkThemeContrast,
  getContrastRatio,
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
    "Backup-Restore-Skript ist eingebunden",
    "Boot-Statusbereich ist vorhanden",
    "Boot-Status-Skript ist eingebunden",
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

test("getContrastRatio liefert hohen Kontrast fuer Schwarz auf Weiss", () => {
  const ratio = getContrastRatio("#000000", "#ffffff");
  assert.equal(Math.round(ratio), 21);
});

test("checkThemeContrast liefert 10 Theme-Kontrastchecks", () => {
  const cssText = [
    ":root { --bg: #ffffff; --fg: #111111; --topbar: #123456; --topbar-fg: #ffffff; }",
    '[data-theme="dark"] { --bg: #101010; --fg: #ffffff; --topbar: #222222; --topbar-fg: #ffffff; }',
    '[data-theme="contrast"] { --bg: #000000; --fg: #ffffff; --topbar: #000000; --topbar-fg: #ffffff; }',
    '[data-theme="warm"] { --bg: #fff4ef; --fg: #2d1b1a; --topbar: #7b2f27; --topbar-fg: #fff4ef; }',
    '[data-theme="camo"] { --bg: #edf1e4; --fg: #1f2a1d; --topbar: #405437; --topbar-fg: #f4f7ee; }',
  ].join("\n");
  const checks = checkThemeContrast(cssText, 4.5);
  assert.equal(checks.length, 10);
  assert.equal(
    checks.every((item) => item.ok),
    true,
  );
});
