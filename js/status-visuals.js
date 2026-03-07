export const STATUS_VISUALS = {
  green: { symbol: '✔', label: 'ok' },
  yellow: { symbol: '⚠', label: 'gelb' },
  red: { symbol: '✖', label: 'rot' }
};

export const statusVisual = (status) => STATUS_VISUALS[status] || STATUS_VISUALS.red;

export const formatStatusWithSymbol = (status, customLabel) => {
  const visual = statusVisual(status);
  return `${visual.symbol} ${customLabel || visual.label}`;
};
