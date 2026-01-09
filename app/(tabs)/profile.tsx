import { AntDesign, Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { User } from '@/types';
import { getUserId } from '../../services/StorageService';
import UserService from '../../services/UserService';

import { useSession } from '../context/AuthContext';

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { signOut } = useSession();

  useEffect(() => {
    loadUser();
  }, []);

  const showAlert = (message: string, onConfirm?: () => void) => {
    if (onConfirm) {
      if (Platform.OS === 'web') {
        if (window.confirm(message)) onConfirm();
      } else {
        Alert.alert(
          message,
          '',
          [
            { text: 'Nee', style: 'cancel' },
            { text: 'Ja', onPress: onConfirm },
          ]
        );
      }
    } else {
      Platform.OS === 'web' ? window.alert(message) : Alert.alert(message);
    }
  };

  const handleLogout = () => {
    showAlert(
      'Weet je zeker dat je wilt uitloggen?',
      async () => {
        try {
          await signOut();
          // Navigation is handled automatically by the auth context in _layout.tsx
        } catch (error) {
          showAlert('Fout');
        }
      }
    );
  };

  const loadUser = async () => {
    try {
      const userId = await getUserId();
      if (!userId) throw new Error('User not logged in');

      const data = await UserService.getUserById(userId);
      setUser(data);
    } catch (error) {
      console.error('Failed to load profile', error);
      await signOut();
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  const profile = user.profile;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {/* Header – alles goed hierbinnen */}
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.settingsButton}>
              <Feather name="settings" size={24} color="#4B5563" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Feather name="log-out" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  settingsButton: {
    padding: 4,
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoutButton: {
    padding: 4,
  },
});
