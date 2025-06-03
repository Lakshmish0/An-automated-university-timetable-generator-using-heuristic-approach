import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const { user, isLoading, login, logout } = AuthContext();
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};