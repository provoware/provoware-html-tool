const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

function assertText(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `${label} fehlt. Bitte Eingabe pruefen und erneut versuchen.`,
    );
  }
}

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(
      `${label} ist ungueltig. Bitte Eingabe pruefen und erneut versuchen.`,
    );
  }
}

function buildDashboardLaunchCommand(platform, dashboardPath) {
  assertText(platform, "Plattform");
  assertText(dashboardPath, "Dashboard-Pfad");

  if (platform === "win32") {
    return {
      command: "cmd",
      args: ["/c", "start", "", dashboardPath],
    };
  }

  if (platform === "darwin") {
    return {
      command: "open",
      args: [dashboardPath],
    };
  }

  return {
    command: "xdg-open",
    args: [dashboardPath],
  };
}

function canUseGui(platform, env) {
  assertText(platform, "Plattform");
  assertObject(env, "Umgebung");

  if (platform !== "linux") {
    return true;
  }

  return Boolean(env.DISPLAY || env.WAYLAND_DISPLAY);
}

function startDashboardMainModule(options = {}) {
  assertObject(options, "Optionen");

  const projectRoot = options.projectRoot || process.cwd();
  const dashboardPath =
    options.dashboardPath ||
    path.join(projectRoot, "templates", "dashboard.html");
  const platform = options.platform || process.platform;
  const env = options.env || process.env;
  const runner = options.runner || spawnSync;

  assertText(projectRoot, "Projektpfad");
  assertText(dashboardPath, "Dashboard-Pfad");
  assertText(platform, "Plattform");
  assertObject(env, "Umgebung");

  if (!fs.existsSync(dashboardPath)) {
    throw new Error(
      "Dashboard-Datei fehlt. Reparatur starten oder Protokoll oeffnen.",
    );
  }

  if (!canUseGui(platform, env)) {
    return {
      ok: true,
      started: false,
      message:
        "Dashboard-Autostart uebersprungen (kein Grafikmodus). Naechster Schritt: dashboard.html manuell oeffnen.",
    };
  }

  const launch = buildDashboardLaunchCommand(platform, dashboardPath);
  const result = runner(launch.command, launch.args, {
    stdio: "ignore",
    detached: true,
    shell: false,
  });

  if (result.status !== 0) {
    throw new Error(
      "Dashboard konnte nicht automatisch starten. Erneut versuchen oder Protokoll oeffnen.",
    );
  }

  return {
    ok: true,
    started: true,
    message: "Dashboard-Haupt-Kern-Modul wurde automatisch gestartet.",
  };
}

module.exports = {
  buildDashboardLaunchCommand,
  canUseGui,
  startDashboardMainModule,
};
