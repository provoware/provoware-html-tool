const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("Dashboard-Songtextbereich zeigt Enter/Space-Hinweis am Kopieren-Knopf", () => {
  const dashboardHtml = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.html"),
    "utf8",
  );

  assert.match(dashboardHtml, /Songtext kopieren \(Enter\/Space\)/);
});

test("Dashboard-Songtext-Kurzguide nennt Speichern plus Rueckweg", () => {
  const dashboardHtml = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.html"),
    "utf8",
  );

  assert.match(dashboardHtml, /Speichern sichert den Entwurf\. Rueckweg:/);
  assert.match(dashboardHtml, /Escape schliesst die Vorschau\./);
  assert.match(dashboardHtml, /id="lyrics-guide-steps"/);
});

test("Dashboard-Songtextbereich bietet Profilfilter und 1-Klick-Zufallsinhalt", () => {
  const dashboardHtml = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.html"),
    "utf8",
  );

  assert.match(dashboardHtml, /id="lyrics-random-profile"/);
  assert.match(dashboardHtml, /<option value="techno">Techno<\/option>/);
  assert.match(dashboardHtml, /id="lyrics-template-random"/);
  assert.match(dashboardHtml, /Zufallsinhalt einfuegen \(1 Klick\)/);
});

test("Dashboard-Lesemodus bietet Fokusziel-Auswahl", () => {
  const dashboardHtml = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.html"),
    "utf8",
  );

  assert.match(dashboardHtml, /id="lyrics-preview-focus-target"/);
  assert.match(dashboardHtml, /value="content">Inhaltsfeld/);
  assert.match(dashboardHtml, /Alt\+T setzt Titel-Feld/);
  assert.match(dashboardHtml, /Alt\+I setzt\s+Inhaltsfeld/);
});

test("Dashboard-Songtextbereich zeigt Profil-Status-Chip", () => {
  const dashboardHtml = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.html"),
    "utf8",
  );

  assert.match(dashboardHtml, /id="lyrics-random-profile-chip"/);
  assert.match(dashboardHtml, /Aktives Profil: Standard\./);
  assert.match(dashboardHtml, /Letzte Nutzung: noch keine\./);
});

test("Dashboard-Lesemodus hat Inline-Hilfe fuer Fokusziel", () => {
  const dashboardHtml = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.html"),
    "utf8",
  );

  assert.match(dashboardHtml, /id="lyrics-preview-focus-inline-help"/);
  assert.match(dashboardHtml, /Fokusziel beim Oeffnen: Titel-Feld\./);
});

test("Dashboard-Songtextbereich bietet Kategorie-Auswahl fuer Zufallsinhalt", () => {
  const dashboardHtml = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.html"),
    "utf8",
  );

  assert.match(dashboardHtml, /id="lyrics-random-genre-toggle"/);
  assert.match(dashboardHtml, /id="lyrics-random-mood-toggle"/);
  assert.match(dashboardHtml, /id="lyrics-random-style-toggle"/);
  assert.match(dashboardHtml, /id="lyrics-random-category-help"/);
});

test("Dashboard bietet Favoritenleiste und unteren Modulbereich", () => {
  const dashboardHtml = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.html"),
    "utf8",
  );

  assert.match(dashboardHtml, /id="favorites-rail-toggle"/);
  assert.match(dashboardHtml, /id="favorites-rail"/);
  assert.match(dashboardHtml, /id="module-options-region"/);
  assert.match(dashboardHtml, /id="module-options-help"/);
});

test("Dashboard-Hilfe zeigt Safe-Mode-Status und Versions-Restore", () => {
  const dashboardHtml = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.html"),
    "utf8",
  );

  assert.match(dashboardHtml, /id="safe-mode-status"/);
  assert.match(dashboardHtml, /id="backup-version-select"/);
  assert.match(dashboardHtml, /id="backup-version-compare"/);
  assert.match(dashboardHtml, /id="backup-restore-version"/);
  assert.match(dashboardHtml, /id="help-safe-mode-reset"/);
  assert.match(dashboardHtml, /id="support-history-query"/);
  assert.match(dashboardHtml, /Freitextsuche \(Typ\/Datum\)/);
  assert.match(dashboardHtml, /id="boot-focus-live"/);
  assert.match(dashboardHtml, /Fokusziel aktuell: Erstes Modul\./);
  assert.match(dashboardHtml, /id="support-history-meta"/);
  assert.match(dashboardHtml, /Enter startet die Suche sofort\./);
});

test("Backup-Detailmodus startet eingeklappt", () => {
  const dashboardHtml = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.html"),
    "utf8",
  );

  assert.match(dashboardHtml, /<details id="backup-compare-detail" hidden>/);
});

test("Support-Verlauf nutzt Tastatur-Hinweis je Treffer", () => {
  const dashboardJs = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.js"),
    "utf8",
  );

  assert.match(
    dashboardJs,
    /Tastatur-Hinweis: Tab waehlt Eintrag, Enter oeffnet Aktion, Escape schliesst Dialog\./,
  );
  assert.match(
    dashboardJs,
    /Tastatur-Hinweis kurz: Tab waehlt, Enter startet, Escape schliesst\./,
  );
  assert.match(
    dashboardJs,
    /backupCompareDetailWrap\.open = layoutState\.backupDetailOpen === true/,
  );
});

