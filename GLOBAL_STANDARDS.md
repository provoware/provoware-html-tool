# GLOBAL_STANDARDS.md – Modultool (Globalregeln für Qualität & Robustheit)
Stand: 2026-02-28

Ziel: **kleine Dateien, kleine Funktionen, kleine PRs** → schneller reviewbar, weniger Bugs, besser für Laien erklärbar.

---

## 1) Größenlimits (Default)
### 1.1 Dateien (Quellcode)
- **Max 400 Zeilen pro Datei** (Leerzeilen/Kommentare zählen nicht).
- Wenn mehr nötig ist → Datei splitten (Service/Module/Helper).

**Ausnahmen:**
- Build‑Output (generiert)
- Vendor‑Libraries (extern)
- Große Datenlisten (JSON), wenn sie nicht manuell gepflegt werden

### 1.2 Funktionen
- **Max 80 Zeilen pro Funktion** (Leerzeilen/Kommentare zählen nicht).
- Bei Überschreitung: extrahieren in Helper/Service.

### 1.3 Zeilenlänge
- **80 Zeichen** Standard (JS/HTML/CSS/MD).
- Ausnahmen: URLs, lange Strings (wenn sinnvoll), min. aber lesbar umbrechen.

---

## 2) Komplexitätslimits (Default)
- **max-depth = 4** (nicht tiefer verschachteln, sonst splitten)
- **complexity = 10** (Cyclomatic Complexity pro Funktion)

---

## 3) PR‑/Review‑Regeln (GitHub)
- **Ein Ziel pro PR**
- **< 400 LOC** pro Review‑Einheit (splitten, wenn größer)
- PR muss in **< 30–60 Minuten** reviewbar sein (Daumenregel)
- Wenn mehrere PRs voneinander abhängen → „stacked PRs“ (kleine PR‑Kette)

---

## 4) Tooling‑Standard (empfohlen)
### 4.1 ESLint (Beispiel)
```js
module.exports = {
  rules: {
    "max-lines": ["error", { "max": 400, "skipBlankLines": true, "skipComments": true }],
    "max-lines-per-function": ["error", { "max": 80, "skipBlankLines": true, "skipComments": true }],
    "max-len": ["error", {
      "code": 80,
      "ignoreUrls": true,
      "ignoreStrings": true,
      "ignoreTemplateLiterals": true
    }],
    "max-depth": ["error", 4],
    "complexity": ["error", 10]
  }
};
```

### 4.2 Prettier (Beispiel)
```json
{
  "printWidth": 80
}
```

---

## 5) Laien‑Regel (Text & Hilfe)
- Jede Funktion bekommt 3 Sätze Hilfe:
  1) Was macht das?
  2) Was passiert mit den Daten?
  3) Wie mache ich das rückgängig?

---

## 6) Ausnahmen sauber dokumentieren
Wenn ein Limit bewusst gebrochen wird:
- In `PROJECT_INFO.md` dokumentieren (warum + wann Rückbau möglich)
- Optional ESLint Disable lokal und begründet (nur für den Block)

