'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectPath?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectPath = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectPath);
      } else if (allowedRoles && !hasRole(allowedRoles)) {
        // Dacă utilizatorul nu are rolul necesar, redirecționăm
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, isLoading, router, redirectPath, allowedRoles, hasRole]);

  // Afișăm un ecran de încărcare cât timp verificăm autentificarea
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-primary" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">Se încarcă...</p>
        </div>
      </div>
    );
  }

  // Nu afișăm conținutul dacă utilizatorul nu este autentificat
  // sau nu are rolul necesar (redirecționarea se va face în useEffect)
  if (!isAuthenticated || (allowedRoles && !hasRole(allowedRoles))) {
    return null;
  }

  return <>{children}</>;
} 