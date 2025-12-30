import { AntDesign, Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Peer } from '../types';

interface PeerCardProps {
  peer: Peer;
  onPress: () => void;
}

const PeerCard: React.FC<PeerCardProps> = ({ peer, onPress }) => {
  const isPerson = peer.type === 'person' || peer.type === 'friend';

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.avatar}>
            {isPerson ? (
              <AntDesign name="user" size={20} color="#4B5563" />
            ) : (
              <Feather name="users" size={20} color="#4B5563" />
            )}
          </View>
          <View>
            <Text style={styles.name}>{peer.name}</Text>
            <Text style={styles.subtitle}>
              {isPerson ? peer.education : `${peer.members} members`}
            </Text>
          </View>
        </View>
        <AntDesign name="right" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#D1D5DB',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default PeerCard;
