import { getToken } from './StorageService';

const apiUrl = "http://cedvinvu.be/users";


const getUserById = async (id: string) => {
    const token = await getToken(); // make sure this returns the JWT
    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    const data = await response.json();

    if (!response.ok) {
        const errorMessage = data?.NotFoundException || data?.error || 'Failed to fetch user';
        throw new Error(errorMessage);
    }

    return data;
};


const UserService = {
    getUserById,
};

export default UserService;
