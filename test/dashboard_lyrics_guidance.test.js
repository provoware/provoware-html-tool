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
