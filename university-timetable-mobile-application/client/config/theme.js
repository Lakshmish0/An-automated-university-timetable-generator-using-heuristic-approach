import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

const lightColors = {
  primary: '#6200EE',
  secondary: '#03DAC6',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  error: '#B00020',
  onPrimary: '#FFFFFF',
  onSecondary: '#000000',
  onBackground: '#000000',
  onSurface: '#000000',
  onError: '#FFFFFF',
  text: '#000000',
  placeholder: '#999999',
  border: '#E0E0E0',
  disabled: '#CCCCCC',
};

const darkColors = {
  primary: '#BB86FC',
  secondary: '#03DAC6',
  background: '#121212',
  surface: '#1E1E1E',
  error: '#CF6679',
  onPrimary: '#000000',
  onSecondary: '#000000',
  onBackground: '#FFFFFF',
  onSurface: '#FFFFFF',
  onError: '#000000',
  text: '#FFFFFF',
  placeholder: '#666666',
  border: '#333333',
  disabled: '#444444',
};
const teacherStackColors = {
  primary: '#BB86FC', // Example primary color for TeacherStack
  secondary: '#FFC107', // Example secondary color for TeacherStack
  background: '#FFA500', // Background color for TeacherStack
  surface: '#FFFFFF',
  error: '#B00020',
  onPrimary: '#FFFFFF',
  onSecondary: '#000000',
  onBackground: '#000000',
  onSurface: '#000000',
  onError: '#FFFFFF',
  text: '#000000',
  placeholder: '#999999',
  border: '#E0E0E0',
  disabled: '#CCCCCC',
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const theme = {
    colors: colorScheme === 'light' ? lightColors : lightColors, teacherStackColors,
    spacing: {
      small: 8,
      medium: 16,
      large: 24,
    },
    roundness: 8,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);