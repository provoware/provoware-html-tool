const test = require("node:test");
const assert = require("node:assert/strict");
const {
  validateUiDesignTokens,
  readUiDesignTokens,
} = require("../system-module/ui_design_tokens");

test("validateUiDesignTokens akzeptiert vollstaendiges Token-Set", () => {
  const result = validateUiDesignTokens({
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
    radius: { sm: 8, md: 10, lg: 12, xl: 14 },
    font: { size: { sm: 14, md: 16, lg: 20, xl: 24 } },
    shadow: { panel: "0 10px 20px rgba(0,0,0,0.3)" },
    button: { height: { default: 44, compact: 40, large: 48 } },
  });

  assert.equal(result.ok, true);
});

test("validateUiDesignTokens meldet fehlende Werte", () => {
  const result = validateUiDesignTokens({
    spacing: { xs: 4, sm: 8, md: 12, lg: 16 },
  });

  assert.equal(result.ok, false);
  assert.match(result.message, /spacing\.xl fehlt/);
});

test("readUiDesignTokens liest die Projektdatei", () => {
  const result = readUiDesignTokens(process.cwd());

  assert.equal(result.ok, true);
  assert.equal(result.tokens.meta.name, "provoware-ui-token-set-v1");
  assert.equal(result.tokens.button.height.default, 44);
});
