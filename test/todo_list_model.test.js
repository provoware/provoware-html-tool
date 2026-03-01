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

test("Todo-Modell validiert Datum", () => {
  const model = createTodoModel();
  assert.throws(() =>
    model.addTodo({ text: "Fehlerfall", date: "01.03.2026" }),
  );
});
