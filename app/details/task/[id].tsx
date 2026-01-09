import ScreenHeader from "@/components/ScreenHeader";
import TaskService from "@/services/TaskService";
import { Subtask, Task } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Status = "TODO" | "DOING" | "DONE" | "EXPIRED";

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTask();
  }, []);

  const loadTask = async () => {
    const tasks = await TaskService.getTasks();
    const found = tasks.find((t) => t.id === id);
    if (found) setTask(found);
  };

  const calculateProgress = (task: Task) => {
    const total = task.subtasks.length;
    const done = task.subtasks.filter((s) => s.status === "DONE").length;
    return total > 0
      ? Math.round((done / total) * 100)
      : task.status === "DONE"
      ? 100
      : 0;
  };

  const castStatus = (status: string): Status => {
    if (["TODO", "DOING", "DONE", "EXPIRED"].includes(status))
      return status as Status;
    return "TODO";
  };

  const toggleSubtaskStatus = async (subtaskId: string) => {
    if (!task) return;
    const updatedSubtasks: Subtask[] = task.subtasks.map((s) =>
      s.id === subtaskId
        ? { ...s, status: castStatus(s.status === "DONE" ? "TODO" : "DONE") }
        : s
    );

    // Determine task status based on subtasks
    const updatedTask: Task = {
      ...task,
      subtasks: updatedSubtasks,
      status: updatedSubtasks.every((s) => s.status === "DONE")
        ? "DONE"
        : "TODO",
    };
    updatedTask.progress = calculateProgress(updatedTask);

    setTask(updatedTask);

    try {
      await TaskService.updateTask(updatedTask);
    } catch (error) {
      console.error("Failed to update subtask:", error);
      loadTask();
    }
  };

  if (!task) return null;

  return (
    <View style={styles.container}>
      <ScreenHeader title={task.title} />

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Subtasks</Text>

        {task.subtasks?.map(
          (subtask) =>
            subtask?.id && (
              <View key={subtask.id} style={styles.subtaskRow}>
                <TouchableOpacity
                  style={styles.subtask}
                  onPress={() =>
                    subtask.status !== "EXPIRED" &&
                    toggleSubtaskStatus(subtask.id)
                  }
                >
                  <Text
                    style={[
                      styles.subtaskText,
                      subtask.status === "DONE" && styles.done,
                      subtask.status === "EXPIRED" && styles.expired,
                    ]}
                  >
                    {subtask.title}
                  </Text>
                </TouchableOpacity>
              </View>
            )
        )}

        <View style={styles.progress}>
          <View style={styles.barBg}>
            <View
              style={[styles.barFill, { width: `${task.progress ?? 0}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{task.progress ?? 0}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  card: {
    margin: 16,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  taskRow: {
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtaskRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subtask: {
    paddingVertical: 10,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  subtaskText: {
    fontSize: 16,
    color: "#111827",
  },
  detailsButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  detailsText: {
    color: "#3B82F6",
    fontWeight: "500",
  },
  done: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
  expired: {
    textDecorationLine: "line-through",
    color: "#F87171",
  },
  progress: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  barBg: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
  },
  barFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 3,
  },
  progressText: {
    width: 40,
    textAlign: "right",
    fontWeight: "500",
    color: "#4B5563",
  },
});
