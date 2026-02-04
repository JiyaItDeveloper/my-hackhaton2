'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types/todo';
import { getCurrentUser, logoutUser } from './api';

interface SessionContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on initial load
    const initializeSession = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Verify token by fetching user data
          const userData = await getCurrentUser();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Token exists but user data is invalid
            localStorage.removeItem('auth_token');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        // If token is invalid or network error, clear it
        console.warn('Session initialization error:', error);
        localStorage.removeItem('auth_token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, []);

  const login = (userData: User, token: string) => {
    // Clear any existing auth data first
    localStorage.removeItem('auth_token');

    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('auth_token', token);
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint to invalidate the token on the server
      await logoutUser();
    } catch (error) {
      console.warn('Backend logout failed, clearing local session anyway:', error);
      // Even if backend logout fails, still clear local session
    } finally {
      // Always clear local storage and state regardless of backend response
      localStorage.removeItem('auth_token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <SessionContext.Provider value={{ user, loading, isAuthenticated, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};