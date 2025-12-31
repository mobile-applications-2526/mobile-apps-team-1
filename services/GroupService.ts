import { getToken } from './StorageService';

const apiUrl = "http://cedvinvu.be";


const getGroups = async () => {
    const token = await getToken();
            
    if (!token) {
        throw new Error('Geen token gevonden, log opnieuw in niffo');
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
        throw new Error('Failed to fetch groups lmao');
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
        throw new Error('Failed lmao');
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
        throw new Error('Failed lmao');
    }

    return response.json();
};

const GroupService = {
    getGroups,
    createGroup,
    updateGroup,
};

export default GroupService;