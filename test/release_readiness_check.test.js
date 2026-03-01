const test = require("node:test");
const assert = require("node:assert/strict");
const {
  checkThemeContrast,
  getContrastRatio,
  parseJsonText,
  runReleaseReadinessCheck,
  summarizeA11yChecks,
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
    "Rail-Design-Token in CSS vorhanden",
    "Statusbanner-Token in CSS vorhanden",
    "Modulprofil-Attribut fuer Karten ist vorhanden",
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

test("checkThemeContrast liefert 40 Theme-Kontrastchecks", () => {
  const cssText = [
    ":root { --bg: #060b18; --fg: #eef4ff; --topbar: #081127; --topbar-fg: #f5f8ff; --banner-bg: #0f2345; --banner-fg: #f4f8ff; --rail-bg: #0d1b31; --module-project-bg: #271426; --module-sales-bg: #122a46; --module-analytics-bg: #29210d; --module-support-bg: #122b24; }",
    '[data-theme="dark"] { --bg: #0f1925; --fg: #e9f0f6; --topbar: #10273a; --topbar-fg: #f8fcff; --banner-bg: #1c3a55; --banner-fg: #f6fbff; --rail-bg: #1a2f44; --module-project-bg: #342538; --module-sales-bg: #19395b; --module-analytics-bg: #3b3317; --module-support-bg: #17372f; }',
    '[data-theme="contrast"] { --bg: #000000; --fg: #ffffff; --topbar: #000000; --topbar-fg: #ffffff; --banner-bg: #111111; --banner-fg: #ffffff; --rail-bg: #111111; --module-project-bg: #1a121a; --module-sales-bg: #12202a; --module-analytics-bg: #27240f; --module-support-bg: #112018; }',
    '[data-theme="warm"] { --bg: #f7f0eb; --fg: #2d1b1a; --topbar: #7b2f27; --topbar-fg: #fff4ef; --banner-bg: #8f3f31; --banner-fg: #fff7f2; --rail-bg: #fff6f2; --module-project-bg: #fff0ea; --module-sales-bg: #eef5ff; --module-analytics-bg: #fff8e5; --module-support-bg: #ebf7ef; }',
    '[data-theme="camo"] { --bg: #edf1e4; --fg: #1f2a1d; --topbar: #405437; --topbar-fg: #f4f7ee; --banner-bg: #4a6440; --banner-fg: #f8fbef; --rail-bg: #f4f8ec; --module-project-bg: #f4ece9; --module-sales-bg: #e9f2ef; --module-analytics-bg: #f4f0de; --module-support-bg: #e9f4e3; }',
  ].join("\n");
  const checks = checkThemeContrast(cssText, 4.5);
  assert.equal(checks.length, 40);
  assert.equal(
    checks.every((item) => item.ok),
    true,
  );
});

test("summarizeA11yChecks liefert Kurzbericht", () => {
  const summary = summarizeA11yChecks([
    { ok: true, message: "Statusbereich mit aria-live vorhanden" },
    { ok: false, message: "Kontrast light/Haupttext: 3.50 (mindestens 4.5)" },
    { ok: true, message: "Andere Pruefung ohne Bezug" },
  ]);

  assert.equal(summary.total, 2);
  assert.equal(summary.passed, 1);
  assert.equal(summary.failed, 1);
  assert.match(summary.message, /A11y-Kurzbericht/);
});
