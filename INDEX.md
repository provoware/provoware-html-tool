# INDEX

## Iterationshinweis
- Diese Iteration ergänzt einen Grenzfall-Test für Guide-Index-Navigation (ArrowUp auf 0, ArrowDown auf letztem Index).
- Diese Iteration vereinheitlicht die Guide-API (`mode` statt zusätzlichem `jump`-Boolean).
- Diese Iteration verbessert Wiki-Robustheit (Kopien statt direkter Store-Referenzen).
- Diese Iteration verbessert den Genres-Zufallsgenerator (Anzahl wird auf 1 bis 20 geklammert).
- Diese Iteration erweitert Default-Archive (Genres/Moods/Styles und Templates) für besseren Start ohne Leereinträge.
- Diese Iteration ergänzt im Zufallsmix `usage.requested`/`usage.used` je Bereich für klare UI-Rückmeldung.
- Verzeichnisbaum und Dateiliste sind vollständig aktualisiert (ohne `.git`).

## Kompletter Verzeichnisbaum (ohne `.git`)

```text
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
│  ├─ renderers
│  │  ├─ ui-header-renderer.js
│  │  └─ ui-main-renderer.js
│  ├─ services
│  │  ├─ ui-actions
│  │  │  ├─ archive-actions.js
│  │  │  ├─ session-actions.js
│  │  │  ├─ template-actions.js
│  │  │  └─ workspace-actions.js
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
│  │  ├─ datenbank-baukasten.test.js
│  │  ├─ guide-tools-module.test.js
│  │  └─ wiki-notiz-wissen.test.js
│  ├─ services
│  │  ├─ import-export-consistency.test.js
│  │  ├─ module-registry.test.js
│  │  ├─ profile-archive-random.test.js
│  │  ├─ project-selftest.test.js
│  │  ├─ startup-check.test.js
│  │  ├─ ui-action-handlers.smoke.test.js
│  │  ├─ ui-header-chips.test.js
│  │  └─ ui-render-safety.test.js
│  ├─ start-files
│  │  └─ start-import-resolution.test.js
│  └─ scripts-laienstart.dry-run.test.js
├─ AGENTS.md
├─ backup_funktions_modul_start.html
├─ datenbank_baukasten_start.html
├─ debugging_modul_start.html
├─ DESIGN_VORLAGE.md
├─ index.html
├─ INDEX.md
├─ logging_modul_start.html
├─ README.md
├─ start.sh
├─ todo.txt
├─ todo_kalender_erinnerung_start.html
├─ TOOL_TUTORIAL.md
└─ wiki_notiz_wissen_start.html
```

## Vollständige Dateiliste (ohne `.git`)

1. `.github/workflows/ci.yml`
2. `.github/workflows/codeql.yml`
3. `.github/workflows/lint.yml`
4. `AGENTS.md`
5. `DESIGN_VORLAGE.md`
6. `INDEX.md`
7. `README.md`
8. `TOOL_TUTORIAL.md`
9. `assets/css/base.css`
10. `assets/js/core.js`
11. `backup_funktions_modul_start.html`
12. `css/app.css`
13. `data/app-config.json`
14. `data/dashboard3-notes/.gitkeep`
15. `data/laienstart-autofix-defaults.json`
16. `data/laienstart-dependency-map.json`
17. `data/laienstart-required-files.json`
18. `data/module-registry.json`
19. `data/profile-archive.json`
20. `data/project-structure.json`
21. `data/templates-archive.json`
22. `data/themes.json`
23. `data/ui_texts.json`
24. `datenbank_baukasten_start.html`
25. `debugging_modul_start.html`
26. `index.html`
27. `js/adapters/browser-filesystem.js`
28. `js/adapters/desktop-filesystem.js`
29. `js/adapters/filesystem-adapter.js`
30. `js/app.js`
31. `js/modules/dashboard-clock.js`
32. `js/modules/guide-tools-module.js`
33. `js/modules/plugin-manager.js`
34. `js/renderers/ui-header-renderer.js`
35. `js/renderers/ui-main-renderer.js`
36. `js/services/code-formatter.js`
37. `js/services/config-loader.js`
38. `js/services/diagnosis-export.js`
39. `js/services/html-escape.js`
40. `js/services/logger.js`
41. `js/services/module-registry.js`
42. `js/services/profile-archive.js`
43. `js/services/project-selftest.js`
44. `js/services/startup-check.js`
45. `js/services/templates-archive.js`
46. `js/services/ui-action-handlers.js`
47. `js/services/ui-actions/archive-actions.js`
48. `js/services/ui-actions/session-actions.js`
49. `js/services/ui-actions/template-actions.js`
50. `js/services/ui-actions/workspace-actions.js`
51. `js/state.js`
52. `js/status-visuals.js`
53. `js/ui.js`
54. `logging_modul_start.html`
55. `modules/backup_funktions_modul/config.json`
56. `modules/backup_funktions_modul/logic.js`
57. `modules/backup_funktions_modul/manifest.json`
58. `modules/backup_funktions_modul/schema.json`
59. `modules/backup_funktions_modul/texts.json`
60. `modules/datenbank_baukasten/config.json`
61. `modules/datenbank_baukasten/logic.js`
62. `modules/datenbank_baukasten/manifest.json`
63. `modules/datenbank_baukasten/schema.json`
64. `modules/datenbank_baukasten/texts.json`
65. `modules/debugging_modul/config.json`
66. `modules/debugging_modul/logic.js`
67. `modules/debugging_modul/manifest.json`
68. `modules/debugging_modul/schema.json`
69. `modules/debugging_modul/texts.json`
70. `modules/logging_modul/config.json`
71. `modules/logging_modul/logic.js`
72. `modules/logging_modul/manifest.json`
73. `modules/logging_modul/schema.json`
74. `modules/logging_modul/texts.json`
75. `modules/todo_kalender_erinnerung/config.json`
76. `modules/todo_kalender_erinnerung/logic.js`
77. `modules/todo_kalender_erinnerung/manifest.json`
78. `modules/todo_kalender_erinnerung/schema.json`
79. `modules/todo_kalender_erinnerung/texts.json`
80. `modules/wiki_notiz_wissen/config.json`
81. `modules/wiki_notiz_wissen/logic.js`
82. `modules/wiki_notiz_wissen/manifest.json`
83. `modules/wiki_notiz_wissen/schema.json`
84. `modules/wiki_notiz_wissen/texts.json`
85. `scripts/laienstart.sh`
86. `scripts/minimal-check.sh`
87. `start.sh`
88. `tests/adapters/desktop-filesystem.test.js`
89. `tests/modules/datenbank-baukasten.test.js`
90. `tests/modules/guide-tools-module.test.js`
91. `tests/modules/wiki-notiz-wissen.test.js`
92. `tests/scripts-laienstart.dry-run.test.js`
93. `tests/services/import-export-consistency.test.js`
94. `tests/services/module-registry.test.js`
95. `tests/services/profile-archive-random.test.js`
96. `tests/services/project-selftest.test.js`
97. `tests/services/startup-check.test.js`
98. `tests/services/ui-action-handlers.smoke.test.js`
99. `tests/services/ui-header-chips.test.js`
100. `tests/services/ui-render-safety.test.js`
101. `tests/start-files/start-import-resolution.test.js`
102. `todo.txt`
103. `todo_kalender_erinnerung_start.html`
104. `wiki_notiz_wissen_start.html`
