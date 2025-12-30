import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const STORAGE_KEY = 'token';

export const setToken = async (token: string) => {
    if (Platform.OS === 'web') {
        await AsyncStorage.setItem(STORAGE_KEY, token);
    } else {
        await SecureStore.setItemAsync(STORAGE_KEY, token);
    }
};

export const getToken = async (): Promise<string | null> => {
    if (Platform.OS === 'web') {
        return await AsyncStorage.getItem(STORAGE_KEY);
    } else {
        return await SecureStore.getItemAsync(STORAGE_KEY);
    }
};

export const removeToken = async () => {
    if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } else {
        await SecureStore.deleteItemAsync(STORAGE_KEY);
    }
};