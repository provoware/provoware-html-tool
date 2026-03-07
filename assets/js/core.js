const MODULE_FILES = Object.freeze(['manifest', 'config', 'texts', 'schema', 'logic']);
const MODULE_PROFILES = Object.freeze([
  Object.freeze({
    id: 'datenbank_baukasten',
    files: Object.freeze(['manifest', 'config', 'texts', 'schema', 'logic'])
  }),
  Object.freeze({
    id: 'todo_kalender_erinnerung',
    files: Object.freeze(['manifest', 'config', 'texts', 'schema', 'logic'])
  })
]);

const todos = [];
let reminderTimerId = 0;

function applyStartStatus() {
  const statusText = document.getElementById('status-text');
  if (!statusText) {
    return;
  }

  statusText.textContent = getConnectionStatus();
}

function getConnectionStatus() {
  if (navigator.onLine) {
    return 'Start aktiv. Verbindung verfügbar.';
  }

  return 'Offline-Start aktiv. Basis geladen.';
}

window.addEventListener('online', applyStartStatus);
window.addEventListener('offline', applyStartStatus);

function buildModuleMessage() {
  for (const profile of MODULE_PROFILES) {
    const uniqueProfileFiles = [...new Set(profile.files)];
    const missingFiles = MODULE_FILES.filter((fileKey) => !uniqueProfileFiles.includes(fileKey));
    const extraFiles = uniqueProfileFiles.filter((fileKey) => !MODULE_FILES.includes(fileKey));

    if (missingFiles.length > 0) {
      return `Modulprofil ${profile.id} unvollständig. Fehlend: ${missingFiles.join(', ')}.`;
    }

    if (extraFiles.length > 0) {
      return `Modulprofil ${profile.id} ungültig. Unerwartet: ${extraFiles.join(', ')}.`;
    }
  }

  const profileNames = MODULE_PROFILES.map((profile) => profile.id).join(', ');
  return `${MODULE_PROFILES.length} Modulprofile bereit: ${profileNames}. Mindestteile konsistent hinterlegt.`;
}

function registerModules() {
  const moduleCardText = document.getElementById('module-summary');
  if (!moduleCardText) {
    return;
  }

  moduleCardText.textContent = buildModuleMessage();
}

function renderTodos() {
  const todoList = document.getElementById('todo-list');
  const todoInfo = document.getElementById('todo-info');

  if (!todoList || !todoInfo) {
    return;
  }

  todoList.replaceChildren();

  if (todos.length === 0) {
    todoInfo.textContent = 'Noch keine Aufgaben vorhanden.';
    return;
  }

  todoInfo.textContent = `${todos.length} Aufgabe(n) geplant.`;

  for (const todo of todos) {
    const listItem = document.createElement('li');
    const reminderSuffix = todo.reminded ? ' | Erinnerung gesendet.' : '';
    listItem.textContent = `${todo.title} | Fällig: ${todo.dueDate} | Erinnerung: ${todo.reminder}${reminderSuffix}`;
    todoList.appendChild(listItem);
  }
}

function checkReminders() {
  const now = Date.now();
  let hasNewReminder = false;

  for (const todo of todos) {
    if (todo.reminded) {
      continue;
    }

    if (Date.parse(todo.reminder) <= now) {
      todo.reminded = true;
      hasNewReminder = true;
    }
  }

  if (hasNewReminder) {
    renderTodos();
  }
}

function startReminderLoop() {
  if (reminderTimerId !== 0) {
    window.clearInterval(reminderTimerId);
  }

  reminderTimerId = window.setInterval(checkReminders, 30000);
}

function bindTodoForm() {
  const todoForm = document.getElementById('todo-form');
  if (!todoForm) {
    return;
  }

  todoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const titleInput = document.getElementById('todo-title');
    const dueDateInput = document.getElementById('todo-due-date');
    const reminderInput = document.getElementById('todo-reminder');

    if (!titleInput || !dueDateInput || !reminderInput) {
      return;
    }

    const title = titleInput.value.trim();
    const dueDate = dueDateInput.value;
    const reminder = reminderInput.value;

    if (!title || !dueDate || !reminder) {
      return;
    }

    todos.push({ title, dueDate, reminder, reminded: false });
    todoForm.reset();
    checkReminders();
    renderTodos();
  });
}

function bootstrap() {
  applyStartStatus();
  registerModules();
  bindTodoForm();
  renderTodos();
  startReminderLoop();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}
