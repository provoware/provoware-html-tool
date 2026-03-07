export const renderHeaderSection = ({ state, texts, messages, setText, byId, autoFormatText, buildHeaderProjectStatus, buildHeaderAutosaveStatus }) => {
  setText('app-title', texts.titles?.appTitle || 'ProvoWare Dashboard');
  setText('app-subtitle', texts.titles?.appSubtitle || 'Projektstart');
  setText('header-chip-project-status', buildHeaderProjectStatus(state));
  setText('header-chip-autosave-status', buildHeaderAutosaveStatus(state));

  const nextStep = byId('next-step');
  if (!nextStep) return;
  const startupReady = state.debug?.startupReady;
  const nextMessage = startupReady ? messages.startupReady || '' : messages.startupWaiting || messages.startupBlocked || '';
  const label = messages.actionNext || 'Nächster Schritt';
  nextStep.textContent = `${label}: ${autoFormatText(nextMessage)}`;
};
