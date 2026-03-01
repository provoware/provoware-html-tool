const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

test("Modul-Control-Hinweise sind einheitlich und mit Rueckweg", () => {
  const scriptPath = path.join(
    process.cwd(),
    "templates",
    "module_workspace.js",
  );
  const source = fs.readFileSync(scriptPath, "utf8");
  const context = {
    window: {},
    document: {},
    console,
  };
  vm.createContext(context);
  vm.runInContext(source, context);

  const getHint = context.window.getModuleWorkspaceControlHint;
  assert.equal(typeof getHint, "function");

  const maximizeHint = getHint("maximize", false);
  const normalizeHint = getHint("maximize", true);
  const hideHint = getHint("hide", false);
  const pinHint = getHint("pin", false);

  assert.match(maximizeHint, /Groesser anzeigen/);
  assert.match(normalizeHint, /Normalgroesse waehlen/);
  assert.match(maximizeHint, /Rueckweg/);
  assert.match(hideHint, /Katalog erneut aktivieren/);
  assert.match(pinHint, /Oben anheften/);
});
