const test = require("node:test");
const assert = require("node:assert/strict");
const {
  readDesignLayoutManifest,
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
});
