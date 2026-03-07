import { appendLog } from '../state.js';

const formatNow = () => new Date().toISOString();

export const logEvent = (type, code, message, details = null) => {
  const entry = { timestamp: formatNow(), type, code, message, details };
  appendLog(entry);
  if (type === 'ERROR') {
    console.error(code, message, details || '');
  } else if (type === 'WARN') {
    console.warn(code, message, details || '');
  } else if (type === 'DEBUG') {
    console.debug(code, message, details || '');
  } else {
    console.info(code, message);
  }
  return entry;
};
