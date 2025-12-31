// services/LoginService.ts
import { getToken, removeToken, removeUserId, setToken, setUserId } from './StorageService';

const apiUrl = "http://cedvinvu.be";

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

    await setToken(data.token);
    await setUserId(data.userId);

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