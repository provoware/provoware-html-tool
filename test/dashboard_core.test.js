const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const {
  buildDashboardLaunchCommand,
  canUseGui,
  startDashboardMainModule,
} = require("../system-core/dashboard_core");

test("buildDashboardLaunchCommand liefert Linux-Befehl", () => {
  const result = buildDashboardLaunchCommand(
    "linux",
    "templates/dashboard.html",
  );

  assert.equal(result.command, "xdg-open");
  assert.deepEqual(result.args, ["templates/dashboard.html"]);
});

test("canUseGui ist false wenn Linux ohne Display", () => {
  const result = canUseGui("linux", {});
  assert.equal(result, false);
});

test("startDashboardMainModule ueberspringt im headless Modus", () => {
  const result = startDashboardMainModule({
    projectRoot: process.cwd(),
    platform: "linux",
    env: {},
  });

  assert.equal(result.ok, true);
  assert.equal(result.started, false);
  assert.match(result.message, /manuell oeffnen/);
});

test("startDashboardMainModule startet mit gueltigem Runner", () => {
  const calls = [];
  const result = startDashboardMainModule({
    projectRoot: process.cwd(),
    platform: "darwin",
    env: { DISPLAY: ":0" },
    runner(command, args) {
      calls.push({ command, args });
      return { status: 0 };
    },
    dashboardPath: path.join(process.cwd(), "templates", "dashboard.html"),
  });

  assert.equal(result.ok, true);
  assert.equal(result.started, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].command, "open");
});
