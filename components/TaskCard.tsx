import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Subtask, Task } from "../types";

interface TaskCardProps {
  task: Task;
  onPress: () => void; // navigate to details
  toggleTask?: (taskId: string) => void;
  toggleSubtask?: (
    taskId: string,
    subtaskId: string,
    newStatus: Subtask["status"]
  ) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  toggleTask,
  toggleSubtask,
}) => {
  const isCompleted = task.status === "DONE";

  const getStatusColor = () => {
    switch (task.status) {
      case "DONE":
        return "#10B981";
      case "DOING":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, isCompleted && styles.completedTitle]}>
            {task.title}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor() + "20" },
            ]}
          >
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {task.status}
            </Text>
          </View>
        </View>

        {/* Task toggle button */}
        {toggleTask && (
          <TouchableOpacity onPress={() => toggleTask(task.id)}>
            <Text style={styles.toggleButton}>✓</Text>
          </TouchableOpacity>
        )}
      </View>

      {task.subtasks && task.subtasks.length > 0 && (
        <View style={styles.subtaskInfo}>
          {task.subtasks.map((sub) => (
            <TouchableOpacity
              key={sub.id}
              onPress={() =>
                toggleSubtask?.(
                  task.id,
                  sub.id,
                  sub.status === "DONE" ? "TODO" : "DONE"
                )
              }
            >
              <Text
                style={[
                  styles.subtaskText,
                  sub.status === "DONE" && styles.completedTitle,
                ]}
              >
                {sub.title} [{sub.status}]
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.progressSection}>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${task.progress || 0}%`, backgroundColor: "#10B981" },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{task.progress || 0}%</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  completedTitle: {
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  toggleButton: {
    fontSize: 18,
    color: "#10B981",
    fontWeight: "bold",
  },
  subtaskInfo: {
    marginTop: 8,
    marginBottom: 4,
  },
  subtaskText: {
    fontSize: 12,
    color: "#6B7280",
  },
  progressSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4B5563",
    width: 32,
    textAlign: "right",
  },
});

export default TaskCard;
