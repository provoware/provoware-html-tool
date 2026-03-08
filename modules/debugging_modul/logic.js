const LEVELS = new Set(['info', 'warn', 'error']);

const asText = (value) => String(value || '').trim();
const nowIso = () => new Date().toISOString();

const normalizeLevel = (level) => {
  const clean = asText(level).toLowerCase();
  return LEVELS.has(clean) ? clean : 'info';
};

const nextId = () => `debug_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;

export const createDebugSession = (name = 'Standard-Debug-Sitzung') => ({
  id: nextId(),
  name: asText(name) || 'Standard-Debug-Sitzung',
  createdAt: nowIso(),
  events: []
});

export const addDebugEvent = (session, input = {}) => {
  const safe = session && typeof session === 'object' ? session : createDebugSession();
  const event = {
    id: nextId(),
    name: asText(input.name) || 'Ohne Namen',
    level: normalizeLevel(input.level),
    details: asText(input.details),
    createdAt: nowIso()
  };
  return { ...safe, events: [...(safe.events || []), event] };
};

export const summarizeDebugSession = (session) => {
  const events = Array.isArray(session?.events) ? session.events : [];
  const countByLevel = { info: 0, warn: 0, error: 0 };
  events.forEach((event) => {
    const level = normalizeLevel(event.level);
    countByLevel[level] += 1;
  });

  return {
    sessionId: asText(session?.id),
    sessionName: asText(session?.name),
    totalEvents: events.length,
    countByLevel,
    summaryText: `${events.length} Ereignisse erfasst (Info: ${countByLevel.info}, Warnung: ${countByLevel.warn}, Fehler: ${countByLevel.error}).`
  };
};
