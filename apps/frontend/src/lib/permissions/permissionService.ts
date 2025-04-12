'use client';

import { User } from '../auth/authService';

// Definim toate capabilitățile posibile în sistem
export enum Capability {
  // Capabilities pentru SUPER_ADMIN
  MANAGE_COMPANIES = 'MANAGE_COMPANIES',
  MANAGE_SYSTEM_USERS = 'MANAGE_SYSTEM_USERS',
  VIEW_SYSTEM_STATISTICS = 'VIEW_SYSTEM_STATISTICS',
  MANAGE_GLOBAL_SETTINGS = 'MANAGE_GLOBAL_SETTINGS',
  
  // Capabilities pentru COMPANY_ADMIN
  MANAGE_COMPANY_SETTINGS = 'MANAGE_COMPANY_SETTINGS',
  MANAGE_DEPARTMENTS = 'MANAGE_DEPARTMENTS',
  MANAGE_ALL_EMPLOYEES = 'MANAGE_ALL_EMPLOYEES',
  VIEW_COMPANY_STATISTICS = 'VIEW_COMPANY_STATISTICS',
  MANAGE_COMPANY_USERS = 'MANAGE_COMPANY_USERS',
  
  // Capabilities pentru MANAGER
  MANAGE_TEAM_MEMBERS = 'MANAGE_TEAM_MEMBERS',
  APPROVE_LEAVE_REQUESTS = 'APPROVE_LEAVE_REQUESTS',
  APPROVE_TIME_ENTRIES = 'APPROVE_TIME_ENTRIES',
  VIEW_TEAM_STATISTICS = 'VIEW_TEAM_STATISTICS',
  ASSIGN_TASKS = 'ASSIGN_TASKS',
  
  // Capabilities pentru EMPLOYEE
  VIEW_OWN_PROFILE = 'VIEW_OWN_PROFILE',
  EDIT_OWN_PROFILE = 'EDIT_OWN_PROFILE',
  MANAGE_OWN_TIME_ENTRIES = 'MANAGE_OWN_TIME_ENTRIES',
  MANAGE_OWN_LEAVE_REQUESTS = 'MANAGE_OWN_LEAVE_REQUESTS',
  VIEW_OWN_STATISTICS = 'VIEW_OWN_STATISTICS',
}

// Mapăm rolurile la capabilities default
const roleCapabilitiesMap: Record<string, Capability[]> = {
  SUPER_ADMIN: [
    Capability.MANAGE_COMPANIES,
    Capability.MANAGE_SYSTEM_USERS,
    Capability.VIEW_SYSTEM_STATISTICS,
    Capability.MANAGE_GLOBAL_SETTINGS,
    // Super admin are și toate capabilitățile rolurilor inferioare
    Capability.MANAGE_COMPANY_SETTINGS,
    Capability.MANAGE_DEPARTMENTS,
    Capability.MANAGE_ALL_EMPLOYEES,
    Capability.VIEW_COMPANY_STATISTICS,
    Capability.MANAGE_COMPANY_USERS,
    Capability.MANAGE_TEAM_MEMBERS,
    Capability.APPROVE_LEAVE_REQUESTS,
    Capability.APPROVE_TIME_ENTRIES,
    Capability.VIEW_TEAM_STATISTICS,
    Capability.ASSIGN_TASKS,
    Capability.VIEW_OWN_PROFILE,
    Capability.EDIT_OWN_PROFILE,
    Capability.MANAGE_OWN_TIME_ENTRIES,
    Capability.MANAGE_OWN_LEAVE_REQUESTS,
    Capability.VIEW_OWN_STATISTICS,
  ],
  COMPANY_ADMIN: [
    Capability.MANAGE_COMPANY_SETTINGS,
    Capability.MANAGE_DEPARTMENTS,
    Capability.MANAGE_ALL_EMPLOYEES,
    Capability.VIEW_COMPANY_STATISTICS,
    Capability.MANAGE_COMPANY_USERS,
    // Company admin are și toate capabilitățile rolurilor inferioare
    Capability.MANAGE_TEAM_MEMBERS,
    Capability.APPROVE_LEAVE_REQUESTS,
    Capability.APPROVE_TIME_ENTRIES,
    Capability.VIEW_TEAM_STATISTICS,
    Capability.ASSIGN_TASKS,
    Capability.VIEW_OWN_PROFILE,
    Capability.EDIT_OWN_PROFILE,
    Capability.MANAGE_OWN_TIME_ENTRIES,
    Capability.MANAGE_OWN_LEAVE_REQUESTS,
    Capability.VIEW_OWN_STATISTICS,
  ],
  MANAGER: [
    Capability.MANAGE_TEAM_MEMBERS,
    Capability.APPROVE_LEAVE_REQUESTS,
    Capability.APPROVE_TIME_ENTRIES,
    Capability.VIEW_TEAM_STATISTICS,
    Capability.ASSIGN_TASKS,
    // Manager are și toate capabilitățile rolurilor inferioare
    Capability.VIEW_OWN_PROFILE,
    Capability.EDIT_OWN_PROFILE,
    Capability.MANAGE_OWN_TIME_ENTRIES,
    Capability.MANAGE_OWN_LEAVE_REQUESTS,
    Capability.VIEW_OWN_STATISTICS,
  ],
  EMPLOYEE: [
    Capability.VIEW_OWN_PROFILE,
    Capability.EDIT_OWN_PROFILE,
    Capability.MANAGE_OWN_TIME_ENTRIES,
    Capability.MANAGE_OWN_LEAVE_REQUESTS,
    Capability.VIEW_OWN_STATISTICS,
  ],
};

