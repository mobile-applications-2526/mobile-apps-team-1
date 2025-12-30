import FilterBadge from '@/components/FilterBadge';
import TaskCard from '@/components/TaskCard';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../../services/api';
import { Task } from '../../types';


export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showPastDue, setShowPastDue] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (!showCompleted && task.completed) return false;
    if (!showPastDue && task.pastDue) return false;
    return true;
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          <FilterBadge 
            label="Completed" 
            isActive={showCompleted} 
            onPress={() => setShowCompleted(!showCompleted)} 
          />
          <FilterBadge 
            label="Past due" 
            isActive={showPastDue} 
            onPress={() => setShowPastDue(!showPastDue)} 
          />
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.taskList}>
            {filteredTasks.length > 0 ? filteredTasks.map(task => (
                <TaskCard 
                    key={task.id} 
                    task={task} 
                    onPress={() => router.push(`/details/task/${task.id}`)}
                />
            )) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No tasks found</Text>
                </View>
            )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
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
      alignItems: 'center',
  },
  emptyStateText: {
      color: '#6B7280',
      fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
