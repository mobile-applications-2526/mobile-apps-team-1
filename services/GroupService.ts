import * as Keychain from 'react-native-keychain';

const apiUrl = "http://localhost:8080";


const getGroups = async () => {
    const credentials = await Keychain.getGenericPassword();
            
    if (!credentials) {
        throw new Error('Geen token gevonden, log opnieuw in niffo');
    }

    const response = await fetch(apiUrl + '/groups', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${credentials.password}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed lmao');
    }

    return response.json();
};

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