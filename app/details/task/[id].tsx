import ScreenHeader from "@/components/ScreenHeader";
import TaskService from "@/services/TaskService";
import { Subtask, Task } from "@/types";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Status = "TODO" | "DOING" | "DONE" | "EXPIRED";

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [loading, setLoading] = useState(false);

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

  const createSubtask = async () => {
    if (!task || !subtaskTitle.trim()) {
      Alert.alert("Error", "Please enter a subtask title");
      return;
    }

    setLoading(true);
    try {
      const newSubtask = await TaskService.createSubtask(task.id, subtaskTitle);
      
      // Update local state immediately
      const updatedSubtasks = [...task.subtasks, newSubtask];
      const updatedTask: Task = {
        ...task,
        subtasks: updatedSubtasks,
      };
      updatedTask.progress = calculateProgress(updatedTask);
      
      setTask(updatedTask);
      setSubtaskTitle("");
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to create subtask:", error);
      Alert.alert("Error", "Failed to create subtask");
    } finally {
      setLoading(false);
    }
  };

  const deleteSubtaskHandler = (subtaskId: string) => {
    Alert.alert(
      "Delete Subtask",
      "Are you sure you want to delete this subtask?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (!task) return;
              await TaskService.deleteSubtask(task.id, subtaskId);
              
              const updatedSubtasks = task.subtasks.filter(s => s.id !== subtaskId);
              const updatedTask: Task = {
                ...task,
                subtasks: updatedSubtasks,
              };
              updatedTask.progress = calculateProgress(updatedTask);
              setTask(updatedTask);
            } catch (error) {
              console.error("Failed to delete subtask:", error);
              Alert.alert("Error", "Failed to delete subtask");
            }
          },
        },
      ]
    );
  };

  const deleteTaskHandler = () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await TaskService.deleteTask(task!.id);
              router.back();
            } catch (error) {
              console.error("Failed to delete task:", error);
              Alert.alert("Error", "Failed to delete task");
            }
          },
        },
      ]
    );
  };

  if (!task) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ScreenHeader title={task.title} />
        <TouchableOpacity 
          style={styles.deleteTaskButton}
          onPress={deleteTaskHandler}
        >
          <Feather name="trash-2" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

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
                <TouchableOpacity onPress={() => deleteSubtaskHandler(subtask.id)}>
                  <Feather name="trash-2" size={18} color="#EF4444" />
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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Subtask</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter subtask title"
              value={subtaskTitle}
              onChangeText={setSubtaskTitle}
              editable={!loading}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setSubtaskTitle("");
                }}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.addButton, loading && styles.buttonDisabled]}
                onPress={createSubtask}
                disabled={loading}
              >
                <Text style={styles.addButtonText}>{loading ? "Creating..." : "Add"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  deleteTaskButton: {
    padding: 8,
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
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    fontSize: 16,
    color: "#111827",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: "#3B82F6",
  },
  addButtonText: {
    color: "white",
    fontWeight: "500",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
