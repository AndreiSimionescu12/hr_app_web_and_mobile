'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService, { User, LoginCredentials } from './authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasRole: (roles: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificăm autentificarea la încărcarea aplicației
    const checkAuth = () => {
      try {
        const currentUser = authService.getUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Eroare la verificarea autentificării:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const result = await authService.login(credentials);
      setUser(result.user);
      
      // Redirecționăm în funcție de rol
      switch (result.user.role) {
        case 'SUPER_ADMIN':
          router.push('/admin/create-company');
          break;
        case 'COMPANY_ADMIN':
          router.push('/company/dashboard');
          break;
        case 'EMPLOYEE':
          router.push('/employee/dashboard');
          break;
        default:
          router.push('/');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  const hasRole = (roles: string | string[]) => {
    return authService.hasRole(roles);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 