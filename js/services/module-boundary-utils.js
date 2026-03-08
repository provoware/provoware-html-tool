const trimText = (value) => String(value ?? '').trim();

export const safeText = (value, fallback = '') => {
  const normalized = trimText(value);
  const fallbackText = trimText(fallback);
  return normalized || fallbackText;
};

export const safeObject = (value, fallback = {}) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  if (fallback && typeof fallback === 'object' && !Array.isArray(fallback)) return fallback;
  return {};
};

export const safeArray = (value, fallback = []) => {
  if (Array.isArray(value)) return value;
  return Array.isArray(fallback) ? fallback : [];
};

export const userProblemNextStep = (problem, nextStep) => {
  const cleanProblem = safeText(problem, 'Es gibt ein Problem.');
  const cleanStep = safeText(nextStep, 'Bitte Eingaben prüfen und erneut versuchen.');
  return `${cleanProblem} Nächster Schritt: ${cleanStep}`;
};
