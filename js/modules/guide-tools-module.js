import { escapeHtml } from '../services/html-escape.js';

const GUIDE_STORAGE_KEY = 'provoware:guide-tools-module';

const defaultSections = [
  { title: 'Start prüfen', description: 'Öffne zuerst das Dashboard und prüfe die Startmeldungen.' },
  { title: 'Tool wählen', description: 'Wähle links ein Modul und lies die Kurzbeschreibung.' },
  { title: 'Ergebnis sichern', description: 'Speichere wichtige Ergebnisse als klare Notiz.' }
];

const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();

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
  let dragIndex = null;

  const setFeedback = (text, tone = 'neutral') => {
    feedback.textContent = `Status: ${text}`;
    feedback.dataset.tone = tone;
  };

  const setLayoutMode = () => {
    const compact = window.matchMedia('(max-width: 980px)').matches;
    sectionList.dataset.layout = compact ? 'stacked' : 'split';
  };

  const selectIndex = (nextIndex) => {
    selectedIndex = Math.max(0, Math.min(nextIndex, sections.length - 1));
    const active = sections[selectedIndex] || { title: '', description: '' };
    titleInput.value = active.title;
    descriptionInput.value = active.description;
  };

  const moveSection = (fromIndex, toIndex) => {
    if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex)) return false;
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= sections.length || toIndex >= sections.length) return false;
    if (fromIndex === toIndex) return false;
    const [moved] = sections.splice(fromIndex, 1);
    sections.splice(toIndex, 0, moved);
    selectedIndex = toIndex;
    return true;
  };

  const readGuideIndex = (target) => Number(target?.closest('[data-guide-index]')?.getAttribute('data-guide-index'));

  const moveSelectedBy = (offset) => {
    const toIndex = selectedIndex + offset;
    if (!moveSection(selectedIndex, toIndex)) return false;
    selectIndex(toIndex);
    render();
    return true;
  };

  const navigateIndex = (nextIndex, options = {}) => {
    const { feedbackText = '', mode = 'select' } = options;
    selectIndex(nextIndex);
    render();
    const activeButton = indexList.querySelector(`[data-guide-index="${selectedIndex}"]`);
    activeButton?.focus();
    if (mode !== 'jump') return;
    const sectionNode = document.getElementById(`guide-tool-section-${selectedIndex}`);
    sectionNode?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (feedbackText) setFeedback(feedbackText, 'neutral');
  };

  const render = () => {
    // Ausnahme mit Begründung: Wir bauen hier bewusst Markup für Buttons; Nutzdaten werden vorher mit escapeHtml entschärft.
    indexList.innerHTML = sections.map((section, index) => (
      `<li><button type="button" class="btn-small guide-index-btn ${index === selectedIndex ? 'is-selected' : ''}" data-guide-index="${index}" aria-current="${index === selectedIndex ? 'true' : 'false'}">${index + 1}. ${escapeHtml(section.title)}</button></li>`
    )).join('');

    // Ausnahme mit Begründung: Karten-Markup wird zentral zusammengebaut, Titel/Beschreibung bleiben via escapeHtml reine Textausgabe.
    sectionList.innerHTML = sections.map((section, index) => (
      `<article id="guide-tool-section-${index}" class="guide-section ${index === selectedIndex ? 'is-selected' : ''}" role="option" aria-selected="${index === selectedIndex ? 'true' : 'false'}" tabindex="${index === selectedIndex ? '0' : '-1'}" data-guide-index="${index}" draggable="true"><h4>${escapeHtml(section.title)}</h4><p>${escapeHtml(section.description)}</p></article>`
    )).join('');

    writeSections(sections);
    setLayoutMode();
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = normalize(titleInput.value).slice(0, 80);
    const description = normalize(descriptionInput.value).slice(0, 400);
    if (!title || !description) {
      setFeedback('Bitte Titel und Beschreibung ausfüllen.', 'warn');
      return;
    }
    sections[selectedIndex] = { title, description };
    render();
    setFeedback('Eintrag gespeichert.', 'ok');
  });

  moveUpButton.addEventListener('click', () => {
    if (!moveSelectedBy(-1)) return;
    setFeedback('Eintrag nach oben verschoben.', 'ok');
  });

  moveDownButton.addEventListener('click', () => {
    if (!moveSelectedBy(1)) return;
    setFeedback('Eintrag nach unten verschoben.', 'ok');
  });

  indexList.addEventListener('click', (event) => {
    const index = readGuideIndex(event.target);
    if (!Number.isInteger(index) || index < 0 || index >= sections.length) return;
    navigateIndex(index, {
      mode: 'jump',
      feedbackText: `Zu Abschnitt ${index + 1} gesprungen.`
    });
  });

  indexList.addEventListener('keydown', (event) => {
    if (!['ArrowUp', 'ArrowDown', 'Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowUp') navigateIndex(selectedIndex - 1);
    if (event.key === 'ArrowDown') navigateIndex(selectedIndex + 1);
    if (event.key === 'Enter' || event.key === ' ') {
      navigateIndex(selectedIndex, {
        mode: 'jump',
        feedbackText: `Abschnitt ${selectedIndex + 1} aktiv.`
      });
    }
  });

  sectionList.addEventListener('dragstart', (event) => {
    const card = event.target.closest('[data-guide-index]');
    if (!card) return;
    dragIndex = readGuideIndex(card);
    card.classList.add('is-dragging');
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(dragIndex));
    }
  });

  sectionList.addEventListener('dragover', (event) => {
    const card = event.target.closest('[data-guide-index]');
    if (!card) return;
    event.preventDefault();
    card.classList.add('is-drop-target');
  });

  sectionList.addEventListener('dragleave', (event) => {
    const card = event.target.closest('[data-guide-index]');
    card?.classList.remove('is-drop-target');
  });

  sectionList.addEventListener('drop', (event) => {
    event.preventDefault();
    const toIndex = readGuideIndex(event.target);
    const from = Number.isInteger(dragIndex) ? dragIndex : Number(event.dataTransfer?.getData('text/plain'));
    document.querySelectorAll('.guide-section.is-drop-target, .guide-section.is-dragging').forEach((node) => {
      node.classList.remove('is-drop-target', 'is-dragging');
    });
    dragIndex = null;
    if (!moveSection(from, toIndex)) return;
    render();
    setFeedback('Reihenfolge per Ziehen angepasst.', 'ok');
  });

  sectionList.addEventListener('dragend', () => {
    dragIndex = null;
    document.querySelectorAll('.guide-section.is-drop-target, .guide-section.is-dragging').forEach((node) => {
      node.classList.remove('is-drop-target', 'is-dragging');
    });
  });

  window.addEventListener('resize', setLayoutMode);

  selectIndex(0);
  render();
};
