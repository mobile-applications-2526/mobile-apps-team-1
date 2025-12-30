import SessionCard from '@/components/SessionCard';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../../services/api';
import { DaySessionGroup } from '../../types';

export default function CalendarScreen() {
  const [schedule, setSchedule] = useState<DaySessionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.getWeekSchedule();
      setSchedule(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.iconButton}>
            <AntDesign name="left" size={20} color="#4B5563" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>December 2024</Text>
          <TouchableOpacity style={styles.iconButton}>
            <AntDesign name="right" size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.todayButton}>
          <Text style={styles.todayButtonText}>Today</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.scheduleContainer}>
          {schedule.map((dayGroup) => {
            const peerCount = dayGroup.sessions.filter(s => !s.isUser).length;
            const userSessions = dayGroup.sessions.filter(s => s.isUser);
            return (
              <View key={dayGroup.key} style={styles.dayCard}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayTitle}>{dayGroup.day}</Text>
                  {peerCount > 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        router.push({ pathname: '/details/worksessions/[date]', params: { date: dayGroup.key } });
                      }}
                      style={styles.peerCount}
                    >
                      <Feather name="users" size={12} color="#2563EB" />
                      <Text style={styles.peerCountText}>
                        {peerCount} {peerCount === 1 ? 'person' : 'people'} working
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {userSessions.map(session => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onPress={() => router.push({ pathname: '/details/session/[id]', params: { id: session.id } })}
                  />
                ))}

                {userSessions.length === 0 && (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No sessions</Text>
                  </View>
                )}
              </View>
            );
          })}
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  iconButton: {
    padding: 4,
    borderRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  todayButton: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  todayButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  scheduleContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 80,
  },
  dayCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  dayHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayTitle: {
    fontWeight: '500',
    color: '#111827',
  },
  peerCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  peerCountText: {
    fontSize: 12,
    color: '#2563EB',
  },
  emptyState: {
    padding: 12,
  },
  emptyStateText: {
    color: '#9CA3AF',
    fontSize: 14,
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
