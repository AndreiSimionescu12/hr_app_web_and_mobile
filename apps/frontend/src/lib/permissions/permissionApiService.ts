/**
 * Serviciu pentru interacțiunea cu API-ul de permisiuni
 */
import { authFetch } from '../auth/authUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Capability {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  capabilities: Array<{
    id: string;
    permissionGroupId: string;
    capabilityId: string;
    capability: Capability;
  }>;
  users: Array<{
    id: string;
    userId: string;
    permissionGroupId: string;
    user: {
      id: string;
      email: string;
      role: string;
    };
  }>;
}

export interface UserCapability {
  id: string;
  userId: string;
  capabilityId: string;
  isGranted: boolean;
  createdAt: string;
  updatedAt: string;
  capability: Capability;
}

export interface AuditLog {
  id: string;
  userId: string;
  performedBy: string;
  action: string;
  details: string;
  timestamp: string;
}

export const PermissionApiService = {
  // API pentru capacități
  async getAllCapabilities(): Promise<Capability[]> {
    const response = await authFetch(`${API_BASE_URL}/permissions/capabilities`);
    return response.json();
  },

  async getCapabilityById(id: string): Promise<Capability> {
    const response = await authFetch(`${API_BASE_URL}/permissions/capabilities/${id}`);
    return response.json();
  },

  async createCapability(name: string, description: string): Promise<Capability> {
    const response = await authFetch(`${API_BASE_URL}/permissions/capabilities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });
    return response.json();
  },

  async updateCapability(id: string, data: { name?: string; description?: string }): Promise<Capability> {
    const response = await authFetch(`${API_BASE_URL}/permissions/capabilities/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteCapability(id: string): Promise<void> {
    await authFetch(`${API_BASE_URL}/permissions/capabilities/${id}`, {
      method: 'DELETE',
    });
  },

  // API pentru permisiuni utilizator
  async getUserCapabilities(userId: string): Promise<Capability[]> {
    const response = await authFetch(`${API_BASE_URL}/permissions/users/${userId}/capabilities`);
    return response.json();
  },

  async grantCapabilityToUser(userId: string, capabilityId: string): Promise<UserCapability> {
    const response = await authFetch(`${API_BASE_URL}/permissions/users/${userId}/capabilities/${capabilityId}`, {
      method: 'POST',
    });
    return response.json();
  },

  async revokeCapabilityFromUser(userId: string, capabilityId: string): Promise<UserCapability> {
    const response = await authFetch(`${API_BASE_URL}/permissions/users/${userId}/capabilities/${capabilityId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // API pentru grupuri de permisiuni
  async getAllPermissionGroups(): Promise<PermissionGroup[]> {
    const response = await authFetch(`${API_BASE_URL}/permissions/groups`);
    return response.json();
  },

  async getPermissionGroupById(id: string): Promise<PermissionGroup> {
    const response = await authFetch(`${API_BASE_URL}/permissions/groups/${id}`);
    return response.json();
  },

  async createPermissionGroup(name: string, description: string): Promise<PermissionGroup> {
    const response = await authFetch(`${API_BASE_URL}/permissions/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });
    return response.json();
  },

  async addCapabilityToGroup(groupId: string, capabilityId: string): Promise<any> {
    const response = await authFetch(`${API_BASE_URL}/permissions/groups/${groupId}/capabilities/${capabilityId}`, {
      method: 'POST',
    });
    return response.json();
  },

  async removeCapabilityFromGroup(groupId: string, capabilityId: string): Promise<any> {
    const response = await authFetch(`${API_BASE_URL}/permissions/groups/${groupId}/capabilities/${capabilityId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  async addUserToGroup(groupId: string, userId: string): Promise<any> {
    const response = await authFetch(`${API_BASE_URL}/permissions/groups/${groupId}/users/${userId}`, {
      method: 'POST',
    });
    return response.json();
  },

  async removeUserFromGroup(groupId: string, userId: string): Promise<any> {
    const response = await authFetch(`${API_BASE_URL}/permissions/groups/${groupId}/users/${userId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // API pentru roluri
  async getAllRoles(): Promise<string[]> {
    const response = await authFetch(`${API_BASE_URL}/permissions/roles`);
    return response.json();
  },

  async addCapabilityToRole(role: string, capabilityId: string): Promise<any> {
    const response = await authFetch(`${API_BASE_URL}/permissions/roles/${role}/capabilities/${capabilityId}`, {
      method: 'POST',
    });
    return response.json();
  },

  async removeCapabilityFromRole(role: string, capabilityId: string): Promise<any> {
    const response = await authFetch(`${API_BASE_URL}/permissions/roles/${role}/capabilities/${capabilityId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // API pentru audit
  async getAuditLogs(filters?: { userId?: string; action?: string; startDate?: Date; endDate?: Date }): Promise<AuditLog[]> {
    const response = await authFetch(`${API_BASE_URL}/permissions/audit`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...(filters ? { body: JSON.stringify(filters) } : {}),
    });
    return response.json();
  },
}; 