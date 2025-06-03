import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../config/theme';
import { AuthProvider } from '../context/AuthContext';
import RootNavigator from '../navigation';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen from auto hiding
SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
            <StatusBar style="auto" />
            <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}