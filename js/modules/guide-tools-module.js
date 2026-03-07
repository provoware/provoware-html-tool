const GUIDE_STORAGE_KEY = 'provoware:guide-tools-module';

const defaultSections = [
  { title: 'Start prüfen', description: 'Öffne zuerst das Dashboard und prüfe die Startmeldungen.' },
  { title: 'Tool wählen', description: 'Wähle links ein Modul und lies die Kurzbeschreibung.' },
  { title: 'Ergebnis sichern', description: 'Speichere wichtige Ergebnisse als klare Notiz.' }
];

const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const escapeHtml = (value) => String(value || '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const readSections = () => {
  try {
    const raw = window.localStorage.getItem(GUIDE_STORAGE_KEY);
    const parsed = JSON.parse(raw || '[]');
    if (!Array.isArray(parsed)) return [...defaultSections];
    const cleaned = parsed
      .map((item) => ({ title: normalize(item?.title), description: normalize(item?.description) }))
      .filter((item) => item.title && item.description)
      .slice(0, 30);
    return cleaned.length ? cleaned : [...defaultSections];
  } catch {
    return [...defaultSections];
  }
};

const writeSections = (sections) => {
  try {
    window.localStorage.setItem(GUIDE_STORAGE_KEY, JSON.stringify(sections));
  } catch {
    // Browser kann Speichern blockieren.
  }
};

export const initGuideToolsModule = () => {
  const app = document.getElementById('app');
  if (!app || app.dataset.guideToolsBound === 'yes') return;

  const indexList = document.getElementById('guide-tools-index-list');
  const sectionList = document.getElementById('guide-tools-sections');
  const titleInput = document.getElementById('guide-tools-title');
  const descriptionInput = document.getElementById('guide-tools-description');
  const feedback = document.getElementById('guide-tools-feedback');
  const form = document.getElementById('guide-tools-form');
  const moveUpButton = document.getElementById('guide-tools-move-up');
  const moveDownButton = document.getElementById('guide-tools-move-down');

  if (!indexList || !sectionList || !titleInput || !descriptionInput || !feedback || !form || !moveUpButton || !moveDownButton) return;

  app.dataset.guideToolsBound = 'yes';
  const sections = readSections();
  let selectedIndex = 0;

  const setFeedback = (text) => {
    feedback.textContent = `Status: ${text}`;
  };

  const selectIndex = (nextIndex) => {
    selectedIndex = Math.max(0, Math.min(nextIndex, sections.length - 1));
    const active = sections[selectedIndex] || { title: '', description: '' };
    titleInput.value = active.title;
    descriptionInput.value = active.description;
  };

  const render = () => {
    indexList.innerHTML = sections.map((section, index) => (
      `<li><button type="button" class="btn-small" data-guide-index="${index}">${index + 1}. ${escapeHtml(section.title)}</button></li>`
    )).join('');

    sectionList.innerHTML = sections.map((section, index) => (
      `<article id="guide-tool-section-${index}" class="guide-section ${index === selectedIndex ? 'is-selected' : ''}"><h4>${escapeHtml(section.title)}</h4><p>${escapeHtml(section.description)}</p></article>`
    )).join('');

    writeSections(sections);
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = normalize(titleInput.value).slice(0, 80);
    const description = normalize(descriptionInput.value).slice(0, 400);
    if (!title || !description) {
      setFeedback('Bitte Titel und Beschreibung ausfüllen.');
      return;
    }
    sections[selectedIndex] = { title, description };
    render();
    setFeedback('Eintrag gespeichert.');
  });

  moveUpButton.addEventListener('click', () => {
    if (selectedIndex <= 0) return;
    [sections[selectedIndex - 1], sections[selectedIndex]] = [sections[selectedIndex], sections[selectedIndex - 1]];
    selectIndex(selectedIndex - 1);
    render();
    setFeedback('Eintrag nach oben verschoben.');
  });

  moveDownButton.addEventListener('click', () => {
    if (selectedIndex >= sections.length - 1) return;
    [sections[selectedIndex + 1], sections[selectedIndex]] = [sections[selectedIndex], sections[selectedIndex + 1]];
    selectIndex(selectedIndex + 1);
    render();
    setFeedback('Eintrag nach unten verschoben.');
  });

  indexList.addEventListener('click', (event) => {
    const target = event.target;
    const index = Number(target.getAttribute('data-guide-index'));
    if (!Number.isInteger(index) || index < 0 || index >= sections.length) return;
    selectIndex(index);
    render();
    const sectionNode = document.getElementById(`guide-tool-section-${index}`);
    sectionNode?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setFeedback(`Zu Abschnitt ${index + 1} gesprungen.`);
  });

  selectIndex(0);
  render();
};
