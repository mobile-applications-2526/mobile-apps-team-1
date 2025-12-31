import { Task } from '../types';
import { API_URL } from './Config';
import { getToken, getUserId } from './StorageService';

const apiUrl = `${API_URL}/tasks`;

export interface BackendTask {
    id: string; // Simplified by @JsonValue
    title: string;
    status: 'TODO' | 'DOING' | 'DONE' | 'EXPIRED';
    assignee: string; // Simplified by @JsonValue
}

const getTasks = async (): Promise<Task[]> => {
    const token = await getToken();
    const currentUserId = await getUserId();

    if (!token) {
        throw new Error('No token found, retry login');
    }

    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch tasks error:', errorText);
        throw new Error('Failed to fetch tasks');
    }

    const data: BackendTask[] = await response.json();

    // Filter tasks for current user and map to frontend Task interface
    return data
        .filter(bt => bt.assignee === currentUserId)
        .map(bt => ({
            id: bt.id,
            title: bt.title,
            deadline: '', // Backend doesn't seem to have this yet in Task.java
            progress: bt.status === 'DONE' ? 100 : bt.status === 'DOING' ? 50 : 0,
            completed: bt.status === 'DONE',
            pastDue: false,
            description: '',
        }));
};

const TaskService = {
    getTasks,
};

export default TaskService;
