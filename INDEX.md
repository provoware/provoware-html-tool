# INDEX.md

## Stand
- Aktualisiert: 2026-03-07
- Iterationsfokus: Shell-Laienstart mit JSON-gesteuerter Dependency-Prüfung und Dry-Run-Self-Repair-Test

## Verzeichnisbaum (ohne `.git`)
- ├─ .github
- │  └─ workflows
- │     ├─ ci.yml
- │     ├─ codeql.yml
- │     └─ lint.yml
- ├─ assets
- │  ├─ css
- │  │  └─ base.css
- │  └─ js
- │     └─ core.js
- ├─ css
- │  └─ app.css
- ├─ data
- │  ├─ dashboard3-notes
- │  │  └─ .gitkeep
- │  ├─ app-config.json
- │  ├─ laienstart-autofix-defaults.json
- │  ├─ laienstart-dependency-map.json
- │  ├─ laienstart-required-files.json
- │  ├─ module-registry.json
- │  ├─ profile-archive.json
- │  ├─ project-structure.json
- │  ├─ templates-archive.json
- │  ├─ themes.json
- │  └─ ui_texts.json
- ├─ js
- │  ├─ adapters
- │  │  ├─ browser-filesystem.js
- │  │  ├─ desktop-filesystem.js
- │  │  └─ filesystem-adapter.js
- │  ├─ modules
- │  │  ├─ dashboard-clock.js
- │  │  └─ guide-tools-module.js
- │  ├─ services
- │  │  ├─ config-loader.js
- │  │  ├─ diagnosis-export.js
- │  │  ├─ html-escape.js
- │  │  ├─ logger.js
- │  │  ├─ module-registry.js
- │  │  ├─ profile-archive.js
- │  │  ├─ project-selftest.js
- │  │  ├─ startup-check.js
- │  │  ├─ templates-archive.js
- │  │  └─ ui-action-handlers.js
- │  ├─ app.js
- │  ├─ state.js
- │  ├─ status-visuals.js
- │  └─ ui.js
- ├─ modules
- │  ├─ backup_funktions_modul
- │  │  ├─ config.json
- │  │  ├─ logic.js
- │  │  ├─ manifest.json
- │  │  ├─ schema.json
- │  │  └─ texts.json
- │  ├─ datenbank_baukasten
- │  │  ├─ config.json
- │  │  ├─ logic.js
- │  │  ├─ manifest.json
- │  │  ├─ schema.json
- │  │  └─ texts.json
- │  ├─ debugging_modul
- │  │  ├─ config.json
- │  │  ├─ logic.js
- │  │  ├─ manifest.json
- │  │  ├─ schema.json
- │  │  └─ texts.json
- │  ├─ logging_modul
- │  │  ├─ config.json
- │  │  ├─ logic.js
- │  │  ├─ manifest.json
- │  │  ├─ schema.json
- │  │  └─ texts.json
- │  ├─ todo_kalender_erinnerung
- │  │  ├─ config.json
- │  │  ├─ logic.js
- │  │  ├─ manifest.json
- │  │  ├─ schema.json
- │  │  └─ texts.json
- │  └─ wiki_notiz_wissen
- │     ├─ config.json
- │     ├─ logic.js
- │     ├─ manifest.json
- │     ├─ schema.json
- │     └─ texts.json
- ├─ scripts
- │  ├─ laienstart.sh
- │  └─ minimal-check.sh
- ├─ tests
- │  ├─ scripts-laienstart.dry-run.test.js
- │  ├─ adapters
- │  │  └─ desktop-filesystem.test.js
- │  ├─ services
- │  │  ├─ import-export-consistency.test.js
- │  │  ├─ module-registry.test.js
- │  │  ├─ project-selftest.test.js
- │  │  ├─ startup-check.test.js
- │  │  ├─ ui-action-handlers.smoke.test.js
- │  │  └─ ui-render-safety.test.js
- │  └─ start-files
- │     └─ start-import-resolution.test.js
- ├─ AGENTS.md
- ├─ INDEX.md
- ├─ README.md
- ├─ TOOL_TUTORIAL.md
- ├─ backup_funktions_modul_start.html
- ├─ datenbank_baukasten_start.html
- ├─ debugging_modul_start.html
- ├─ index.html
- ├─ laienstart.html
- ├─ logging_modul_start.html
- ├─ todo.txt
- ├─ todo_kalender_erinnerung_start.html
- └─ wiki_notiz_wissen_start.html

