# INDEX.md

## Stand
- Aktualisiert: 2026-03-07
- Iterationsfokus: Robustheit/Sicherheit der UI-Ausgabe (Escaping für dynamische HTML-Listen)

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
- │  └─ minimal-check.sh
- ├─ tests
- │  ├─ adapters
- │  │  └─ desktop-filesystem.test.js
- │  ├─ services
- │  │  ├─ import-export-consistency.test.js
- │  │  ├─ module-registry.test.js
- │  │  ├─ project-selftest.test.js
- │  │  ├─ startup-check.test.js
- │  │  └─ ui-action-handlers.smoke.test.js
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
14. `data/laienstart-required-files.json`
15. `data/module-registry.json`
16. `data/profile-archive.json`
17. `data/project-structure.json`
18. `data/templates-archive.json`
19. `data/themes.json`
20. `data/ui_texts.json`
21. `datenbank_baukasten_start.html`
22. `debugging_modul_start.html`
23. `index.html`
24. `js/adapters/browser-filesystem.js`
25. `js/adapters/desktop-filesystem.js`
26. `js/adapters/filesystem-adapter.js`
27. `js/app.js`
28. `js/modules/dashboard-clock.js`
29. `js/modules/guide-tools-module.js`
30. `js/services/config-loader.js`
31. `js/services/diagnosis-export.js`
32. `js/services/logger.js`
33. `js/services/module-registry.js`
34. `js/services/profile-archive.js`
35. `js/services/project-selftest.js`
36. `js/services/startup-check.js`
37. `js/services/templates-archive.js`
38. `js/services/ui-action-handlers.js`
39. `js/state.js`
40. `js/status-visuals.js`
41. `js/ui.js`
42. `laienstart.html`
43. `logging_modul_start.html`
44. `modules/backup_funktions_modul/config.json`
45. `modules/backup_funktions_modul/logic.js`
46. `modules/backup_funktions_modul/manifest.json`
47. `modules/backup_funktions_modul/schema.json`
48. `modules/backup_funktions_modul/texts.json`
49. `modules/datenbank_baukasten/config.json`
50. `modules/datenbank_baukasten/logic.js`
51. `modules/datenbank_baukasten/manifest.json`
52. `modules/datenbank_baukasten/schema.json`
53. `modules/datenbank_baukasten/texts.json`
54. `modules/debugging_modul/config.json`
55. `modules/debugging_modul/logic.js`
56. `modules/debugging_modul/manifest.json`
57. `modules/debugging_modul/schema.json`
58. `modules/debugging_modul/texts.json`
59. `modules/logging_modul/config.json`
60. `modules/logging_modul/logic.js`
61. `modules/logging_modul/manifest.json`
62. `modules/logging_modul/schema.json`
63. `modules/logging_modul/texts.json`
64. `modules/todo_kalender_erinnerung/config.json`
65. `modules/todo_kalender_erinnerung/logic.js`
66. `modules/todo_kalender_erinnerung/manifest.json`
67. `modules/todo_kalender_erinnerung/schema.json`
68. `modules/todo_kalender_erinnerung/texts.json`
69. `modules/wiki_notiz_wissen/config.json`
70. `modules/wiki_notiz_wissen/logic.js`
71. `modules/wiki_notiz_wissen/manifest.json`
72. `modules/wiki_notiz_wissen/schema.json`
73. `modules/wiki_notiz_wissen/texts.json`
74. `scripts/minimal-check.sh`
75. `tests/adapters/desktop-filesystem.test.js`
76. `tests/services/import-export-consistency.test.js`
77. `tests/services/module-registry.test.js`
78. `tests/services/project-selftest.test.js`
79. `tests/services/startup-check.test.js`
80. `tests/services/ui-action-handlers.smoke.test.js`
81. `tests/start-files/start-import-resolution.test.js`
82. `todo.txt`
83. `todo_kalender_erinnerung_start.html`
84. `wiki_notiz_wissen_start.html`
