import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LoginService from '../../services/LoginService';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [checkingToken, setCheckingToken] = useState(true); // voor loading terwijl we checken

    // Check bij mount of er al een token is
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await LoginService.getToken();
                if (token) {
                    setIsLoggedIn(true);
                    // Optioneel: direct doorsturen naar profile als je wil
                    // router.replace("/(tabs)/profile");
                }
            } catch (error) {
                console.log("Geen token gevonden of error:", error);
                setIsLoggedIn(false);
            } finally {
                setCheckingToken(false);
            }
        };

        checkLoginStatus();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Vul alles in niffo');
            return;
        }

        setLoading(true);
        try {
            await LoginService.login(email, password);
            Alert.alert('Success', 'Ingelogd mattie 🔥');
            setIsLoggedIn(true);
            // Ga naar profile (of blijf hier met logout button)
            router.push("/(tabs)/profile");
        } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'Iets gefucked');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Weet je het zeker niffo?',
            [
                { text: 'Nee', style: 'cancel' },
                {
                    text: 'Ja',
                    onPress: async () => {
                        try {
                            await LoginService.logout();
                            setIsLoggedIn(false);
                            setEmail('');
                            setPassword('');
                            Alert.alert('Success', 'Uitgelogd, tot later mattie 👋');
                            // Optioneel: terug naar login tab
                            router.replace("/(tabs)/login");
                        } catch (error) {
                            Alert.alert('Error', 'Logout mislukt lmao');
                        }
                    },
                },
            ]
        );
    };

    // Loading terwijl we token checken
    if (checkingToken) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Bezig met checken...</Text>
            </View>
        );
    }

    // Als al ingelogd → toon logout button
    if (isLoggedIn) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Je bent al ingelogd niffo ✅</Text>
                <Text style={styles.subtitle}>Lekker aan het chillen in de app</Text>

                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Normaal login form
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            
            <TouchableOpacity 
                style={styles.button} 
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Bezig met inloggen...' : 'Login'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 40,
        color: '#666',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        marginBottom: 15,
        borderRadius: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});