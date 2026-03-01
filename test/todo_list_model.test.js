const test = require("node:test");
const assert = require("node:assert/strict");
const { createTodoModel } = require("../system-module/todo_list_model");

test("Todo-Modell fuegt Aufgabe mit Datum hinzu", () => {
  const model = createTodoModel();
  const result = model.addTodo({
    text: "Start-Routine pruefen",
    date: "2026-03-01",
  });

  assert.equal(result.ok, true);
  assert.equal(model.listByDate("2026-03-01").length, 1);
});

test("Todo-Modell archiviert erledigte Aufgabe", () => {
  const model = createTodoModel();
  const added = model.addTodo({ text: "A11y testen", date: "2026-03-01" });
  const done = model.completeTodo(added.todo.id);

  assert.equal(done.ok, true);
  assert.equal(model.listByDate("2026-03-01").length, 0);
  assert.equal(model.listArchive().length, 1);
});

test("Todo-Modell listet alle offenen Aufgaben", () => {
  const model = createTodoModel();
  model.addTodo({ text: "Offen 1", date: "2026-03-03" });
  model.addTodo({ text: "Offen 2", date: "2026-03-04" });

  const open = model.listActive();

  assert.equal(open.length, 2);
  assert.equal(open[0].text, "Offen 1");
});

test("Todo-Modell validiert Datum", () => {
  const model = createTodoModel();
  assert.throws(() =>
    model.addTodo({ text: "Fehlerfall", date: "01.03.2026" }),
  );
});

test("Todo-Modell exportiert und importiert Aufgaben", () => {
  const source = createTodoModel();
  source.addTodo({ text: "Persistenz testen", date: "2026-03-02" });
  const added = source.addTodo({ text: "Archiv testen", date: "2026-03-02" });
  source.completeTodo(added.todo.id);

  const exported = source.exportState();
  assert.equal(Array.isArray(exported.active), true);
  assert.equal(Array.isArray(exported.archive), true);

  const target = createTodoModel();
  const imported = target.importState(exported);

  assert.equal(imported.ok, true);
  assert.equal(target.listByDate("2026-03-02").length, 1);
  assert.equal(target.listArchive().length, 1);
});

test("Todo-Modell lehnt ungueltigen Import ab", () => {
  const model = createTodoModel();
  assert.throws(
    () => model.importState({ active: "nein", archive: [] }),
    /ungueltig/,
  );
});
