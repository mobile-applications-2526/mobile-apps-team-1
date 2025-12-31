import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SessionProvider, useSession } from './context/AuthContext';

function InitialLayout() {
  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/');
    }
  }, [session, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="details" options={{ headerShown: false }} />
      <Stack.Screen name="worksessions" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <InitialLayout />
    </SessionProvider>
  );
}
