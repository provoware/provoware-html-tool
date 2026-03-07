export const escapeHtml = (value) => String(value || '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

export const createSafeListItem = (label, options = {}) => {
  const safeLabel = escapeHtml(label);
  const cssClass = String(options.className || '').trim();
  const safeClass = cssClass ? ` class="${escapeHtml(cssClass)}"` : '';
  return `<li${safeClass}>${safeLabel}</li>`;
};
