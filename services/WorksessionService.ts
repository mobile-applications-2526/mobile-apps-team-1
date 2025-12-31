import { WorkSession } from '../types';
import { API_URL } from './Config';
import { getToken, getUserId } from './StorageService';

const apiUrl = API_URL;

export interface CreateWorksessionRequest {
    title: string;
    timeRange: {
        startTime: string;
        endTime: string;
    };
    subjectId: string;
    collaboratorId: string;
}
interface BackendWorksession {
    id: string;
    title: string;
    timeRange: {
        startTime: string;
        endTime: string;
    };
    collaboratorId: string;
    subjectId: string;
}

const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (isoString: string) => {
    return isoString.split('T')[0];
}

const getWorksessions = async (): Promise<WorkSession[]> => {
    const token = await getToken();
    const userId = await getUserId();

    if (!token) {
        throw new Error('Geen token gevonden');
    }

    const response = await fetch(`${API_URL}/worksessions`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Worksessions error:", errorText);
        throw new Error('Failed to fetch worksessions');
    }

    const backendSessions: BackendWorksession[] = await response.json();

    // Map backend response to frontend WorkSession interface
    return backendSessions.map(bs => ({
        id: bs.id,
        taskTitle: bs.title,
        time: `${formatTime(bs.timeRange.startTime)} - ${formatTime(bs.timeRange.endTime)}`,
        startTime: bs.timeRange.startTime,
        day: formatDate(bs.timeRange.startTime),
        ownerId: bs.collaboratorId,
        ownerName: bs.collaboratorId === userId ? 'You' : 'Unknown', // Default to 'You' or 'Unknown'
        isUser: bs.collaboratorId === userId // derived from token/userId check
    }));
};

// Filtered by current user
const getMyWorksessions = async (): Promise<WorkSession[]> => {
    const allSessions = await getWorksessions();
    const userId = await getUserId();

    if (!userId) return [];

    return allSessions.filter(s => s.ownerId === userId).map(session => ({
        ...session,
        isUser: true
    }));
};

const createWorksession = async (data: CreateWorksessionRequest) => {
    const token = await getToken();
    if (!token) throw new Error('No token found');

    console.log('Creating worksession with data:', JSON.stringify(data, null, 2));

    const response = await fetch(`${API_URL}/worksessions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Worksession creation error:', response.status, errorText);
        throw new Error(`Failed to create worksession: ${response.status} - ${errorText}`);
    }
    return response.json();
};

const WorksessionService = {
    getWorksessions,
    getMyWorksessions,
    createWorksession,
};

export default WorksessionService;
