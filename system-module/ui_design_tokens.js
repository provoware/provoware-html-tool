const fs = require("node:fs");
const path = require("node:path");

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function validateScale(input, expectedKeys, name) {
  if (!isObject(input)) {
    return {
      ok: false,
      message: `${name} fehlt. Naechster Schritt: Reparatur starten.`,
    };
  }

  const missing = expectedKeys.find((key) => !isNumber(input[key]));
  if (missing) {
    return {
      ok: false,
      message: `${name}.${missing} fehlt. Naechster Schritt: Erneut versuchen.`,
    };
  }

  return { ok: true, message: `${name} ist gueltig.` };
}

function validateUiDesignTokens(input) {
  if (!isObject(input)) {
    return {
      ok: false,
      message: "Token-Set fehlt. Naechster Schritt: Reparatur starten.",
    };
  }

  const spacing = validateScale(
    input.spacing,
    ["xs", "sm", "md", "lg", "xl"],
    "spacing",
  );
  if (!spacing.ok) {
    return spacing;
  }

  const radius = validateScale(
    input.radius,
    ["sm", "md", "lg", "xl"],
    "radius",
  );
  if (!radius.ok) {
    return radius;
  }

  const fontSize = validateScale(
    input.font?.size,
    ["sm", "md", "lg", "xl"],
    "font.size",
  );
  if (!fontSize.ok) {
    return fontSize;
  }

  const buttonHeight = validateScale(
    input.button?.height,
    ["default", "compact", "large"],
    "button.height",
  );
  if (!buttonHeight.ok) {
    return buttonHeight;
  }

  if (typeof input.shadow?.panel !== "string" || !input.shadow.panel.trim()) {
    return {
      ok: false,
      message: "shadow.panel fehlt. Naechster Schritt: Protokoll oeffnen.",
    };
  }

  return { ok: true, message: "UI-Token-Set ist gueltig." };
}

function readUiDesignTokens(projectRoot) {
  if (typeof projectRoot !== "string" || !projectRoot.trim()) {
    return {
      ok: false,
      message: "Projektpfad fehlt. Naechster Schritt: Erneut versuchen.",
      tokens: null,
    };
  }

  const filePath = path.join(projectRoot, "config", "ui_design_tokens.json");

  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);
    const validation = validateUiDesignTokens(parsed);

    if (!validation.ok) {
      return { ok: false, message: validation.message, tokens: parsed };
    }

    return { ok: true, message: "UI-Token-Set geladen.", tokens: parsed };
  } catch (error) {
    return {
      ok: false,
      message:
        "UI-Token-Set konnte nicht geladen werden. Naechster Schritt: Protokoll oeffnen.",
      tokens: null,
      error: String(error?.message || error),
    };
  }
}

module.exports = {
  validateUiDesignTokens,
  readUiDesignTokens,
};
