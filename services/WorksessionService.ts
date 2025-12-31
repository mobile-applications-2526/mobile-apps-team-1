import { API_URL } from './Config';
import { getToken } from './StorageService';

const apiUrl = `${API_URL}/worksessions`;

export interface CreateWorksessionRequest {
    title: string;
    timeRange: {
        startTime: string; // ISO 8601 format
        endTime: string;   // ISO 8601 format
    };
    subjectId: {
        value: string;
    };
    collaboratorId: {
        value: string;
    };
}

export interface Worksession {
    id: {
        value: string;
    };
    title: string;
    timeRange: {
        startTime: string;
        endTime: string;
    };
    subjectId: {
        value: string;
    };
    collaboratorId: {
        value: string;
    };
}

const createWorksession = async (request: CreateWorksessionRequest): Promise<Worksession> => {
    const token = await getToken();

    if (!token) {
        throw new Error('No token found, retry login');
    }

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Create worksession error:', errorText);
        throw new Error('Failed to create worksession');
    }

    const data = await response.json();
    return data;
};

const WorksessionService = {
    createWorksession,
};

export default WorksessionService;
