const formatDateTime = (date = new Date()) => {
  const formatter = new Intl.DateTimeFormat('de-DE', {
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  return formatter.format(date);
};

export const initDashboardClock = (elementId = 'dashboard-datetime') => {
  const node = document.getElementById(elementId);
  if (!node || node.dataset.clockBound === 'yes') return;

  node.dataset.clockBound = 'yes';
  const renderClock = () => {
    node.textContent = `Datum und Uhrzeit: ${formatDateTime()}`;
  };

  renderClock();
  window.setInterval(renderClock, 1000);
};
