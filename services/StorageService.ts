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

const USER_ID_KEY = 'userId';

export const setUserId = async (userId: string) => {
    if (Platform.OS === 'web') {
        await AsyncStorage.setItem(USER_ID_KEY, userId);
    } else {
        await SecureStore.setItemAsync(USER_ID_KEY, userId);
    }
};

export const getUserId = async (): Promise<string | null> => {
    if (Platform.OS === 'web') {
        return await AsyncStorage.getItem(USER_ID_KEY);
    } else {
        return await SecureStore.getItemAsync(USER_ID_KEY);
    }
};

export const removeUserId = async () => {
    if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(USER_ID_KEY);
    } else {
        await SecureStore.deleteItemAsync(USER_ID_KEY);
    }
};