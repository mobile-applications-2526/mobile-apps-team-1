import FilterBadge from "@/components/FilterBadge";
import TaskCard from "@/components/TaskCard";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TaskService from "../../services/TaskService";
import { Subtask, Task } from "../../types";

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "ALL" | "TODO" | "DOING" | "DONE"
  >("ALL");
  const router = useRouter();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await TaskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const toggleTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus: Task["status"] = task.status === "DONE" ? "TODO" : "DONE";

    const updatedSubtasks: Subtask[] = task.subtasks.map((s) => ({
      ...s,
      status: newStatus === "DONE" ? "DONE" : "TODO",
    }));

    const updatedTask: Task = {
      ...task,
      status: newStatus,
      subtasks: updatedSubtasks,
      progress:
        updatedSubtasks.length > 0
          ? Math.round(
              (updatedSubtasks.filter((s) => s.status === "DONE").length /
                updatedSubtasks.length) *
                100
            )
          : newStatus === "DONE"
          ? 100
          : 0,
    };

    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

    try {
      await TaskService.updateTask(updatedTask);
    } catch (err) {
      console.error(err);
      loadData();
    }
  };

  const toggleSubtask = async (
    taskId: string,
    subtaskId: string,
    newStatus: Subtask["status"]
  ) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedSubtasks: Subtask[] = task.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, status: newStatus } : s
    );

    const updatedTask: Task = {
      ...task,
      subtasks: updatedSubtasks,
      status: updatedSubtasks.every((s) => s.status === "DONE")
        ? "DONE"
        : "TODO",
      progress:
        updatedSubtasks.length > 0
          ? Math.round(
              (updatedSubtasks.filter((s) => s.status === "DONE").length /
                updatedSubtasks.length) *
                100
            )
          : 0,
    };

    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

    try {
      await TaskService.updateTask(updatedTask);
    } catch (err) {
      console.error(err);
      loadData();
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === "ALL") return true;
    return task.status === activeFilter;
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          <FilterBadge
            label="All"
            isActive={activeFilter === "ALL"}
            onPress={() => setActiveFilter("ALL")}
          />
          <FilterBadge
            label="To Do"
            isActive={activeFilter === "TODO"}
            onPress={() => setActiveFilter("TODO")}
          />
          <FilterBadge
            label="Done"
            isActive={activeFilter === "DONE"}
            onPress={() => setActiveFilter("DONE")}
          />
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.taskList}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                toggleTask={toggleTask}
                toggleSubtask={toggleSubtask}
                onPress={() => router.push(`/details/task/${task.id}`)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No tasks found</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('../tasks/add')}
      >
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: "row",
  },
  content: {
    flex: 1,
  },
  taskList: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyState: {
    padding: 20,
    alignItems: "center",
  },
  emptyStateText: {
    color: "#6B7280",
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
