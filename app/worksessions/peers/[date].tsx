import ScreenHeader from '@/components/ScreenHeader';
import { api } from '@/services/api';
import UserService from '@/services/UserService';
import { WorkSession } from '@/types';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

export default function PeerWorksessionsScreen() {
    const { date } = useLocalSearchParams();
    const [sessions, setSessions] = useState<WorkSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (date) {
            loadSessions(date.toString());
        }
    }, [date]);

    const loadSessions = async (dayKey: string) => {
        try {
            const allSessions = await api.getSessions(dayKey);
            // Filter for peer sessions and sort by time
            const peerSessions = allSessions
                .filter(s => !s.isUser)
                .sort((a, b) => a.time.localeCompare(b.time));

            // Fetch user names for each peer session
            const sessionsWithNames = await Promise.all(
                peerSessions.map(async (session) => {
                    try {
                        const user = await UserService.getUserById(session.ownerId);
                        return {
                            ...session,
                            ownerName: user.username || session.ownerName
                        };
                    } catch (error) {
                        console.error(`Failed to fetch user ${session.ownerId}:`, error);
                        return session; // Keep original session if fetch fails
                    }
                })
            );

            setSessions(sessionsWithNames);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderSessionItem = ({ item }: { item: WorkSession }) => (
        <View style={styles.sessionCard}>
            <View style={styles.timeContainer}>
                <Feather name="clock" size={16} color="#6B7280" />
                <Text style={styles.timeText}>{item.time}</Text>
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.peerName}>{item.ownerName}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Peer</Text>
                    </View>
                </View>
                <Text style={styles.taskTitle}>{item.taskTitle}</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScreenHeader title={`Peer Sessions - ${date}`} />

            <FlatList
                data={sessions}
                renderItem={renderSessionItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No peer sessions found for this day.</Text>
                    </View>
                }
            />
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
    listContent: {
        padding: 16,
        gap: 12,
    },
    sessionCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 16,
        flexDirection: 'row',
        gap: 16,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 6,
        width: 100,
    },
    timeText: {
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '500',
    },
    detailsContainer: {
        flex: 1,
        gap: 4,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    peerName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    badge: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 10,
        color: '#1E40AF',
        fontWeight: '500',
    },
    taskTitle: {
        fontSize: 15,
        color: '#374151',
    },
    emptyState: {
        padding: 32,
        alignItems: 'center',
    },
    emptyStateText: {
        color: '#6B7280',
        fontSize: 16,
    },
});
