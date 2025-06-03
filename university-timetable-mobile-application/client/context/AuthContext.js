import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useTheme } from '../config/theme';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const loadUser = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          const userData = JSON.parse(userJson);
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to load user', error);
      } finally {
        setIsLoading(false);
        await SplashScreen.hideAsync();
      }
    };

    loadUser();
  }, []);

  const login = async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const mockUser = {
            id: '1',
            email: userData.email,
            name: userData.name || userData.email.split('@')[0],
            role: userData.role || determineRole(userData.email),
            token: userData.token,
          };
          
          await AsyncStorage.setItem('user', JSON.stringify(mockUser));
          setUser(mockUser);
          resolve(mockUser);
        } catch (error) {
          reject(error);
        }
      }, 1500);
    });
  };

  const register = async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const mockUser = {
            id: '2',
            ...userData,
            token: 'mock-auth-token',
          };
          
          await AsyncStorage.setItem('user', JSON.stringify(mockUser));
          setUser(mockUser);
          resolve(mockUser);
        } catch (error) {
          reject(error);
        }
      }, 1500);
    });
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      // No need to manually reset navigation here
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  const determineRole = (email) => {
    if (!email) return 'student';
    if (email.includes('admin@')) return 'coordinator';
    if (email.includes('prof@') || email.includes('teacher@')) return 'teacher';
    return 'student';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};