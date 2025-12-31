import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DaySessionGroup } from '../types';
import SessionCard from './SessionCard';

interface DayScheduleProps {
    dayGroup: DaySessionGroup;
}

export default function DaySchedule({ dayGroup }: DayScheduleProps) {
    const router = useRouter();
    const peerCount = dayGroup.sessions.filter(s => !s.isUser).length;
    const userSessions = dayGroup.sessions.filter(s => s.isUser);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    };

    return (
        <View style={styles.dayCard}>
            <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{formatDate(dayGroup.key)}</Text>
                {peerCount > 0 && (
                    <TouchableOpacity
                        onPress={() => {
                            router.push(`../worksessions/peers/${dayGroup.key}`);
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
                    onPress={() => router.push(`../details/worksession/${session.id}`)}
                />
            ))}

            {userSessions.length === 0 && (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No sessions</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
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
});
