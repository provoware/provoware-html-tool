# INDEX.md

## Kompletter aktueller Verzeichnisbaum

- Stand dieser Übersicht: Iteration mit Design-Mini-Feinschliff (Schnellaktionen als farbige Glas-Chips).

```
.
├─ .github
│  └─ workflows
│     ├─ ci.yml
│     ├─ codeql.yml
│     └─ lint.yml
├─ assets
│  ├─ css
│  │  └─ base.css
│  └─ js
│     └─ core.js
├─ css
│  └─ app.css
├─ data
│  ├─ dashboard3-notes
│  │  └─ .gitkeep
│  ├─ app-config.json
│  ├─ laienstart-autofix-defaults.json
│  ├─ laienstart-dependency-map.json
│  ├─ laienstart-required-files.json
│  ├─ module-registry.json
│  ├─ profile-archive.json
│  ├─ project-structure.json
│  ├─ templates-archive.json
│  ├─ themes.json
│  └─ ui_texts.json
├─ js
│  ├─ adapters
│  │  ├─ browser-filesystem.js
│  │  ├─ desktop-filesystem.js
│  │  └─ filesystem-adapter.js
│  ├─ modules
│  │  ├─ dashboard-clock.js
│  │  ├─ guide-tools-module.js
│  │  └─ plugin-manager.js
│  ├─ services
│  │  ├─ code-formatter.js
│  │  ├─ config-loader.js
│  │  ├─ diagnosis-export.js
│  │  ├─ html-escape.js
│  │  ├─ logger.js
│  │  ├─ module-registry.js
│  │  ├─ profile-archive.js
│  │  ├─ project-selftest.js
│  │  ├─ startup-check.js
│  │  ├─ templates-archive.js
│  │  └─ ui-action-handlers.js
│  ├─ app.js
│  ├─ state.js
│  ├─ status-visuals.js
│  └─ ui.js
├─ modules
│  ├─ backup_funktions_modul
│  │  ├─ config.json
│  │  ├─ logic.js
│  │  ├─ manifest.json
│  │  ├─ schema.json
│  │  └─ texts.json
│  ├─ datenbank_baukasten
│  │  ├─ config.json
│  │  ├─ logic.js
│  │  ├─ manifest.json
│  │  ├─ schema.json
│  │  └─ texts.json
│  ├─ debugging_modul
│  │  ├─ config.json
│  │  ├─ logic.js
│  │  ├─ manifest.json
│  │  ├─ schema.json
│  │  └─ texts.json
│  ├─ logging_modul
│  │  ├─ config.json
│  │  ├─ logic.js
│  │  ├─ manifest.json
│  │  ├─ schema.json
│  │  └─ texts.json
│  ├─ todo_kalender_erinnerung
│  │  ├─ config.json
│  │  ├─ logic.js
│  │  ├─ manifest.json
│  │  ├─ schema.json
│  │  └─ texts.json
│  └─ wiki_notiz_wissen
│     ├─ config.json
│     ├─ logic.js
│     ├─ manifest.json
│     ├─ schema.json
│     └─ texts.json
├─ scripts
│  ├─ laienstart.sh
│  └─ minimal-check.sh
├─ tests
│  ├─ adapters
│  │  └─ desktop-filesystem.test.js
│  ├─ modules
│  │  └─ datenbank-baukasten.test.js
│  ├─ services
│  │  ├─ import-export-consistency.test.js
│  │  ├─ module-registry.test.js
│  │  ├─ project-selftest.test.js
│  │  ├─ startup-check.test.js
│  │  ├─ ui-action-handlers.smoke.test.js
│  │  └─ ui-render-safety.test.js
│  ├─ start-files
│  │  └─ start-import-resolution.test.js
│  └─ scripts-laienstart.dry-run.test.js
├─ AGENTS.md
├─ DESIGN_VORLAGE.md
├─ INDEX.md
├─ README.md
├─ TOOL_TUTORIAL.md
├─ backup_funktions_modul_start.html
├─ datenbank_baukasten_start.html
├─ debugging_modul_start.html
├─ index.html
├─ logging_modul_start.html
├─ start.sh
├─ todo.txt
├─ todo_kalender_erinnerung_start.html
└─ wiki_notiz_wissen_start.html
```

## Vollständige Dateiliste (ohne `.git`)

