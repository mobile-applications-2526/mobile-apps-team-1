import FilterBadge from '@/components/FilterBadge';
import PeerCard from '@/components/PeerCard';
import GroupService from '@/services/GroupService';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { api } from '../../services/api';
import { Peer } from '../../types';

export default function SearchScreen() {
  const [items, setItems] = useState<Peer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState<'all' | 'person' | 'group'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.getPeers();
      const data2 = await GroupService.getGroups();
      console.log(data2);
      setItems(data2);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesType = searchFilter === 'all' || item.type === searchFilter || (searchFilter === 'person' && item.type === 'friend');
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (item.education && item.education.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesQuery;
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
        <Text style={styles.headerTitle}>Search</Text>
        <TextInput
            placeholder="Search peers or education..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
        />
        <View style={styles.filterContainer}>
          <FilterBadge 
            label="People" 
            isActive={searchFilter === 'person'} 
            onPress={() => setSearchFilter(searchFilter === 'person' ? 'all' : 'person')} 
          />
          <FilterBadge 
            label="Groups" 
            isActive={searchFilter === 'group'} 
            onPress={() => setSearchFilter(searchFilter === 'group' ? 'all' : 'group')} 
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
                  <Text style={styles.emptyStateText}>No results found</Text>
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
  searchInput: {
      backgroundColor: '#F3F4F6',
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      fontSize: 14,
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
