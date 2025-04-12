import { Capability } from '../permissionService';
import { User } from '@/lib/auth/authService';

// Definim o ierarhie clară a rolurilor
export enum RoleLevel {
  SUPER_ADMIN = 4,
  COMPANY_ADMIN = 3,
  MANAGER = 2,
  EMPLOYEE = 1,
  GUEST = 0,
}

// Convertim string-ul de rol la nivelul corespunzător
export const getRoleLevel = (role: string): RoleLevel => {
  switch (role) {
    case 'SUPER_ADMIN':
      return RoleLevel.SUPER_ADMIN;
    case 'COMPANY_ADMIN':
      return RoleLevel.COMPANY_ADMIN;
    case 'MANAGER':
      return RoleLevel.MANAGER;
    case 'EMPLOYEE':
      return RoleLevel.EMPLOYEE;
    default:
      return RoleLevel.GUEST;
  }
};

// Definim ce capabilități pot fi administrate de fiecare rol
const capabilityAdminScope: Record<RoleLevel, Capability[]> = {
  [RoleLevel.SUPER_ADMIN]: Object.values(Capability), // Super Admin poate administra toate capabilitățile
  
  [RoleLevel.COMPANY_ADMIN]: [
    // Company Admin poate administra doar capabilitățile specifice companiei
    Capability.MANAGE_DEPARTMENTS,
    Capability.MANAGE_ALL_EMPLOYEES,
    Capability.VIEW_COMPANY_STATISTICS,
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
  
  [RoleLevel.MANAGER]: [
    // Manager poate administra doar capabilitățile specifice echipei
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
  
  [RoleLevel.EMPLOYEE]: [], // Angajații nu pot administra nicio capabilitate
  [RoleLevel.GUEST]: [],    // Oaspeții nu pot administra nicio capabilitate
};

// Definim pentru ce roluri poate acorda permisiuni fiecare rol
const roleAdminScope: Record<RoleLevel, RoleLevel[]> = {
  [RoleLevel.SUPER_ADMIN]: [
    RoleLevel.COMPANY_ADMIN,
    RoleLevel.MANAGER,
    RoleLevel.EMPLOYEE,
    RoleLevel.GUEST,
  ],
  [RoleLevel.COMPANY_ADMIN]: [
    RoleLevel.MANAGER,
    RoleLevel.EMPLOYEE,
  ],
  [RoleLevel.MANAGER]: [
    RoleLevel.EMPLOYEE,
  ],
  [RoleLevel.EMPLOYEE]: [],
  [RoleLevel.GUEST]: [],
};

// Verifică dacă un utilizator poate administra o anumită capabilitate
export const canAdministerCapability = (
  adminUser: User,
  capability: Capability
): boolean => {
  if (!adminUser) return false;
  
  const adminRoleLevel = getRoleLevel(adminUser.role);
  return capabilityAdminScope[adminRoleLevel].includes(capability);
};

// Verifică dacă un utilizator poate administra permisiunile unui alt utilizator
export const canAdministerUserPermissions = (
  adminUser: User,
  targetUser: User
): boolean => {
  if (!adminUser || !targetUser) return false;
  
  // Nu poți administra propriile permisiuni
  if (adminUser.id === targetUser.id) return false;
  
  const adminRoleLevel = getRoleLevel(adminUser.role);
  const targetRoleLevel = getRoleLevel(targetUser.role);
  
  // Verificăm dacă rolul utilizatorului țintă este în scopul de administrare
  // al utilizatorului administrator
  return roleAdminScope[adminRoleLevel].includes(targetRoleLevel);
};

// Verifică dacă un utilizator are permisiunea să atribuie o anumită capabilitate unui alt utilizator
export const canGrantCapability = (
  adminUser: User,
  targetUser: User,
  capability: Capability
): boolean => {
  return (
    canAdministerUserPermissions(adminUser, targetUser) &&
    canAdministerCapability(adminUser, capability)
  );
};

// Returnează lista de capabilități pe care un utilizator le poate administra
export const getAdministrableCapabilities = (adminUser: User): Capability[] => {
  if (!adminUser) return [];
  
  const adminRoleLevel = getRoleLevel(adminUser.role);
  return capabilityAdminScope[adminRoleLevel];
};

// Returnează nivelurile de roluri pe care un utilizator le poate administra
export const getAdministrableRoles = (adminUser: User): RoleLevel[] => {
  if (!adminUser) return [];
  
  const adminRoleLevel = getRoleLevel(adminUser.role);
  return roleAdminScope[adminRoleLevel];
};

// Verifică dacă un rol poate administra un anumit rol
export const canRoleAdministerRole = (
  adminRoleLevel: RoleLevel,
  targetRoleLevel: RoleLevel
): boolean => {
  return roleAdminScope[adminRoleLevel].includes(targetRoleLevel);
};

// Filtrează o listă de utilizatori la cei care pot fi administrați de un utilizator
export const filterAdministrableUsers = (
  adminUser: User,
  users: User[]
): User[] => {
  if (!adminUser || !users) return [];
  
  const adminRoleLevel = getRoleLevel(adminUser.role);
  return users.filter(
    (user) => 
      user.id !== adminUser.id && // Nu te poți administra pe tine însuți
      roleAdminScope[adminRoleLevel].includes(getRoleLevel(user.role))
  );
}; 