import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getApiUrl = () => {
    if (__DEV__) {
        // Attempt to get the IP address of the machine running the Expo server
        const debuggerHost = Constants.expoConfig?.hostUri;
        const localhostIp = debuggerHost?.split(':')[0];

        if (localhostIp && Platform.OS !== 'web') {
            return `http://${localhostIp}:8080`;
        }

        // Fallback for Android Emulator (special alias for host loopback)
        if (Platform.OS === 'android') {
            return 'http://10.0.2.2:8080';
        }

        // Fallback for iOS Simulator and Web
        return 'http://localhost:8080';
    }

    // Production URL
    return 'http://cedvinvu.be';
};

export const API_URL = getApiUrl();
