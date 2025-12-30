import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import ScreenHeader from '@/components/ScreenHeader';
import React from 'react';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <ScreenHeader title="Task Detail" />
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.description}>
            Task detail for ID: {id}. {'\n'}
            Task overview with subtasks, progress, and option to schedule worksessions.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  description: {
    color: '#4B5563',
    lineHeight: 24,
  },
});
