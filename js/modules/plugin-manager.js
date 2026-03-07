const pluginCatalog = Object.freeze([
  {
    id: 'char-counter',
    name: 'Zeichenzähler',
    help: 'Zählt Zeichen in Eingabe- und Ausgabebereichen. Hilft beim schnellen Mengenüberblick.'
  },
  {
    id: 'spellcheck-auto',
    name: 'Rechtschreibprüfung (DE/EN/FR, auto)',
    help: 'Schätzt Sprache automatisch (Deutsch, Englisch, Französisch) und markiert mögliche Tippfehler.'
  }
]);

const languageHints = {
  de: ['der', 'die', 'das', 'und', 'ist', 'nicht', 'mit', 'ich', 'du', 'wir', 'für', 'ein', 'eine', 'auf', 'zu'],
  en: ['the', 'and', 'is', 'are', 'with', 'this', 'that', 'you', 'we', 'for', 'from', 'not', 'have', 'in', 'to'],
  fr: ['le', 'la', 'les', 'et', 'est', 'avec', 'vous', 'nous', 'pour', 'pas', 'une', 'des', 'dans', 'sur', 'de']
};

const miniDictionaries = {
  de: new Set(['hallo', 'welt', 'test', 'beispiel', 'text', 'eingabe', 'ausgabe', 'projekt', 'datei', 'ordner', 'prüfung', 'plugin', 'modul', 'status', 'hilfe', 'start', 'speichern', 'laden', 'notiz', 'liste', 'aufgabe', 'bearbeiten', 'löschen', 'neu']),
  en: new Set(['hello', 'world', 'test', 'example', 'text', 'input', 'output', 'project', 'file', 'folder', 'check', 'plugin', 'module', 'status', 'help', 'start', 'save', 'load', 'note', 'list', 'task', 'edit', 'delete', 'new']),
  fr: new Set(['bonjour', 'monde', 'test', 'exemple', 'texte', 'entree', 'sortie', 'projet', 'fichier', 'dossier', 'controle', 'plugin', 'module', 'statut', 'aide', 'demarrer', 'sauver', 'charger', 'note', 'liste', 'tache', 'modifier', 'supprimer', 'nouveau'])
};

const normalizeToken = (value) => String(value || '').toLowerCase().replace(/[^a-zàâäéèêëîïôöùûüçß'-]/gi, '');

const readValueLength = (selector) => {
  const nodes = [...document.querySelectorAll(selector)];
  return nodes.reduce((sum, node) => {
    const value = typeof node.value === 'string' ? node.value : node.textContent || '';
    return sum + value.length;
  }, 0);
};

const collectTextForSpellcheck = () => {
  const selectors = [
    '#editor-content',
    '#file-preview-content',
    '#todo-input',
    '[id^="dashboard-note-input-"]',
    '#template-content'
  ];
  for (const selector of selectors) {
    const node = document.querySelector(selector);
    if (!node) continue;
    const value = typeof node.value === 'string' ? node.value : node.textContent || '';
    if (String(value || '').trim()) return String(value || '');
  }
  return '';
};

const detectLanguage = (text) => {
  const tokens = String(text || '')
    .toLowerCase()
    .split(/\s+/)
    .map(normalizeToken)
    .filter(Boolean);

  const scores = Object.entries(languageHints).map(([lang, hints]) => ({
    lang,
    score: tokens.reduce((sum, token) => (hints.includes(token) ? sum + 1 : sum), 0)
  }));

  scores.sort((a, b) => b.score - a.score);
  return scores[0]?.score > 0 ? scores[0].lang : 'de';
};

const runCharCounter = () => {
  const inputChars = readValueLength('#todo-input, [id^="dashboard-note-input-"], #template-content');
  const outputChars = readValueLength('#file-preview-content, #editor-content, #status, #dashboard-info-note');
  return {
    title: 'Zeichenzähler',
    lines: [
      `Eingabe gesamt: ${inputChars} Zeichen.`,
      `Ausgabe gesamt: ${outputChars} Zeichen.`,
      `Summe: ${inputChars + outputChars} Zeichen.`
    ]
  };
};

const runSpellcheck = () => {
  const text = collectTextForSpellcheck();
  if (!text.trim()) {
    return {
      title: 'Rechtschreibprüfung',
      lines: ['Noch kein Text gefunden. Bitte zuerst Text eingeben oder laden.']
    };
  }

  const language = detectLanguage(text);
  const dictionary = miniDictionaries[language] || miniDictionaries.de;
  const tokens = text
    .split(/\s+/)
    .map(normalizeToken)
    .filter((token) => token.length >= 4)
    .slice(0, 300);

  const unknown = [...new Set(tokens.filter((token) => !dictionary.has(token)))].slice(0, 8);
  const languageName = language === 'en' ? 'Englisch' : language === 'fr' ? 'Französisch' : 'Deutsch';

  if (!unknown.length) {
    return {
      title: 'Rechtschreibprüfung',
      lines: [`Sprache erkannt: ${languageName}.`, 'Keine auffälligen Wörter im einfachen Schnellcheck gefunden.']
    };
  }

  return {
    title: 'Rechtschreibprüfung',
    lines: [
      `Sprache erkannt: ${languageName}.`,
      `Mögliche Tippfehler: ${unknown.length}.`,
      `Beispiele: ${unknown.join(', ')}.`
    ]
  };
};

export const getPluginCatalog = () => pluginCatalog.map((entry) => ({ ...entry }));

export const evaluatePlugin = (pluginId) => {
  if (pluginId === 'spellcheck-auto') return runSpellcheck();
  return runCharCounter();
};
