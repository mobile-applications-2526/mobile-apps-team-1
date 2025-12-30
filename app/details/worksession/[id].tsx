import ScreenHeader from '@/components/ScreenHeader';
import { api } from '@/services/api';
import { WorkSession } from '@/types';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SessionDetailScreen() {
    const { id } = useLocalSearchParams();
    const [session, setSession] = useState<WorkSession | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadSession(id.toString());
        }
    }, [id]);

    const loadSession = async (sessionId: string) => {
        try {
            const data = await api.getSession(sessionId);
            setSession(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (!session) {
        return (
            <View style={styles.container}>
                <ScreenHeader title="Session Not Found" />
                <View style={styles.center}>
                    <Text style={styles.errorText}>Session not found</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScreenHeader title={session.taskTitle || "Work Session"} />

            <View style={styles.content}>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.iconContainer}>
                            <Feather name="calendar" size={20} color="#4B5563" />
                        </View>
                        <View>
                            <Text style={styles.label}>Day</Text>
                            <Text style={styles.value}>{session.day}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <View style={styles.iconContainer}>
                            <Feather name="clock" size={20} color="#4B5563" />
                        </View>
                        <View>
                            <Text style={styles.label}>Time</Text>
                            <Text style={styles.value}>{session.time}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <View style={styles.iconContainer}>
                            <Feather name="user" size={20} color="#4B5563" />
                        </View>
                        <View>
                            <Text style={styles.label}>Host</Text>
                            <Text style={styles.value}>{session.ownerName}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.primaryButton}>
                        <Feather name="user-plus" size={20} color="white" style={styles.buttonIcon} />
                        <Text style={styles.primaryButtonText}>Invite Peers</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton}>
                        <Feather name="video" size={20} color="#2563EB" style={styles.buttonIcon} />
                        <Text style={styles.secondaryButtonText}>Join Session</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 16,
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    label: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginLeft: 56, // Align with text start
    },
    errorText: {
        fontSize: 16,
        color: '#6B7280',
    },
    actions: {
        gap: 12,
    },
    primaryButton: {
        backgroundColor: '#2563EB',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
    },
    primaryButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    secondaryButton: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2563EB',
    },
    secondaryButtonText: {
        color: '#2563EB',
        fontWeight: '600',
        fontSize: 16,
    },
    buttonIcon: {
        marginRight: 8,
    }
});
