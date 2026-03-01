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

test("Dashboard-Songtextbereich bietet 1-Klick-Zufallsinhalt", () => {
  const dashboardHtml = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.html"),
    "utf8",
  );

  assert.match(dashboardHtml, /id="lyrics-template-random"/);
  assert.match(dashboardHtml, /Zufallsinhalt einfuegen \(1 Klick\)/);
});

test("Dashboard-Lesemodus nennt Ruecksprung zum Titel-Feld", () => {
  const dashboardHtml = fs.readFileSync(
    path.join(process.cwd(), "templates", "dashboard.html"),
    "utf8",
  );

  assert.match(dashboardHtml, /Fokus auf das Titel-Feld/);
});
