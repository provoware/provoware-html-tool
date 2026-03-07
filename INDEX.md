# INDEX.md

## Stand
- Aktualisiert: 2026-03-07
- Iterationsfokus: Selbsttest robust trennen (Ordner-Existenz getrennt vom Schreibtest)

## Verzeichnisbaum (ohne `.git`)
- ├─ assets/
- │  ├─ assets/css/
- │  │  └─ assets/css/base.css
- │  └─ assets/js/
- │     └─ assets/js/core.js
- ├─ css/
- │  └─ css/app.css
- ├─ data/
- │  ├─ data/dashboard3-notes/
- │  │  └─ data/dashboard3-notes/.gitkeep
- │  ├─ data/app-config.json
- │  ├─ data/laienstart-required-files.json
- │  ├─ data/module-registry.json
- │  ├─ data/profile-archive.json
- │  ├─ data/project-structure.json
- │  ├─ data/templates-archive.json
- │  ├─ data/themes.json
- │  └─ data/ui_texts.json
- ├─ js/
- │  ├─ js/adapters/
- │  │  ├─ js/adapters/browser-filesystem.js
- │  │  ├─ js/adapters/desktop-filesystem.js
- │  │  └─ js/adapters/filesystem-adapter.js
- │  ├─ js/modules/
- │  │  ├─ js/modules/dashboard-clock.js
- │  │  └─ js/modules/guide-tools-module.js
- │  ├─ js/services/
- │  │  ├─ js/services/config-loader.js
- │  │  ├─ js/services/diagnosis-export.js
- │  │  ├─ js/services/logger.js
- │  │  ├─ js/services/module-registry.js
- │  │  ├─ js/services/profile-archive.js
- │  │  ├─ js/services/project-selftest.js
- │  │  ├─ js/services/startup-check.js
- │  │  ├─ js/services/templates-archive.js
- │  │  └─ js/services/ui-action-handlers.js
- │  ├─ js/app.js
- │  ├─ js/state.js
- │  ├─ js/status-visuals.js
- │  └─ js/ui.js
- ├─ modules/
- │  ├─ modules/backup_funktions_modul/
- │  │  ├─ modules/backup_funktions_modul/config.json
- │  │  ├─ modules/backup_funktions_modul/logic.js
- │  │  ├─ modules/backup_funktions_modul/manifest.json
- │  │  ├─ modules/backup_funktions_modul/schema.json
- │  │  └─ modules/backup_funktions_modul/texts.json
- │  ├─ modules/datenbank_baukasten/
- │  │  ├─ modules/datenbank_baukasten/config.json
- │  │  ├─ modules/datenbank_baukasten/logic.js
- │  │  ├─ modules/datenbank_baukasten/manifest.json
- │  │  ├─ modules/datenbank_baukasten/schema.json
- │  │  └─ modules/datenbank_baukasten/texts.json
- │  ├─ modules/debugging_modul/
- │  │  ├─ modules/debugging_modul/config.json
- │  │  ├─ modules/debugging_modul/logic.js
- │  │  ├─ modules/debugging_modul/manifest.json
- │  │  ├─ modules/debugging_modul/schema.json
- │  │  └─ modules/debugging_modul/texts.json
- │  ├─ modules/logging_modul/
- │  │  ├─ modules/logging_modul/config.json
- │  │  ├─ modules/logging_modul/logic.js
- │  │  ├─ modules/logging_modul/manifest.json
- │  │  ├─ modules/logging_modul/schema.json
- │  │  └─ modules/logging_modul/texts.json
- │  ├─ modules/todo_kalender_erinnerung/
- │  │  ├─ modules/todo_kalender_erinnerung/config.json
- │  │  ├─ modules/todo_kalender_erinnerung/logic.js
- │  │  ├─ modules/todo_kalender_erinnerung/manifest.json
- │  │  ├─ modules/todo_kalender_erinnerung/schema.json
- │  │  └─ modules/todo_kalender_erinnerung/texts.json
- │  └─ modules/wiki_notiz_wissen/
- │     ├─ modules/wiki_notiz_wissen/config.json
- │     ├─ modules/wiki_notiz_wissen/logic.js
- │     ├─ modules/wiki_notiz_wissen/manifest.json
- │     ├─ modules/wiki_notiz_wissen/schema.json
- │     └─ modules/wiki_notiz_wissen/texts.json
- ├─ tests/
- │  ├─ tests/services/
- │  │  ├─ tests/services/module-registry.test.js
- │  │  ├─ tests/services/project-selftest.test.js
- │  │  └─ tests/services/ui-action-handlers.smoke.test.js
- │  └─ tests/start-files/
- │     └─ tests/start-files/start-import-resolution.test.js
- ├─ AGENTS.md
- ├─ backup_funktions_modul_start.html
- ├─ datenbank_baukasten_start.html
- ├─ debugging_modul_start.html
- ├─ index.html
- ├─ INDEX.md
- ├─ laienstart.html
- ├─ logging_modul_start.html
- ├─ README.md
- ├─ todo.txt
- ├─ todo_kalender_erinnerung_start.html
- ├─ TOOL_TUTORIAL.md
- └─ wiki_notiz_wissen_start.html

