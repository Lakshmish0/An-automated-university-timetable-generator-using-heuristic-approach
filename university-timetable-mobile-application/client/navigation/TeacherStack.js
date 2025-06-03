import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../config/theme'; // Adjust the import path as necessary
import Dashboard from '../screens/teacher/Dashboard';
import ScheduleScreen from '../screens/teacher/ScheduleScreen';

const Stack = createStackNavigator();

export default function TeacherStack() {
  const { teacherStackColors} = useTheme();
  {console.log(teacherStackColors)} // Moved this line before the closing tag

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: teacherStackColors.background, // Use primary color for header
          elevation: 0,
          shadowOpacity: 0,
        },
        cardStyleInterpolator: ({ current, next, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  rotate: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['15deg', '0deg'],
                  }),
                },
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
            overlayStyle: {
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
              }),
            },
          };
        },
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={Dashboard} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Schedule" 
        component={ScheduleScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}