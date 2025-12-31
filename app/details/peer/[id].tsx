import ScreenHeader from '@/components/ScreenHeader';
import UserService from '@/services/UserService';
import { User } from '@/types';
import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PeerDetailScreen() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await UserService.getUserById(id as string);
      setUser(data);
    } catch (err) {
      console.error('Failed to load user profile', err);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Peer Profile" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Peer Profile" />
        <View style={styles.center}>
          <Text style={styles.errorText}>{error || 'User not found'}</Text>
        </View>
      </View>
    );
  }

  const profile = user.profile;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Peer Profile" />
      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <AntDesign name="user" size={40} color="#4B5563" />
            </View>

            <Text style={styles.name}>{user.username}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.bio}>
            {profile?.bio ?? 'No bio yet'}
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {profile?.studyProgram ?? '-'}
              </Text>
              <Text style={styles.statLabel}>Study Program</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {profile?.yearOfStudy ?? '-'}
              </Text>
              <Text style={styles.statLabel}>Year</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  bio: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
});
