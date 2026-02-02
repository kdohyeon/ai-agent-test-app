import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { auth } from '@/src/config/firebase';
import { signInAnonymously } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { FilterProvider } from '../context/FilterContext';
import { ThemeProvider as TeamThemeProvider, useTheme } from '../context/ThemeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [authInitializing, setAuthInitializing] = useState(true);
  const { selectedTeam, isLoading: themeLoading } = useTheme();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthInitializing(false);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error('Anonymous auth failed', error);
          setAuthInitializing(false);
        });
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (authInitializing || themeLoading) return;

    const inOnboarding = segments[0] === 'onboarding';

    if (!selectedTeam && !inOnboarding) {
      router.replace('/onboarding');
    } else if (selectedTeam && inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [authInitializing, themeLoading, selectedTeam, segments]);

  if (authInitializing || themeLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <TeamThemeProvider>
      <FilterProvider>
        <RootLayoutNav />
      </FilterProvider>
    </TeamThemeProvider>
  );
}
