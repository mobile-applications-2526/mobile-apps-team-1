import * as Keychain from 'react-native-keychain';

const apiUrl = "http://localhost:8080";

const login = async (email: string, password: string) => {
    const response = await fetch(apiUrl + '/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();

    console.log("ik ben de token: " + data.token);

    await Keychain.setGenericPassword('token', data.token);
    
    const credentials = await Keychain.getGenericPassword();
    console.log(credentials);

    return data;
};

const logout = async () => {
    await Keychain.resetGenericPassword();
};

const LoginService = {
    login,
    logout,
};

export default LoginService;
