import ScreenHeader from '@/components/ScreenHeader';
import GroupService from '@/services/GroupService';
import { GroupDetail } from '@/types';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams();
  const [groupDetail, setGroupDetail] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGroupDetails();
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
            <Text style={styles.sectionTitle}>Group Members</Text>
            <View style={styles.membersList}>
              {groupDetail.members.map((member, index) => (
                <View key={member.userId} style={styles.memberCard}>
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
                </View>
              ))}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  membersList: {
    gap: 8,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
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
});
