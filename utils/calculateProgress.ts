import { Task } from "../types";

export function calculateProgress(task: Task): number {
  if (!task.subtasks || task.subtasks.length === 0) {
    return task.status === "DONE" ? 100 : 0;
  }
  const done = task.subtasks.filter((s) => s.status === "DONE").length;
  return Math.round((done / task.subtasks.length) * 100);
}
