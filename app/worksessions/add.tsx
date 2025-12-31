import { useSession } from '@/app/context/AuthContext';
import { getUserId } from '@/services/StorageService';
import TaskService from '@/services/TaskService';
import WorksessionService, { CreateWorksessionRequest } from '@/services/WorksessionService';
import { Task } from '@/types';
import { AntDesign, Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function AddWorksessionScreen() {
    const router = useRouter();
    const { session } = useSession();
    const [title, setTitle] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showTaskSelector, setShowTaskSelector] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(Date.now() + 3600000)); // 1 hour later
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchingTasks, setFetchingTasks] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setFetchingTasks(true);
                const [id, fetchedTasks] = await Promise.all([
                    getUserId(),
                    TaskService.getTasks()
                ]);
                setCurrentUserId(id);
                setTasks(fetchedTasks);
            } catch (error) {
                console.error('Error loading initial data:', error);
                Alert.alert('Error', 'Failed to load tasks. Using manual entry fallback.');
            } finally {
                setFetchingTasks(false);
            }
        };
        loadInitialData();
    }, []);

    const formatDateTime = (date: Date): string => {
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const toISOString = (date: Date): string => {
        // Format: YYYY-MM-DDTHH:mm:ss
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const onStartDateChange = (event: any, selectedDate?: Date) => {
        setShowStartDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            const newStartDate = new Date(startDate);
            newStartDate.setFullYear(selectedDate.getFullYear());
            newStartDate.setMonth(selectedDate.getMonth());
            newStartDate.setDate(selectedDate.getDate());
            setStartDate(newStartDate);
        }
    };

    const onStartTimeChange = (event: any, selectedTime?: Date) => {
        setShowStartTimePicker(Platform.OS === 'ios');
        if (selectedTime) {
            const newStartDate = new Date(startDate);
            newStartDate.setHours(selectedTime.getHours());
            newStartDate.setMinutes(selectedTime.getMinutes());
            setStartDate(newStartDate);
        }
    };

    const onEndDateChange = (event: any, selectedDate?: Date) => {
        setShowEndDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            const newEndDate = new Date(endDate);
            newEndDate.setFullYear(selectedDate.getFullYear());
            newEndDate.setMonth(selectedDate.getMonth());
            newEndDate.setDate(selectedDate.getDate());
            setEndDate(newEndDate);
        }
    };

    const onEndTimeChange = (event: any, selectedTime?: Date) => {
        setShowEndTimePicker(Platform.OS === 'ios');
        if (selectedTime) {
            const newEndDate = new Date(endDate);
            newEndDate.setHours(selectedTime.getHours());
            newEndDate.setMinutes(selectedTime.getMinutes());
            setEndDate(newEndDate);
        }
    };

    const validateForm = (): boolean => {
        if (!title.trim()) {
            Alert.alert('Validation Error', 'Please enter a title');
            return false;
        }

        if (!selectedTask) {
            Alert.alert('Validation Error', 'Please select a task');
            return false;
        }

        if (startDate >= endDate) {
            Alert.alert('Validation Error', 'Start time must be before end time');
            return false;
        }

        if (!currentUserId) {
            Alert.alert('Error', 'User not authenticated');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const request: CreateWorksessionRequest = {
                title: title.trim(),
                timeRange: {
                    startTime: toISOString(startDate),
                    endTime: toISOString(endDate),
                },
                subjectId: selectedTask!.id,
                collaboratorId: currentUserId!,
            };

            await WorksessionService.createWorksession(request);

            setLoading(false);

            if (Platform.OS === 'web') {
                alert('Worksession created successfully!');
                router.replace('/(tabs)/calendar');
                return;
            }

            Alert.alert(
                'Success',
                'Worksession created successfully',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/(tabs)/calendar'),
                    },
                ],
                { cancelable: false }
            );
        } catch (error) {
            console.error('Error creating worksession:', error);
            Alert.alert('Error', 'Failed to create worksession. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <View style={styles.form}>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Title *</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Enter worksession title"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Select Task *</Text>
                        <TouchableOpacity
                            style={styles.selectorButton}
                            onPress={() => setShowTaskSelector(true)}
                        >
                            <Text style={[styles.selectorText, !selectedTask && styles.placeholderText]}>
                                {selectedTask ? selectedTask.title : 'Choose a task'}
                            </Text>
                            <Feather name="chevron-down" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    <Modal
                        visible={showTaskSelector}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setShowTaskSelector(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Select Task</Text>
                                    <TouchableOpacity onPress={() => setShowTaskSelector(false)}>
                                        <AntDesign name="close" size={24} color="#374151" />
                                    </TouchableOpacity>
                                </View>
                                {fetchingTasks ? (
                                    <ActivityIndicator size="large" color="#2563EB" style={{ margin: 20 }} />
                                ) : (
                                    <FlatList
                                        data={tasks}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.taskItem}
                                                onPress={() => {
                                                    setSelectedTask(item);
                                                    setShowTaskSelector(false);
                                                }}
                                            >
                                                <Text style={styles.taskItemTitle}>{item.title}</Text>
                                                {selectedTask?.id === item.id && (
                                                    <AntDesign name="check" size={20} color="#2563EB" />
                                                )}
                                            </TouchableOpacity>
                                        )}
                                        ListEmptyComponent={
                                            <Text style={styles.emptyText}>No tasks found</Text>
                                        }
                                    />
                                )}
                            </View>
                        </View>
                    </Modal>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Start Date & Time *</Text>
                        <View style={styles.dateTimeRow}>
                            <TouchableOpacity
                                style={styles.dateTimeButton}
                                onPress={() => setShowStartDatePicker(true)}
                            >
                                <Text style={styles.dateTimeText}>{formatDate(startDate)}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dateTimeButton}
                                onPress={() => setShowStartTimePicker(true)}
                            >
                                <Text style={styles.dateTimeText}>{formatTime(startDate)}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {showStartDatePicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onStartDateChange}
                        />
                    )}

                    {showStartTimePicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="time"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onStartTimeChange}
                        />
                    )}

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>End Date & Time *</Text>
                        <View style={styles.dateTimeRow}>
                            <TouchableOpacity
                                style={styles.dateTimeButton}
                                onPress={() => setShowEndDatePicker(true)}
                            >
                                <Text style={styles.dateTimeText}>{formatDate(endDate)}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dateTimeButton}
                                onPress={() => setShowEndTimePicker(true)}
                            >
                                <Text style={styles.dateTimeText}>{formatTime(endDate)}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {showEndDatePicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onEndDateChange}
                        />
                    )}

                    {showEndTimePicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="time"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onEndTimeChange}
                        />
                    )}

                    <View style={styles.summary}>
                        <Text style={styles.summaryLabel}>Summary</Text>
                        <Text style={styles.summaryText}>
                            {title || 'Untitled'} from {formatDateTime(startDate)} to {formatDateTime(endDate)}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                    disabled={loading}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.submitButtonText}>Create Worksession</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    content: {
        flex: 1,
    },
    form: {
        padding: 16,
        gap: 20,
    },
    formGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#111827',
    },
    selectorButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
    },
    selectorText: {
        fontSize: 16,
        color: '#111827',
    },
    placeholderText: {
        color: '#9CA3AF',
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
    taskItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    taskItemTitle: {
        fontSize: 16,
        color: '#374151',
    },
    emptyText: {
        textAlign: 'center',
        color: '#9CA3AF',
        marginTop: 20,
        fontSize: 16,
    },
    dateTimeRow: {
        flexDirection: 'row',
        gap: 12,
    },
    dateTimeButton: {
        flex: 1,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    dateTimeText: {
        fontSize: 16,
        color: '#111827',
    },
    summary: {
        backgroundColor: '#EFF6FF',
        borderRadius: 8,
        padding: 16,
        marginTop: 8,
    },
    summaryLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E40AF',
        marginBottom: 4,
    },
    summaryText: {
        fontSize: 14,
        color: '#1E3A8A',
    },
    footer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    cancelButton: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    submitButton: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#2563EB',
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#93C5FD',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
});
