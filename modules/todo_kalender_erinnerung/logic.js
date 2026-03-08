const PRIORITY_ORDER = Object.freeze(['niedrig', 'mittel', 'hoch']);

const nowIso = () => new Date().toISOString();

const asText = (value) => String(value || '').trim();

const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));

const createId = () => `todo_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;

const normalizePriority = (priority) => {
  const value = asText(priority).toLowerCase();
  return PRIORITY_ORDER.includes(value) ? value : 'mittel';
};

const normalizeStatus = (status) => {
  const value = asText(status).toLowerCase();
  return value === 'erledigt' ? 'erledigt' : 'offen';
};

export const createTodoEntry = (input = {}) => {
  const title = asText(input.title);
  const safeTitle = title || 'Neue Aufgabe';

  const task = {
    id: asText(input.id) || createId(),
    title: safeTitle,
    detail: asText(input.detail),
    area: asText(input.area) || 'Allgemein',
    priority: normalizePriority(input.priority),
    dueDate: isDate(input.dueDate) ? input.dueDate : null,
    reminderAt: asText(input.reminderAt) || null,
    status: normalizeStatus(input.status),
    doneAt: null,
    createdAt: asText(input.createdAt) || nowIso(),
    updatedAt: nowIso()
  };

  if (task.status === 'erledigt') task.doneAt = asText(input.doneAt) || nowIso();
  return task;
};

export const updateTodoEntry = (task, patch = {}) => {
  const base = { ...task };
  if (patch.title !== undefined) {
    const title = asText(patch.title);
    base.title = title || base.title || 'Neue Aufgabe';
  }
  if (patch.detail !== undefined) base.detail = asText(patch.detail);
  if (patch.area !== undefined) base.area = asText(patch.area) || 'Allgemein';
  if (patch.priority !== undefined) base.priority = normalizePriority(patch.priority);
  if (patch.dueDate !== undefined) base.dueDate = isDate(patch.dueDate) ? patch.dueDate : null;
  if (patch.reminderAt !== undefined) base.reminderAt = asText(patch.reminderAt) || null;
  if (patch.status !== undefined) base.status = normalizeStatus(patch.status);

  if (base.status === 'erledigt' && !base.doneAt) base.doneAt = nowIso();
  if (base.status === 'offen') base.doneAt = null;
  base.updatedAt = nowIso();
  return base;
};

const mutateById = (tasks, id, mapper) => {
  const key = asText(id);
  return tasks.map((task) => (task.id === key ? mapper(task) : task));
};

export const markTodoDone = (tasks, id) => mutateById(tasks, id, (task) => updateTodoEntry(task, { status: 'erledigt' }));

export const reactivateTodo = (tasks, id) => mutateById(tasks, id, (task) => updateTodoEntry(task, { status: 'offen' }));

export const deleteTodo = (tasks, id) => {
  const key = asText(id);
  return tasks.filter((task) => task.id !== key);
};

const sortTasks = (tasks) => [...tasks].sort((a, b) => {
  const statusScore = a.status.localeCompare(b.status, 'de');
  if (statusScore !== 0) return statusScore;
  const prioScore = PRIORITY_ORDER.indexOf(b.priority) - PRIORITY_ORDER.indexOf(a.priority);
  if (prioScore !== 0) return prioScore;
  return a.createdAt.localeCompare(b.createdAt);
});

export const filterTodos = (tasks, filter = {}) => {
  const byStatus = asText(filter.status).toLowerCase();
  const byArea = asText(filter.area).toLowerCase();
  const byPriority = asText(filter.priority).toLowerCase();
  const byDate = asText(filter.date);

  return sortTasks(tasks).filter((task) => {
    if (byStatus && task.status !== byStatus) return false;
    if (byArea && task.area.toLowerCase() !== byArea) return false;
    if (byPriority && task.priority !== byPriority) return false;
    if (byDate && task.dueDate !== byDate) return false;
    return true;
  });
};

export const splitTodoList = (tasks) => {
  const open = [];
  const done = [];
  tasks.forEach((task) => {
    if (task.status === 'erledigt') done.push(task);
    else open.push(task);
  });
  return { open: sortTasks(open), done: sortTasks(done) };
};

export const summarizeTodoStatus = (tasks) => {
  const { open, done } = splitTodoList(tasks);
  const highOpen = open.filter((task) => task.priority === 'hoch').length;
  return {
    all: tasks.length,
    open: open.length,
    done: done.length,
    highOpen,
    text: `${open.length} offen, ${done.length} erledigt.`
  };
};

export const exportTodosAsJson = (tasks) => JSON.stringify(tasks, null, 2);

export const exportTodosAsCsv = (tasks) => {
  const header = ['id', 'titel', 'bereich', 'prioritaet', 'status', 'faellig', 'erinnerung'];
  const rows = tasks.map((task) => [
    task.id,
    task.title,
    task.area,
    task.priority,
    task.status,
    task.dueDate || '',
    task.reminderAt || ''
  ]);
  return [header, ...rows]
    .map((cols) => cols.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(';'))
    .join('\n');
};

export const createTodoStore = (raw = {}) => {
  const tasks = Array.isArray(raw.tasks) ? raw.tasks.map((item) => createTodoEntry(item)) : [];
  return {
    version: 1,
    tasks,
    updatedAt: nowIso()
  };
};

export const toReminderQueue = (tasks) => tasks
  .filter((task) => task.status === 'offen' && task.reminderAt)
  .map((task) => ({ id: task.id, title: task.title, reminderAt: task.reminderAt, dueDate: task.dueDate }));
