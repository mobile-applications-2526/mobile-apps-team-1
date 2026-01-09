import { Task, UpdateTaskDTO } from "../types";
import { API_URL } from './Config';
import { getToken, getUserId } from "./StorageService";

const apiUrl = API_URL;
const getTasks = async (): Promise<Task[]> => {
  const userId = await getUserId();
  const token = await getToken();

  if (!userId) {
    console.warn("No userId found in storage");
    return [];
  }

  try {
    console.log(
      `Fetching tasks from: ${apiUrl}/tasks/filter for user: ${userId}`
    );
    const response = await fetch(`${apiUrl}/tasks/filter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ assignee: userId }),
    });

    console.log(`Tasks response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Tasks fetch failed: ${errorText}`);
      throw new Error("Failed to fetch tasks");
    }

    const backendTasks = await response.json();
    console.log(`Received ${backendTasks.length} tasks from backend`);
    console.log("Raw tasks:", JSON.stringify(backendTasks, null, 2));

    // Map backend tasks to frontend interface
    return backendTasks.map((t: any) => {
      const subtasks = t.subtasks || [];
      const total = subtasks.length;
      const done = subtasks.filter((s: any) => s.status === "DONE").length;

      let progress = 0;

      if (t.status === "DONE") {
        progress = 100;
      } else if (total > 0 && done === total) {
        progress = 100;
      } else if (total > 0) {
        progress = Math.round((done / total) * 100);
      }

      return {
        id: typeof t.id === "object" ? t.id.id : t.id,
        title: t.title,
        status: t.status,
        assignee: typeof t.assignee === "object" ? t.assignee.id : t.assignee,
        subtasks,
        progress,
        completed: progress === 100,
      };
    });
  } catch (error) {
    console.error("Error fetching tasks details:", error);
    return [];
  }
};

const updateTask = async (task: UpdateTaskDTO): Promise<Task> => {
  const token = await getToken();

  const response = await fetch(`${apiUrl}/tasks`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) throw new Error('Failed to update task');
  return response.json();
};

const createSubtask = async (taskId: string, title: string): Promise<any> => {
  const token = await getToken();

  const response = await fetch(`${apiUrl}/tasks/subtask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ taskId, title }),
  });

  if (!response.ok) throw new Error('Failed to create subtask');
  
  const responseText = await response.text();
  if (!responseText) {
    return { id: Math.random().toString(), title, status: 'TODO' };
  }
  
  return JSON.parse(responseText);
};

const createTask = async (title: string, creatorId: string): Promise<Task> => {
  const token = await getToken();

  const response = await fetch(`${apiUrl}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title, creatorId }),
  });

  if (!response.ok) throw new Error('Failed to create task');
  return response.json();
};

const deleteTask = async (taskId: string): Promise<void> => {
  const token = await getToken();

  const response = await fetch(`${apiUrl}/tasks`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ taskId }),
  });

  if (!response.ok) throw new Error('Failed to delete task');
};

const deleteSubtask = async (taskId: string, subtaskId: string): Promise<void> => {
  const token = await getToken();

  const response = await fetch(`${apiUrl}/tasks/subtask`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ taskId, subtaskId }),
  });

  if (!response.ok) throw new Error('Failed to delete subtask');
};

const TaskService = {
  getTasks,
  updateTask,
  createSubtask,
  createTask,
  deleteTask,
  deleteSubtask,
};

export default TaskService;
