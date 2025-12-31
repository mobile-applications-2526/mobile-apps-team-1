import { API_URL } from './Config';
import { getToken } from './StorageService';

const apiUrl = API_URL;


const getGroups = async () => {
    const token = await getToken();

    if (!token) {
        throw new Error('No token found, retry login');
    }

    const response = await fetch(apiUrl + '/groups', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Groups error:", errorText);
        throw new Error('Failed to fetch groups');
    }

    return response.json();
};

// Voor later
const createGroup = async () => {
    const response = await fetch(apiUrl + '/groups/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to create group');
    }

    return response.json();
};

// Voor later
const updateGroup = async () => {
    const response = await fetch(apiUrl + '/groups/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to update group');
    }

    return response.json();
};

const GroupService = {
    getGroups,
    createGroup,
    updateGroup,
};

export default GroupService;