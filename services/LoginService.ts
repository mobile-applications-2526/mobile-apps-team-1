// services/LoginService.ts
import { API_URL } from './Config';
import { getToken, removeToken, removeUserId, setToken, setUserId } from './StorageService';

const apiUrl = API_URL;

const login = async (email: string, password: string) => {
    const response = await fetch(apiUrl + '/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    console.log("Login response data:", JSON.stringify(data, null, 2));

    if (!data.token) {
        throw new Error('No token received');
    }

    // Check if userId is present (might be 'id' or 'userId')
    const userId = data.userId || data.id;
    if (!userId) {
        console.error("No userId found in login response:", data);
        // Don't throw yet, just log to confirm hypothesis
    }

    await setToken(data.token);
    if (userId) {
        await setUserId(String(userId));
    } else {
        console.warn("Skipping setUserId because userId is missing");
    }

    const check = await getToken();
    console.log("Direct gecheckt:", check);

    return data;
};

const logout = async () => {
    await removeToken();
    await removeUserId();
};

const LoginService = {
    login,
    logout,
    getToken,
};

export default LoginService;