// services/LoginService.ts
import { getToken, removeToken, setToken } from './StorageService';

const apiUrl = "http://localhost:8080"; // of je juiste url

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
    console.log("ik ben de token: " + data.token);

    await setToken(data.token); // <-- hier

    const check = await getToken();
    console.log("Direct gecheckt:", check);

    return data;
};

const logout = async () => {
    await removeToken();
};

const LoginService = {
    login,
    logout,
    getToken,
};

export default LoginService;