// Permite override-uri de capabilities pe utilizator
interface UserCapabilityOverride {
  userId: string;
  grantedCapabilities: Capability[];
  revokedCapabilities: Capability[];
}

// Serviciul de permisiuni
class PermissionService {
  // În cazul unei implementări reale, aceste override-uri ar veni de la backend
  private userCapabilityOverrides: UserCapabilityOverride[] = [];
  
  // Cache pentru performanță
  private capabilityCache: Map<string, Set<Capability>> = new Map();
  
  constructor() {
    this.loadUserCapabilityOverrides();
  }
  
  // Încarcă override-urile de la server
  private async loadUserCapabilityOverrides() {
    try {
      // Aici ar fi un apel API real
      // const response = await apiClient.get('/user-capabilities');
      // this.userCapabilityOverrides = response.data;
      
      // Deocamdată folosim o listă goală
      this.userCapabilityOverrides = [];
      
      // Invalidăm cache-ul când override-urile se schimbă
      this.capabilityCache.clear();
    } catch (error) {
      console.error('Eroare la încărcarea override-urilor de permisiuni:', error);
    }
  }
  
  // Obține toate capabilitățile pentru un utilizator
  getUserCapabilities(user: User | null): Set<Capability> {
    if (!user) return new Set();
    
    // Verificăm dacă avem capabilitățile în cache
    const cacheKey = `${user.id}-${user.role}`;
    if (this.capabilityCache.has(cacheKey)) {
      return this.capabilityCache.get(cacheKey) as Set<Capability>;
    }
    
    // Pornim cu capabilitățile de bază ale rolului
    const baseCapabilities = new Set(roleCapabilitiesMap[user.role] || []);
    
    // Aplicăm override-urile specifice utilizatorului
    const userOverride = this.userCapabilityOverrides.find(
      (override) => override.userId === user.id
    );
    
    if (userOverride) {
      // Adaugăm capabilitățile acordate explicit
      userOverride.grantedCapabilities.forEach((cap) => baseCapabilities.add(cap));
      
      // Eliminăm capabilitățile revocate explicit
      userOverride.revokedCapabilities.forEach((cap) => baseCapabilities.delete(cap));
    }
    
    // Salvăm în cache pentru acces rapid ulterior
    this.capabilityCache.set(cacheKey, baseCapabilities);
    
    return baseCapabilities;
  }
  
  // Verifică dacă un utilizator are o anumită capabilitate
  hasCapability(user: User | null, capability: Capability): boolean {
    if (!user) return false;
    
    const userCapabilities = this.getUserCapabilities(user);
    return userCapabilities.has(capability);
  }
  
  // Verifică dacă un utilizator are toate capabilitățile specificate
  hasAllCapabilities(user: User | null, capabilities: Capability[]): boolean {
    if (!user) return false;
    
    const userCapabilities = this.getUserCapabilities(user);
    return capabilities.every(cap => userCapabilities.has(cap));
  }
  
  // Verifică dacă un utilizator are cel puțin una dintre capabilitățile specificate
  hasAnyCapability(user: User | null, capabilities: Capability[]): boolean {
    if (!user) return false;
    
    const userCapabilities = this.getUserCapabilities(user);
    return capabilities.some(cap => userCapabilities.has(cap));
  }
  
  // Obține toate capabilitățile disponibile în sistem
  getAllCapabilities(): Capability[] {
    return Object.values(Capability);
  }
  
  // Obține capabilitățile implicite pentru un rol
  getRoleCapabilities(role: string): Capability[] {
    return [...(roleCapabilitiesMap[role] || [])];
  }
}

// Singleton pentru a asigura o singură instanță în aplicație
const permissionService = new PermissionService();
export default permissionService; 