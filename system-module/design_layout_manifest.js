const fs = require("node:fs");
const path = require("node:path");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateThemeList(themes) {
  if (!Array.isArray(themes) || themes.length < 4) {
    return {
      ok: false,
      message: "Theme-Liste ungueltig. Naechster Schritt: Reparatur starten.",
    };
  }

  const invalidTheme = themes.find(
    (theme) =>
      !theme ||
      !isNonEmptyString(theme.id) ||
      !isNonEmptyString(theme.label) ||
      !isNonEmptyString(theme.contrastTarget),
  );

  if (invalidTheme) {
    return {
      ok: false,
      message:
        "Theme-Eintrag unvollstaendig. Naechster Schritt: Protokoll oeffnen.",
    };
  }

  return { ok: true, message: "Theme-Liste gueltig." };
}

function validateCardProfiles(cardProfiles) {
  if (!Array.isArray(cardProfiles) || cardProfiles.length < 4) {
    return {
      ok: false,
      message: "Kartenprofile fehlen. Naechster Schritt: Reparatur starten.",
    };
  }

  const invalidProfile = cardProfiles.find(
    (profile) =>
      !profile ||
      !isNonEmptyString(profile.id) ||
      !isNonEmptyString(profile.tokenPrefix) ||
      !isNonEmptyString(profile.purpose),
  );

  if (invalidProfile) {
    return {
      ok: false,
      message:
        "Kartenprofil unvollstaendig. Naechster Schritt: Protokoll oeffnen.",
    };
  }

  return { ok: true, message: "Kartenprofile gueltig." };
}

function validateDesignLayoutManifest(input) {
  if (!input || typeof input !== "object") {
    return {
      ok: false,
      message:
        "Manifest fehlt oder ist ungueltig. Naechster Schritt: Erneut versuchen.",
    };
  }

  const hasMeta = isNonEmptyString(input.meta?.name);
  const hasLayout = isNonEmptyString(input.layout?.shell?.type);
  const hasStatusRule = isNonEmptyString(input.visual?.statusRule);
  const themeValidation = validateThemeList(input.themes);
  const cardProfileValidation = validateCardProfiles(
    input.visual?.cardProfiles,
  );

  if (
    !hasMeta ||
    !hasLayout ||
    !hasStatusRule ||
    !themeValidation.ok ||
    !cardProfileValidation.ok
  ) {
    return {
      ok: false,
      message:
        "Manifest ist unvollstaendig. Naechster Schritt: Reparatur starten.",
    };
  }

  return { ok: true, message: "Layout-Manifest ist vollstaendig." };
}

function readDesignLayoutManifest(projectRoot) {
  if (!isNonEmptyString(projectRoot)) {
    return {
      ok: false,
      message: "Projektpfad fehlt. Naechster Schritt: Erneut versuchen.",
      manifest: null,
    };
  }

  const filePath = path.join(
    projectRoot,
    "config",
    "design_layout_manifest.json",
  );
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);
    const validation = validateDesignLayoutManifest(parsed);

    if (!validation.ok) {
      return {
        ok: false,
        message: validation.message,
        manifest: parsed,
      };
    }

    return {
      ok: true,
      message: "Layout-Manifest geladen.",
      manifest: parsed,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        "Layout-Manifest konnte nicht geladen werden. Naechster Schritt: Protokoll oeffnen.",
      manifest: null,
      error: String(error?.message || error),
    };
  }
}

module.exports = {
  validateDesignLayoutManifest,
  readDesignLayoutManifest,
  validateThemeList,
  validateCardProfiles,
};