## Vollständige Dateiliste (ohne `.git`)
1. `AGENTS.md`
2. `assets/css/base.css`
3. `assets/js/core.js`
4. `backup_funktions_modul_start.html`
5. `css/app.css`
6. `data/app-config.json`
7. `data/dashboard3-notes/.gitkeep`
8. `data/laienstart-required-files.json`
9. `data/module-registry.json`
10. `data/profile-archive.json`
11. `data/project-structure.json`
12. `data/templates-archive.json`
13. `data/themes.json`
14. `data/ui_texts.json`
15. `datenbank_baukasten_start.html`
16. `debugging_modul_start.html`
17. `index.html`
18. `INDEX.md`
19. `js/adapters/browser-filesystem.js`
20. `js/adapters/desktop-filesystem.js`
21. `js/adapters/filesystem-adapter.js`
22. `js/app.js`
23. `js/modules/dashboard-clock.js`
24. `js/modules/guide-tools-module.js`
25. `js/services/config-loader.js`
26. `js/services/diagnosis-export.js`
27. `js/services/logger.js`
28. `js/services/module-registry.js`
29. `js/services/profile-archive.js`
30. `js/services/project-selftest.js`
31. `js/services/startup-check.js`
32. `js/services/templates-archive.js`
33. `js/services/ui-action-handlers.js`
34. `js/state.js`
35. `js/status-visuals.js`
36. `js/ui.js`
37. `laienstart.html`
38. `logging_modul_start.html`
39. `modules/backup_funktions_modul/config.json`
40. `modules/backup_funktions_modul/logic.js`
41. `modules/backup_funktions_modul/manifest.json`
42. `modules/backup_funktions_modul/schema.json`
43. `modules/backup_funktions_modul/texts.json`
44. `modules/datenbank_baukasten/config.json`
45. `modules/datenbank_baukasten/logic.js`
46. `modules/datenbank_baukasten/manifest.json`
47. `modules/datenbank_baukasten/schema.json`
48. `modules/datenbank_baukasten/texts.json`
49. `modules/debugging_modul/config.json`
50. `modules/debugging_modul/logic.js`
51. `modules/debugging_modul/manifest.json`
52. `modules/debugging_modul/schema.json`
53. `modules/debugging_modul/texts.json`
54. `modules/logging_modul/config.json`
55. `modules/logging_modul/logic.js`
56. `modules/logging_modul/manifest.json`
57. `modules/logging_modul/schema.json`
58. `modules/logging_modul/texts.json`
59. `modules/todo_kalender_erinnerung/config.json`
60. `modules/todo_kalender_erinnerung/logic.js`
61. `modules/todo_kalender_erinnerung/manifest.json`
62. `modules/todo_kalender_erinnerung/schema.json`
63. `modules/todo_kalender_erinnerung/texts.json`
64. `modules/wiki_notiz_wissen/config.json`
65. `modules/wiki_notiz_wissen/logic.js`
66. `modules/wiki_notiz_wissen/manifest.json`
67. `modules/wiki_notiz_wissen/schema.json`
68. `modules/wiki_notiz_wissen/texts.json`
69. `README.md`
70. `tests/services/module-registry.test.js`
71. `tests/services/project-selftest.test.js`
72. `tests/services/ui-action-handlers.smoke.test.js`
73. `tests/start-files/start-import-resolution.test.js`
74. `todo.txt`
75. `todo_kalender_erinnerung_start.html`
76. `TOOL_TUTORIAL.md`
77. `wiki_notiz_wissen_start.html`