## Vollständige Dateiliste (ohne `.git`)

1. `.github/workflows/ci.yml`
2. `.github/workflows/codeql.yml`
3. `.github/workflows/lint.yml`
4. `AGENTS.md`
5. `INDEX.md`
6. `README.md`
7. `TOOL_TUTORIAL.md`
8. `assets/css/base.css`
9. `assets/js/core.js`
10. `backup_funktions_modul_start.html`
11. `css/app.css`
12. `data/app-config.json`
13. `data/dashboard3-notes/.gitkeep`
14. `data/laienstart-autofix-defaults.json`
15. `data/laienstart-dependency-map.json`
16. `data/laienstart-required-files.json`
17. `data/module-registry.json`
18. `data/profile-archive.json`
19. `data/project-structure.json`
20. `data/templates-archive.json`
21. `data/themes.json`
22. `data/ui_texts.json`
23. `datenbank_baukasten_start.html`
24. `debugging_modul_start.html`
25. `index.html`
26. `js/adapters/browser-filesystem.js`
27. `js/adapters/desktop-filesystem.js`
28. `js/adapters/filesystem-adapter.js`
29. `js/app.js`
30. `js/modules/dashboard-clock.js`
31. `js/modules/guide-tools-module.js`
32. `js/services/config-loader.js`
33. `js/services/diagnosis-export.js`
34. `js/services/html-escape.js`
35. `js/services/logger.js`
36. `js/services/module-registry.js`
37. `js/services/profile-archive.js`
38. `js/services/project-selftest.js`
39. `js/services/startup-check.js`
40. `js/services/templates-archive.js`
41. `js/services/ui-action-handlers.js`
42. `js/state.js`
43. `js/status-visuals.js`
44. `js/ui.js`
45. `laienstart.html`
46. `logging_modul_start.html`
47. `modules/backup_funktions_modul/config.json`
48. `modules/backup_funktions_modul/logic.js`
49. `modules/backup_funktions_modul/manifest.json`
50. `modules/backup_funktions_modul/schema.json`
51. `modules/backup_funktions_modul/texts.json`
52. `modules/datenbank_baukasten/config.json`
53. `modules/datenbank_baukasten/logic.js`
54. `modules/datenbank_baukasten/manifest.json`
55. `modules/datenbank_baukasten/schema.json`
56. `modules/datenbank_baukasten/texts.json`
57. `modules/debugging_modul/config.json`
58. `modules/debugging_modul/logic.js`
59. `modules/debugging_modul/manifest.json`
60. `modules/debugging_modul/schema.json`
61. `modules/debugging_modul/texts.json`
62. `modules/logging_modul/config.json`
63. `modules/logging_modul/logic.js`
64. `modules/logging_modul/manifest.json`
65. `modules/logging_modul/schema.json`
66. `modules/logging_modul/texts.json`
67. `modules/todo_kalender_erinnerung/config.json`
68. `modules/todo_kalender_erinnerung/logic.js`
69. `modules/todo_kalender_erinnerung/manifest.json`
70. `modules/todo_kalender_erinnerung/schema.json`
71. `modules/todo_kalender_erinnerung/texts.json`
72. `modules/wiki_notiz_wissen/config.json`
73. `modules/wiki_notiz_wissen/logic.js`
74. `modules/wiki_notiz_wissen/manifest.json`
75. `modules/wiki_notiz_wissen/schema.json`
76. `modules/wiki_notiz_wissen/texts.json`
77. `scripts/laienstart.sh`
78. `scripts/minimal-check.sh`
79. `tests/adapters/desktop-filesystem.test.js`
80. `tests/services/import-export-consistency.test.js`
81. `tests/services/module-registry.test.js`
82. `tests/services/project-selftest.test.js`
83. `tests/services/startup-check.test.js`
84. `tests/services/ui-action-handlers.smoke.test.js`
85. `tests/services/ui-render-safety.test.js`
86. `tests/scripts-laienstart.dry-run.test.js`
87. `tests/start-files/start-import-resolution.test.js`
88. `todo.txt`
89. `todo_kalender_erinnerung_start.html`
90. `wiki_notiz_wissen_start.html`