test("Backup-Detailmodus zeigt zuletzt geoeffneten Zustand", () => {
  const dashboardHtml = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.html"),
    "utf8",
  );
  const dashboardJs = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.js"),
    "utf8",
  );

  assert.match(dashboardHtml, /id="backup-detail-state"/);
  assert.match(
    dashboardJs,
    /Zuletzt geoeffneter Zustand: Detailmodus ist geoeffnet\./,
  );
  assert.match(
    dashboardJs,
    /Zuletzt geoeffneter Zustand: Detailmodus ist eingeklappt\./,
  );
});

test("Boot-Live-Ansage wird in Debug-Protokoll gespiegelt", () => {
  const dashboardJs = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.js"),
    "utf8",
  );

  assert.match(dashboardJs, /Debug: Boot-Live-Ansage aktualisiert/);
});

test("Support-Verlauf markiert Suchwort mit Text-Hervorhebung", () => {
  const dashboardCss = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.css"),
    "utf8",
  );
  const dashboardJs = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.js"),
    "utf8",
  );

  assert.match(dashboardCss, /#support-history-list mark/);
  assert.match(dashboardJs, /highlightQueryText/);
  assert.match(dashboardJs, /appendHighlightedText/);
  assert.match(dashboardJs, /splitSearchTokens/);
  assert.match(dashboardJs, /queryTokens\.every/);
});

test("Boot-Debug erscheint als eigener Hilfe-Eintrag", () => {
  const dashboardJs = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.js"),
    "utf8",
  );

  assert.match(dashboardJs, /kind: "boot-debug"/);
  assert.match(dashboardJs, /details: lastBootFocusDebugText/);
});

test("Boot-Debug-Schalter ist im Hilfe-Panel verfuegbar", () => {
  const dashboardHtml = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.html"),
    "utf8",
  );
  const dashboardJs = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.js"),
    "utf8",
  );

  assert.match(dashboardHtml, /id="support-history-boot-debug-toggle"/);
  assert.match(dashboardJs, /showBootDebugInSupport/);
  assert.match(
    dashboardJs,
    /Boot-Debug-Schalter konnte nicht gespeichert werden\./,
  );
});

test("Restore-Hinweis erklaert gespeicherten Detailzustand", () => {
  const dashboardHtml = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.html"),
    "utf8",
  );

  assert.match(
    dashboardHtml,
    /Dieser Zustand wird pro\s+Projekt gespeichert und bei Restore wieder geladen\./,
  );
  assert.match(
    dashboardHtml,
    /Beispiel:\s+Wenn Detailmodus zuletzt eingeklappt\s+war, startet er auch nach\s+Restore eingeklappt\./,
  );
});

test("Support-Verlauf bietet optionalen Teilwortmodus und Footer-Hinweis", () => {
  const dashboardHtml = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.html"),
    "utf8",
  );
  const dashboardJs = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.js"),
    "utf8",
  );
  const dashboardCss = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.css"),
    "utf8",
  );

  assert.match(dashboardHtml, /id="support-history-partial-toggle"/);
  assert.match(dashboardHtml, /id="support-history-footer-hint"/);
  assert.match(dashboardHtml, /id="support-history-footer-toggle"/);
  assert.match(dashboardHtml, /id="support-history-sort-short-toggle"/);
  assert.match(dashboardHtml, /id="support-history-live"/);
  assert.match(dashboardJs, /supportHistoryPartialMode/);
  assert.match(dashboardJs, /supportHistoryFooterCompact/);
  assert.match(dashboardJs, /supportHistorySortShortTokens/);
  assert.match(dashboardJs, /isSortIgnoredShortTokensEnabled/);
  assert.match(dashboardJs, /localeCompare\(right, "de"/);
  assert.match(dashboardJs, /announceSupportFooterAutoCompactChange/);
  assert.match(dashboardJs, /Auto-Kurzmodus ist aktiv/);
  assert.match(dashboardJs, /isVerySmallViewportForSupportBadge/);
  assert.match(dashboardJs, /\? "TW"/);
  assert.match(dashboardJs, /"GW"/);
  assert.match(dashboardJs, /aria-label/);
  assert.match(dashboardJs, /Suchmodus Teilwort aktiv/);
  assert.match(dashboardJs, /min\. 3 Zeichen/);
  assert.match(
    dashboardJs,
    /Kurze Suchbegriffe ignoriert \(unter 3 Zeichen\):/,
  );
  assert.match(dashboardJs, /\.slice\(0, 3\)/);
  assert.match(dashboardJs, /support-mode-badge/);
  assert.match(dashboardJs, /support-mode-badge-icon/);
  assert.match(dashboardJs, /className = "sr-only"/);
  assert.match(dashboardCss, /\.sr-only/);
  assert.match(dashboardJs, /shouldAutoCompactSupportFooter/);
  assert.match(dashboardJs, /Auto-Kurzmodus aktiv unter 640px/);
  assert.match(
    dashboardJs,
    /supportHistoryFooterToggle\.disabled = autoCompact/,
  );
  assert.match(dashboardJs, /Ganzwortsuche aktiv/);
});
