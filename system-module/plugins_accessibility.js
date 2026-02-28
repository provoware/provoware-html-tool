function assertObject(value, name) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${name} ist ungueltig. Bitte erneut versuchen.`);
  }
}

function activate(context) {
  assertObject(context, "Plugin-Kontext");

  const output = {
    ok: true,
    message: "A11y-Plugin aktiv. Fokus, Kontrast und Texte sind bereit.",
    pluginId: "plugin-a11y-assist",
  };

  if (typeof output.ok !== "boolean" || typeof output.message !== "string") {
    throw new Error(
      "Plugin-Ergebnis ist ungueltig. Protokoll oeffnen und erneut versuchen.",
    );
  }

  return output;
}

module.exports = {
  activate,
};
