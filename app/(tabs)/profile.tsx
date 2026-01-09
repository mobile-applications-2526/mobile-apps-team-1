import { AntDesign, Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingUsername, setEditingUsername] = useState('');
  const [updatingUser, setUpdatingUser] = useState(false);

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

  const openSettingsModal = () => {
    if (user) {
      setEditingUsername(user.username);
      setShowSettingsModal(true);
    }
  };

  const handleUpdateUser = async () => {
    if (!user) return;

    if (!editingUsername.trim()) {
      Alert.alert('Validation Error', 'Username cannot be empty');
      return;
    }

    try {
      setUpdatingUser(true);
      await UserService.updateUser(user.id, editingUsername.trim());
      setUser({ ...user, username: editingUsername.trim() });
      setShowSettingsModal(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Failed to update user:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setUpdatingUser(false);
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
            <TouchableOpacity style={styles.settingsButton} onPress={openSettingsModal}>
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

      <Modal
        visible={showSettingsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                <AntDesign name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  value={editingUsername}
                  onChangeText={setEditingUsername}
                  placeholder="Enter your username"
                  placeholderTextColor="#9CA3AF"
                  editable={!updatingUser}
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowSettingsModal(false)}
                disabled={updatingUser}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, updatingUser && styles.buttonDisabled]}
                onPress={handleUpdateUser}
                disabled={updatingUser}
              >
                {updatingUser ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  modalForm: {
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
