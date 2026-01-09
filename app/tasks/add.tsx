import { getUserId } from '@/services/StorageService';
import TaskService from '@/services/TaskService';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function AddTaskScreen() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const loadUserId = async () => {
            try {
                const id = await getUserId();
                setCurrentUserId(id);
            } catch (error) {
                console.error('Error loading user ID:', error);
                router.replace('/(auth)/login');
            }
        };
        loadUserId();
    }, []);

    const validateForm = (): boolean => {
        if (!title.trim()) {
            Alert.alert('Validation Error', 'Please enter a task title');
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
            await TaskService.createTask(title.trim(), currentUserId!);
            setLoading(false);

            if (Platform.OS === 'web') {
                alert('Task created successfully!');
                router.replace('/(tabs)/tasks');
                return;
            }

            Alert.alert(
                'Success',
                'Task created successfully',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/(tabs)/tasks'),
                    },
                ],
                { cancelable: false }
            );
        } catch (error: any) {
            console.error('Error creating task:', error);
            const errorMessage = error.message || 'Failed to create task. Please try again.';
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <View style={styles.form}>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Task Title *</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Enter task title"
                            placeholderTextColor="#9CA3AF"
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.summary}>
                        <Text style={styles.summaryLabel}>Summary</Text>
                        <Text style={styles.summaryText}>
                            {title || 'Untitled task'} will be created
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
                        <Text style={styles.submitButtonText}>Create Task</Text>
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
