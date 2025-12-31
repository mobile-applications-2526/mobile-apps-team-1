import React, { createContext, ReactNode, useContext, useState } from "react";
import { Task } from "../../types";
import { calculateProgress } from "../../utils/calculateProgress";

interface TasksContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  updateTask: (updatedTask: Task) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === updatedTask.id
          ? {
              ...updatedTask,
              progress: calculateProgress(updatedTask),
              completed:
                updatedTask.subtasks.every((s) => s.status === "DONE") ||
                updatedTask.status === "DONE",
            }
          : task
      )
    );
  };

  return (
    <TasksContext.Provider value={{ tasks, setTasks, updateTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) throw new Error("useTasks must be used within TasksProvider");
  return context;
};
