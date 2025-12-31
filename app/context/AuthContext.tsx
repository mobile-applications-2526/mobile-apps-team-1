import LoginService from '@/services/LoginService';
import { getToken } from '@/services/StorageService';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    session: string | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    signIn: async () => { },
    signOut: async () => { },
    session: null,
    isLoading: false,
});

export function useSession() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }
    return value;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const bootstrapAsync = async () => {
            let userToken;
            try {
                userToken = await getToken();
            } catch (e) {
                // Restoring token failed
                console.error('Failed to restore token', e);
            }
            setSession(userToken || null);
            setIsLoading(false);
        };

        bootstrapAsync();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                signIn: async (email, password) => {
                    setIsLoading(true);
                    try {
                        const data = await LoginService.login(email, password);
                        // Ensure LoginService already sets the token, but we sync state here
                        // LoginService.login logs the token and calls setToken.
                        // We just need to update our local state.
                        const token = await getToken();
                        setSession(token);
                    } catch (e) {
                        throw e;
                    } finally {
                        setIsLoading(false);
                    }
                },
                signOut: async () => {
                    await LoginService.logout();
                    setSession(null);
                },
                session,
                isLoading,
            }}>
            {children}
        </AuthContext.Provider>
    );
}
