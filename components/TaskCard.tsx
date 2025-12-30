import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
  const isPastDue = task.pastDue;
  const isCompleted = task.completed;

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            isCompleted && styles.completedTitle,
            isPastDue && styles.pastDueTitle,
          ]}
        >
          {task.title}
        </Text>
        <AntDesign name="right" size={20} color="#9CA3AF" />
      </View>
      
      <Text style={[styles.deadline, isPastDue && styles.pastDueText]}>
        Due: {task.deadline}
      </Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${task.progress}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{task.progress}%</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  completedTitle: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  pastDueTitle: {
    color: '#DC2626',
  },
  deadline: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  pastDueText: {
    color: '#EF4444',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    width: 32,
    textAlign: 'right',
  },
});

export default TaskCard;
