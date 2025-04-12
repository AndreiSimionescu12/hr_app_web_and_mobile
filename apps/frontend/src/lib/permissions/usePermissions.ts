'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import permissionService, { Capability } from './permissionService';

/**
 * Hook personalizat pentru verificarea permisiunilor utilizatorului curent.
 * 
 * Exemplu de utilizare:
 * 
 * const { can, canAll, canAny } = usePermissions();
 * 
 * // Apoi în render:
 * {can(Capability.MANAGE_TEAM_MEMBERS) && <button>Adaugă membru</button>}
 */
export default function usePermissions() {
  const { user } = useAuth();
  
  /**
   * Verifică dacă utilizatorul are o anumită capabilitate
   */
  const can = (capability: Capability): boolean => {
    return permissionService.hasCapability(user, capability);
  };
  
  /**
   * Verifică dacă utilizatorul are toate capabilitățile specificate
   */
  const canAll = (capabilities: Capability[]): boolean => {
    return permissionService.hasAllCapabilities(user, capabilities);
  };
  
  /**
   * Verifică dacă utilizatorul are cel puțin una dintre capabilitățile specificate
   */
  const canAny = (capabilities: Capability[]): boolean => {
    return permissionService.hasAnyCapability(user, capabilities);
  };
  
  /**
   * Obține toate capabilitățile utilizatorului curent
   */
  const getUserCapabilities = (): Set<Capability> => {
    return permissionService.getUserCapabilities(user);
  };
  
  return {
    can,
    canAll,
    canAny,
    getUserCapabilities,
  };
} 