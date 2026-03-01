const test = require("node:test");
const assert = require("node:assert/strict");
const {
  readDesignLayoutManifest,
  validateCardProfiles,
  validateDesignLayoutManifest,
  validateThemeList,
} = require("../system-module/design_layout_manifest");

test("validateThemeList akzeptiert mindestens vier vollstaendige Themes", () => {
  const result = validateThemeList([
    { id: "light", label: "Hell", contrastTarget: "AA" },
    { id: "dark", label: "Dunkel", contrastTarget: "AA" },
    { id: "warm", label: "Roetlich", contrastTarget: "AA" },
    { id: "camo", label: "Camouflage", contrastTarget: "AA" },
  ]);

  assert.equal(result.ok, true);
});

test("validateDesignLayoutManifest liefert Fehler bei unvollstaendigem Input", () => {
  const result = validateDesignLayoutManifest({ meta: {}, themes: [] });

  assert.equal(result.ok, false);
  assert.match(result.message, /Manifest ist unvollstaendig/);
});

test("readDesignLayoutManifest liest die Projektdatei erfolgreich", () => {
  const result = readDesignLayoutManifest(process.cwd());

  assert.equal(result.ok, true);
  assert.equal(result.manifest.meta.name, "dashboard-layout-neon-v1");
  assert.equal(result.manifest.layout.shell.type, "three-column");
  assert.equal(
    result.manifest.visual.tokenSource,
    "config/ui_design_tokens.json",
  );
});

test("validateCardProfiles akzeptiert vier zentrale Kartenprofile", () => {
  const result = validateCardProfiles([
    { id: "project", tokenPrefix: "module-project", purpose: "Projekt" },
    { id: "sales", tokenPrefix: "module-sales", purpose: "Vertrieb" },
    { id: "analytics", tokenPrefix: "module-analytics", purpose: "Analyse" },
    { id: "support", tokenPrefix: "module-support", purpose: "Support" },
  ]);

  assert.equal(result.ok, true);
});
