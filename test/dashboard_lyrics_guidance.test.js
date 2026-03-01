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
