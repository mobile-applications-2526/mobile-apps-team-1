import SessionCard from '@/components/SessionCard';
import { AntDesign, Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../../services/api';
import { DaySessionGroup } from '../../types';

// Helper function to get Monday of the week for a given date
const getMonday = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
};

export default function CalendarScreen() {
    const [schedule, setSchedule] = useState<DaySessionGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getMonday(new Date()));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const router = useRouter();

    useEffect(() => {
        loadData();
    }, [currentWeekStart]);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await api.getWeekSchedule(currentWeekStart);
            setSchedule(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    };

    const formatWeekRange = () => {
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(currentWeekStart.getDate() + 6);

        const formatShort = (date: Date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };

        return `${formatShort(currentWeekStart)} - ${formatShort(weekEnd)}`;
    };

    const navigateWeek = (direction: 'prev' | 'next') => {
        const newWeekStart = new Date(currentWeekStart);
        newWeekStart.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentWeekStart(newWeekStart);
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS, close on Android
        if (selectedDate) {
            const monday = getMonday(selectedDate);
            setCurrentWeekStart(monday);
        }
    };

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
                <Text style={styles.headerTitle}>Calendar</Text>
                <View style={styles.weekNavigation}>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.weekRange}>{formatWeekRange()}</Text>
                    </TouchableOpacity>
                    <View style={styles.navigationButtons}>
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={() => navigateWeek('prev')}
                        >
                            <AntDesign name="left" size={20} color="#4B5563" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={() => navigateWeek('next')}
                        >
                            <AntDesign name="right" size={20} color="#4B5563" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={currentWeekStart}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                />
            )}

            <ScrollView style={styles.content}>
                <View style={styles.scheduleContainer}>
                    {schedule.map((dayGroup) => {
                        const peerCount = dayGroup.sessions.filter(s => !s.isUser).length;
                        const userSessions = dayGroup.sessions.filter(s => s.isUser);
                        return (
                            <View key={dayGroup.key} style={styles.dayCard}>
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
                    })}
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.fab}>
                <Feather name="plus" size={24} color="white" />
            </TouchableOpacity>
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
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    weekNavigation: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    weekRange: {
        fontSize: 16,
        color: '#4B5563',
    },
    navigationButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    navButton: {
        padding: 8,
        borderRadius: 4,
        backgroundColor: '#F3F4F6',
    },
    content: {
        flex: 1,
    },
    scheduleContainer: {
        padding: 16,
        gap: 16,
        paddingBottom: 80,
    },
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
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#2563EB',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});