1. `AGENTS.md`
2. `DESIGN_VORLAGE.md`
3. `INDEX.md`
4. `README.md`
5. `TOOL_TUTORIAL.md`
6. `backup_funktions_modul_start.html`
7. `datenbank_baukasten_start.html`
8. `debugging_modul_start.html`
9. `index.html`
10. `logging_modul_start.html`
11. `start.sh`
12. `todo.txt`
13. `todo_kalender_erinnerung_start.html`
14. `wiki_notiz_wissen_start.html`
15. `.github/workflows/ci.yml`
16. `.github/workflows/codeql.yml`
17. `.github/workflows/lint.yml`
18. `assets/css/base.css`
19. `assets/js/core.js`
20. `css/app.css`
21. `data/app-config.json`
22. `data/laienstart-autofix-defaults.json`
23. `data/laienstart-dependency-map.json`
24. `data/laienstart-required-files.json`
25. `data/module-registry.json`
26. `data/profile-archive.json`
27. `data/project-structure.json`
28. `data/templates-archive.json`
29. `data/themes.json`
30. `data/ui_texts.json`
31. `data/dashboard3-notes/.gitkeep`
32. `js/app.js`
33. `js/state.js`
34. `js/status-visuals.js`
35. `js/ui.js`
36. `js/adapters/browser-filesystem.js`
37. `js/adapters/desktop-filesystem.js`
38. `js/adapters/filesystem-adapter.js`
39. `js/modules/dashboard-clock.js`
40. `js/modules/guide-tools-module.js`
41. `js/modules/plugin-manager.js`
42. `js/services/code-formatter.js`
43. `js/services/config-loader.js`
44. `js/services/diagnosis-export.js`
45. `js/services/html-escape.js`
46. `js/services/logger.js`
47. `js/services/module-registry.js`
48. `js/services/profile-archive.js`
49. `js/services/project-selftest.js`
50. `js/services/startup-check.js`
51. `js/services/templates-archive.js`
52. `js/services/ui-action-handlers.js`
53. `modules/backup_funktions_modul/config.json`
54. `modules/backup_funktions_modul/logic.js`
55. `modules/backup_funktions_modul/manifest.json`
56. `modules/backup_funktions_modul/schema.json`
57. `modules/backup_funktions_modul/texts.json`
58. `modules/datenbank_baukasten/config.json`
59. `modules/datenbank_baukasten/logic.js`
60. `modules/datenbank_baukasten/manifest.json`
61. `modules/datenbank_baukasten/schema.json`
62. `modules/datenbank_baukasten/texts.json`
63. `modules/debugging_modul/config.json`
64. `modules/debugging_modul/logic.js`
65. `modules/debugging_modul/manifest.json`
66. `modules/debugging_modul/schema.json`
67. `modules/debugging_modul/texts.json`
68. `modules/logging_modul/config.json`
69. `modules/logging_modul/logic.js`
70. `modules/logging_modul/manifest.json`
71. `modules/logging_modul/schema.json`
72. `modules/logging_modul/texts.json`
73. `modules/todo_kalender_erinnerung/config.json`
74. `modules/todo_kalender_erinnerung/logic.js`
75. `modules/todo_kalender_erinnerung/manifest.json`
76. `modules/todo_kalender_erinnerung/schema.json`
77. `modules/todo_kalender_erinnerung/texts.json`
78. `modules/wiki_notiz_wissen/config.json`
79. `modules/wiki_notiz_wissen/logic.js`
80. `modules/wiki_notiz_wissen/manifest.json`
81. `modules/wiki_notiz_wissen/schema.json`
82. `modules/wiki_notiz_wissen/texts.json`
83. `scripts/laienstart.sh`
84. `scripts/minimal-check.sh`
85. `tests/scripts-laienstart.dry-run.test.js`
86. `tests/adapters/desktop-filesystem.test.js`
87. `tests/modules/datenbank-baukasten.test.js`
88. `tests/services/import-export-consistency.test.js`
89. `tests/services/module-registry.test.js`
90. `tests/services/project-selftest.test.js`
91. `tests/services/startup-check.test.js`
92. `tests/services/ui-action-handlers.smoke.test.js`
93. `tests/services/ui-render-safety.test.js`
94. `tests/start-files/start-import-resolution.test.js`
