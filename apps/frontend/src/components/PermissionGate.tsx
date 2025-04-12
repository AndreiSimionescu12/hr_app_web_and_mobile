'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import permissionService, { Capability } from '@/lib/permissions/permissionService';

interface PermissionGateProps {
  children: ReactNode;
  
  // Aceasta poate fi o singură capabilitate sau un array de capabilități
  capabilities?: Capability | Capability[];
  
  // Specifică dacă utilizatorul trebuie să aibă toate capabilitățile sau doar una dintre ele
  requireAll?: boolean;
  
  // Conținut alternativ de afișat dacă utilizatorul nu are permisiunile necesare
  fallback?: ReactNode;
}

/**
 * Component pentru controlul accesului bazat pe capabilități.
 * Va afișa conținutul (children) doar dacă utilizatorul are permisiunile necesare.
 * 
 * Exemplu de utilizare:
 * 
 * <PermissionGate capabilities={Capability.MANAGE_TEAM_MEMBERS}>
 *   <button>Adaugă membru în echipă</button>
 * </PermissionGate>
 */
export default function PermissionGate({
  children,
  capabilities,
  requireAll = true,
  fallback = null,
}: PermissionGateProps) {
  const { user } = useAuth();
  
  // Dacă nu sunt specificate capabilități, afișăm conținutul
  if (!capabilities) {
    return <>{children}</>;
  }
  
  const capabilitiesArray = Array.isArray(capabilities) ? capabilities : [capabilities];
  
  // Verificăm permisiunile utilizatorului
  const hasPermission = requireAll
    ? permissionService.hasAllCapabilities(user, capabilitiesArray)
    : permissionService.hasAnyCapability(user, capabilitiesArray);
  
  // Afișăm conținutul sau fallback-ul în funcție de permisiuni
  return hasPermission ? <>{children}</> : <>{fallback}</>;
} 