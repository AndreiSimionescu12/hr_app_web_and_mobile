import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { PermissionApiService } from './permissionApiService';

interface UseRequirePermissionResult {
  hasPermission: boolean;
  loading: boolean;
  error: string | null;
}

// Mock permisiuni pentru teste
const mockPermissions: Record<string, string[]> = {
  'SUPER_ADMIN': [
    'permissions.read', 'permissions.create', 'permissions.update', 'permissions.delete',
    'permissions.grant', 'permissions.revoke', 'permissions.admin', 'permissions.audit',
    'users.read', 'users.create', 'users.update', 'users.delete',
    'companies.read', 'companies.create', 'companies.update', 'companies.delete',
    'employees.read', 'employees.create', 'employees.update', 'employees.delete',
  ],
  'COMPANY_ADMIN': [
    'permissions.read', 'permissions.grant', 'permissions.revoke', 
    'users.read', 'users.create', 'users.update',
    'employees.read', 'employees.create', 'employees.update', 'employees.delete',
    'companies.read', 'companies.update',
  ],
  'MANAGER': [
    'permissions.read', 'permissions.grant', 'permissions.revoke',
    'employees.read', 'employees.create', 'employees.update',
  ],
  'EMPLOYEE': [
    'employees.read',
  ]
};

/**
 * Hook pentru verificarea dacă utilizatorul curent are o anumită permisiune
 * @param capability Numele capacității (permisiunii) necesare
 * @returns Un obiect cu starea permisiunii și informații despre încărcare
 */
export function useRequirePermission(capability: string): UseRequirePermissionResult {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPermission = async () => {
      if (isLoading) return;
      
      if (!isAuthenticated || !user) {
        setHasPermission(false);
        setLoading(false);
        return;
      }
      
      try {
        // SUPER_ADMIN are întotdeauna acces la orice, indiferent de permisiuni
        if (user.role === 'SUPER_ADMIN') {
          setHasPermission(true);
          setLoading(false);
          return;
        }
        
        // Pentru celelalte roluri, verificăm permisiunile specifice
        const userPermissions = mockPermissions[user.role] || [];
        setHasPermission(userPermissions.includes(capability));
        
        setError(null);
      } catch (err) {
        console.error('Eroare la verificarea permisiunii:', err);
        setError('Nu s-a putut verifica permisiunea. Încercați din nou.');
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkPermission();
  }, [capability, isAuthenticated, isLoading, user]);

  return { hasPermission, loading, error };
}

/**
 * Hook pentru verificarea dacă utilizatorul curent are toate permisiunile specificate
 * @param capabilities Array cu numele capacităților (permisiunilor) necesare
 * @returns Un obiect cu starea permisiunilor și informații despre încărcare
 */
export function useRequireAllPermissions(capabilities: string[]): UseRequirePermissionResult {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPermissions = async () => {
      if (isLoading) return;
      
      if (!isAuthenticated || !user) {
        setHasPermission(false);
        setLoading(false);
        return;
      }
      
      try {
        // SUPER_ADMIN are întotdeauna acces la orice, indiferent de permisiuni
        if (user.role === 'SUPER_ADMIN') {
          setHasPermission(true);
          setLoading(false);
          return;
        }
        
        // Pentru celelalte roluri, verificăm permisiunile specifice
        const userPermissions = mockPermissions[user.role] || [];
        const hasAllCapabilities = capabilities.every(
          requiredCap => userPermissions.includes(requiredCap)
        );
        setHasPermission(hasAllCapabilities);
        
        setError(null);
      } catch (err) {
        console.error('Eroare la verificarea permisiunilor:', err);
        setError('Nu s-au putut verifica permisiunile. Încercați din nou.');
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkPermissions();
  }, [capabilities, isAuthenticated, isLoading, user]);

  return { hasPermission, loading, error };
}

/**
 * Hook pentru verificarea dacă utilizatorul curent are cel puțin una dintre permisiunile specificate
 * @param capabilities Array cu numele capacităților (permisiunilor) necesare
 * @returns Un obiect cu starea permisiunilor și informații despre încărcare
 */
export function useRequireAnyPermission(capabilities: string[]): UseRequirePermissionResult {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPermissions = async () => {
      if (isLoading) return;
      
      if (!isAuthenticated || !user) {
        setHasPermission(false);
        setLoading(false);
        return;
      }
      
      try {
        // SUPER_ADMIN are întotdeauna acces la orice, indiferent de permisiuni
        if (user.role === 'SUPER_ADMIN') {
          setHasPermission(true);
          setLoading(false);
          return;
        }
        
        // Pentru celelalte roluri, verificăm permisiunile specifice
        const userPermissions = mockPermissions[user.role] || [];
        const hasAnyCapability = capabilities.some(
          requiredCap => userPermissions.includes(requiredCap)
        );
        setHasPermission(hasAnyCapability);
        
        setError(null);
      } catch (err) {
        console.error('Eroare la verificarea permisiunilor:', err);
        setError('Nu s-au putut verifica permisiunile. Încercați din nou.');
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkPermissions();
  }, [capabilities, isAuthenticated, isLoading, user]);

  return { hasPermission, loading, error };
} 