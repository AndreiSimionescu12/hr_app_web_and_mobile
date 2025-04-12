'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService, { User } from './authService';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  error: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Verificăm dacă utilizatorul este autentificat la încărcarea paginii
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const currentUser = authService.getUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Eroare la verificarea autentificării:', err);
        setError('Eroare la verificarea autentificării');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user } = await authService.login({ email, password });
      setUser(user);
      
      // Redirecționăm utilizatorul către pagina potrivită
      switch (user.role) {
        case 'SUPER_ADMIN':
          router.push('/admin/permissions');
          break;
        case 'COMPANY_ADMIN':
          router.push('/company/dashboard');
          break;
        default:
          router.push('/dashboard');
      }
    } catch (err) {
      console.error('Eroare la autentificare:', err);
      setError('Credențiale invalide');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      authService.logout();
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error('Eroare la deconectare:', err);
      setError('Eroare la deconectare');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext); 