import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../config/theme';
import { AuthProvider, useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import MainTabNavigator from './MainTabNavigator';
import { ActivityIndicator, View } from 'react-native';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const theme = useTheme();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      cardStyleInterpolator: ({ current, layouts }) => ({
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
              }),
            },
          ],
        },
      }),
    }}>
      {user ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}