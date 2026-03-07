export function createTodoEntry(title, dueDate, reminder) {
  return {
    title,
    dueDate,
    reminder,
    reminded: false
  };
}
