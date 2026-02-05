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
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }
      
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const userData = await getCurrentUser();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('auth_token');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
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
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('auth_token');
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('auth_token', token);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.warn('Backend logout failed, clearing local session anyway:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
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