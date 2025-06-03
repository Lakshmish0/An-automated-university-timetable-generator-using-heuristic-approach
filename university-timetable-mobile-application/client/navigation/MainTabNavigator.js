import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../config/theme';
import { useAuth } from '../context/AuthContext';
import StudentStack from './StudentStack';
import TeacherStack from './TeacherStack';
import NotificationScreen from '../screens/common/NotificationScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, ActivityIndicator } from 'react-native';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const theme = useTheme();
  const { user, loading } = useAuth(); // Add loading state from auth context

  // Show loading indicator while auth state is being checked
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // If no user and not loading, show error or redirect (though this should be handled by your RootNavigator)
  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No user found. Please log in.</Text>
      </View>
    );
  }

  const getRoleStack = () => {
    switch(user?.role) { // Safe access with optional chaining
      case 'student':
        return <Tab.Screen name="Student" component={StudentStack} />;
      case 'teacher':
        return <Tab.Screen name="Teacher" component={TeacherStack} />;
      default:
        return null;
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Student' || route.name === 'Teacher') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Announcements') {
            iconName = focused ? 'bullhorn' : 'bullhorn-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.placeholder,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        headerShown: false,
      })}
    >
      {getRoleStack()}
      <Tab.Screen 
        name="Announcements" 
        component={NotificationScreen} 
        options={{ tabBarBadge: 3 }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}