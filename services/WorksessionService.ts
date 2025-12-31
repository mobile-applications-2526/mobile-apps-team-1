import { WorkSession } from '../types';
import { getToken, getUserId } from './StorageService';

const API_URL = "http://cedvinvu.be";

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

const createWorksession = async (data: any) => {
    const token = await getToken();
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_URL}/worksessions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to create worksession');
    return response.json();
};

const WorksessionService = {
    getWorksessions,
    getMyWorksessions,
    createWorksession,
};

export default WorksessionService;
