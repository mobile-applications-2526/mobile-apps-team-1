import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WorkSession } from '../types';

interface SessionCardProps {
  session: WorkSession;
  onPress: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.taskTitle}>{session.taskTitle}</Text>
          <View style={styles.metaContainer}>
            <AntDesign name="clock-circle" size={12} color="#6B7280" />
            <Text style={styles.metaText}>
              {session.time} • {session.ownerName}
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
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: 'white',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default SessionCard;
