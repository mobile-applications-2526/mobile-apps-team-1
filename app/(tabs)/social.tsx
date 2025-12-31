import FilterBadge from '@/components/FilterBadge';
import PeerCard from '@/components/PeerCard';
import GroupService from '@/services/GroupService';
import UserService from '@/services/UserService';
import { Peer } from '@/types';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SocialScreen() {
  const [items, setItems] = useState<Peer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'friend' | 'group'>('all');
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await UserService.getUsers();
      const data2 = await GroupService.getGroups();
      const allPeers = [...data, ...data2];
      setItems(allPeers);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
      // For demo purposes, we treat 'person' as potential friends in search, 
      // but here we filter by 'friend' type ideally. 
      // The mock data has specific 'friend' types.
      if (filter === 'all') return item.type === 'friend' || item.type === 'group';
      return item.type === filter;
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
        <Text style={styles.headerTitle}>Social</Text>
        <View style={styles.filterContainer}>
          <FilterBadge 
            label="Friends" 
            isActive={filter === 'friend'} 
            onPress={() => setFilter(filter === 'friend' ? 'all' : 'friend')} 
          />
          <FilterBadge 
            label="Groups" 
            isActive={filter === 'group'} 
            onPress={() => setFilter(filter === 'group' ? 'all' : 'group')} 
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.list}>
          {filteredItems.map(item => (
            <PeerCard
              key={item.id} 
              peer={item} 
              onPress={() => router.push(item.type === 'group' ? `/details/group/${item.id}` : `/details/peer/${item.id}`)}
            />
          ))}
           {filteredItems.length === 0 && (
              <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No friends or groups found</Text>
              </View>
          )}
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
  list: {
    padding: 16,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#6B7280',
    fontSize: 16,
  },
});
