import ScreenHeader from '@/components/ScreenHeader';
import GroupService from '@/services/GroupService';
import { getUserId } from '@/services/StorageService';
import UserService from '@/services/UserService';
import { GroupDetail, User } from '@/types';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { ActivityIndicator, Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [groupDetail, setGroupDetail] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      const userId = await getUserId();
      setCurrentUserId(userId);
      const role = await GroupService.getCurrentUserRoleInGroup(id as string);
      setCurrentUserRole(role);
      await loadGroupDetails();
    };
    loadInitialData();
  }, [id]);

  const loadGroupDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GroupService.getGroupWithMembers(id as string);
      setGroupDetail(data);
    } catch (err) {
      console.error('Failed to load group details', err);
      setError('Failed to load group details');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableUsers = async () => {
    if (!groupDetail) return;
    try {
      setLoadingUsers(true);
      const allUsers = await UserService.getUsers();
      const memberIds = groupDetail.members.map(m => m.userId);
      const available = allUsers
        .filter(user => !memberIds.includes(user.id))
        .map(peer => ({
          id: peer.id,
          username: peer.name,
          email: '',
        }));
      setAvailableUsers(available);
    } catch (err) {
      console.error('Failed to load users:', err);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAddMember = async (userId: string) => {
    try {
      await GroupService.addMemberToGroup(id as string, userId);
      await loadGroupDetails();
      setShowAddMemberModal(false);
    } catch (err) {
      console.error('Failed to add member:', err);
      Alert.alert('Error', 'Failed to add member to group');
    }
  };

  const handleMemberPress = (userId: string) => {
    router.push(`/details/peer/${userId}`);
  };

  const handleRemoveMember = (userId: string, username: string, memberRole: string) => {
    if (memberRole.toLowerCase() === 'owner') {
      Alert.alert('Error', 'Cannot remove the owner from the group');
      return;
    }

    if (currentUserRole?.toLowerCase() !== 'owner') {
      Alert.alert('Error', 'Only the owner can remove members');
      return;
    }

    Alert.alert(
      "Remove Member",
      `Are you sure you want to remove ${username} from the group?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await GroupService.removeMemberFromGroup(id as string, userId);
              await loadGroupDetails();
            } catch (err) {
              console.error('Failed to remove member:', err);
              Alert.alert('Error', 'Failed to remove member from group');
            }
          },
        },
      ]
    );
  };

  const openAddMemberModal = () => {
    if (currentUserRole?.toLowerCase() !== 'owner') {
      Alert.alert('Error', 'Only the owner can add members');
      return;
    }
    loadAvailableUsers();
    setShowAddMemberModal(true);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Group Detail" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </View>
    );
  }

  if (error || !groupDetail) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Group Detail" />
        <View style={styles.center}>
          <Text style={styles.errorText}>{error || 'Group not found'}</Text>
        </View>
      </View>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner':
        return '#2563EB';
      case 'moderator':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner':
        return 'crown';
      case 'moderator':
        return 'shield-check';
      default:
        return 'account';
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Group Detail" />
      <ScrollView style={styles.content}>
        <View style={styles.groupCard}>
          <View style={styles.groupHeader}>
            <View style={styles.iconContainer}>
              <AntDesign name="team" size={40} color="#4B5563" />
            </View>
            <Text style={styles.name}>{groupDetail.name}</Text>
            <Text style={styles.members}>
              {groupDetail.members.length} {groupDetail.members.length === 1 ? 'Member' : 'Members'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Group Members</Text>
              {currentUserRole?.toLowerCase() === 'owner' && (
                <TouchableOpacity 
                  style={styles.addMemberButton}
                  onPress={openAddMemberModal}
                >
                  <AntDesign name="plus" size={20} color="white" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.membersList}>
              {groupDetail!.members.map((member, index) => (
                <View key={member.userId} style={styles.memberCard}>
                  <TouchableOpacity
                    style={styles.memberTouchable}
                    onPress={() => handleMemberPress(member.userId)}
                  >
                    <View style={styles.memberInfo}>
                      <View style={styles.memberAvatar}>
                        <MaterialCommunityIcons
                          name={getRoleIcon(member.role)}
                          size={20}
                          color="white"
                        />
                      </View>
                      <View style={styles.memberDetails}>
                        <Text style={styles.memberName}>{member.username}</Text>
                        <Text
                          style={[
                            styles.memberRole,
                            { color: getRoleColor(member.role) },
                          ]}
                        >
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </Text>
                      </View>
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color="#D1D5DB"
                    />
                  </TouchableOpacity>
                  {currentUserRole?.toLowerCase() === 'owner' && member.role.toLowerCase() !== 'owner' && (
                    <TouchableOpacity
                      style={styles.removeMemberButton}
                      onPress={() => handleRemoveMember(member.userId, member.username, member.role)}
                    >
                      <MaterialCommunityIcons
                        name="trash-can"
                        size={18}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showAddMemberModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddMemberModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Member</Text>
              <TouchableOpacity onPress={() => setShowAddMemberModal(false)}>
                <AntDesign name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            {loadingUsers ? (
              <ActivityIndicator size="large" color="#2563EB" style={{ margin: 20 }} />
            ) : (
              <FlatList
                data={availableUsers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.userItem}
                    onPress={() => handleAddMember(item.id)}
                  >
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{item.username}</Text>
                      <Text style={styles.userEmail}>{item.email}</Text>
                    </View>
                    <AntDesign name="plus" size={20} color="#2563EB" />
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No users available to add</Text>
                }
              />
            )}
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
  content: {
    padding: 16,
  },
  groupCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  groupHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  members: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 20,
  },
  infoSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  addMemberButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  membersList: {
    gap: 8,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  memberTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 12,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '40%',
    maxHeight: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 20,
    fontSize: 16,
  },
  removeMemberButton: {
    padding: 8,
    paddingRight: 12,
  },
});
