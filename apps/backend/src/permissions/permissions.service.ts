import { Injectable, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Tipuri pentru API
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
}

export type Permission = {
  id: string;
  name: string;
  description: string;
};

// Ierarhia rolurilor pentru a determina cine poate acorda permisiuni cui
const roleHierarchy = {
  [UserRole.SUPER_ADMIN]: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE],
  [UserRole.COMPANY_ADMIN]: [UserRole.COMPANY_ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE],
  [UserRole.MANAGER]: [UserRole.MANAGER, UserRole.EMPLOYEE],
  [UserRole.EMPLOYEE]: [],
};

// Verifică dacă un rol poate administra alt rol
function canManageRole(adminRole: UserRole, targetRole: UserRole): boolean {
  return roleHierarchy[adminRole]?.includes(targetRole) || false;
}

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  // ------------------------------
  // Metode pentru capacități (capabilities)
  // ------------------------------

  async getAllCapabilities() {
    return this.prisma.capability.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async createCapability(name: string, description: string) {
    return this.prisma.capability.create({
      data: { name, description },
    });
  }

  async getCapabilityById(id: string) {
    const capability = await this.prisma.capability.findUnique({
      where: { id },
    });
    
    if (!capability) {
      throw new NotFoundException(`Capacitatea cu ID-ul ${id} nu a fost găsită`);
    }
    
    return capability;
  }

  async updateCapability(id: string, data: { name?: string; description?: string }) {
    const capability = await this.prisma.capability.findUnique({
      where: { id },
    });
    
    if (!capability) {
      throw new NotFoundException(`Capacitatea cu ID-ul ${id} nu a fost găsită`);
    }
    
    return this.prisma.capability.update({
      where: { id },
      data,
    });
  }

  async deleteCapability(id: string) {
    const capability = await this.prisma.capability.findUnique({
      where: { id },
    });
    
    if (!capability) {
      throw new NotFoundException(`Capacitatea cu ID-ul ${id} nu a fost găsită`);
    }
    
    return this.prisma.capability.delete({
      where: { id },
    });
  }

  // ------------------------------
  // Metode pentru roluri și capacități
  // ------------------------------

  async getAllRoles() {
    // Returnează toate rolurile disponibile în sistem
    return Object.values(this.prisma.$transaction(async (prisma) => {
      // Preluăm toate rolurile din RoleCapability
      const roleCapabilities = await prisma.roleCapability.findMany({
        select: { role: true },
        distinct: ['role'],
      });
      
      // Extragem valorile unice ale rolurilor
      return roleCapabilities.map(rc => rc.role);
    }));
  }

  async addCapabilityToRole(role: string, capabilityId: string) {
    // Verificăm dacă capacitatea există
    const capability = await this.prisma.capability.findUnique({ 
      where: { id: capabilityId } 
    });
    
    if (!capability) {
      throw new NotFoundException(`Capacitatea cu ID-ul ${capabilityId} nu a fost găsită`);
    }
    
    // Adăugăm capacitatea la rol
    return this.prisma.roleCapability.create({
      data: {
        role,
        capabilityId,
      },
    });
  }

  async removeCapabilityFromRole(role: string, capabilityId: string) {
    // Verificăm dacă relația există
    const roleCapability = await this.prisma.roleCapability.findFirst({
      where: {
        role,
        capabilityId,
      },
    });
    
    if (!roleCapability) {
      throw new NotFoundException(`Capacitatea cu ID-ul ${capabilityId} nu este asociată cu rolul ${role}`);
    }
    
    // Ștergem relația
    return this.prisma.roleCapability.delete({
      where: { id: roleCapability.id },
    });
  }

  // ------------------------------
  // Metode pentru utilizatori și capacități
  // ------------------------------

  async getUserCapabilities(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { 
        userCapabilities: {
          include: { capability: true },
          where: { isGranted: true },
        },
      },
    });
    
    if (!user) {
      throw new NotFoundException(`Utilizatorul cu ID-ul ${userId} nu a fost găsit`);
    }
    
    // Obținem și capacitățile bazate pe rol
    const roleCapabilities = await this.prisma.roleCapability.findMany({
      where: { role: user.role },
      include: { capability: true },
    });
    
    // Obținem capacitățile de la grupurile de permisiuni
    const permissionGroupCapabilities = await this.prisma.userPermissionGroup.findMany({
      where: { userId },
      include: {
        permissionGroup: {
          include: {
            capabilities: {
              include: { capability: true },
            },
          },
        },
      },
    });
    
    // Combinăm toate capacitățile
    const directCapabilities = user.userCapabilities.map(uc => uc.capability);
    const roleBasedCapabilities = roleCapabilities.map(rc => rc.capability);
    const groupCapabilities = permissionGroupCapabilities.flatMap(
      pg => pg.permissionGroup.capabilities.map(c => c.capability)
    );
    
    // Eliminăm duplicatele folosind un Map
    const allCapabilitiesMap = new Map();
    
    [...directCapabilities, ...roleBasedCapabilities, ...groupCapabilities].forEach(cap => {
      allCapabilitiesMap.set(cap.id, cap);
    });
    
    return Array.from(allCapabilitiesMap.values());
  }

  async grantCapabilityToUser(userId: string, capabilityId: string) {
    // Verificăm dacă utilizatorul și capacitatea există
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const capability = await this.prisma.capability.findUnique({ where: { id: capabilityId } });
    
    if (!user) {
      throw new NotFoundException(`Utilizatorul cu ID-ul ${userId} nu a fost găsit`);
    }
    
    if (!capability) {
      throw new NotFoundException(`Capacitatea cu ID-ul ${capabilityId} nu a fost găsită`);
    }
    
    // Verificăm dacă relația există deja
    const existingCapability = await this.prisma.userCapability.findUnique({
      where: {
        userId_capabilityId: {
          userId,
          capabilityId,
        },
      },
    });
    
    if (existingCapability) {
      // Dacă există, actualizăm isGranted la true
      return this.prisma.userCapability.update({
        where: { id: existingCapability.id },
        data: { isGranted: true },
        include: { capability: true },
      });
    }
    
    // Dacă nu există, creăm o nouă relație
    return this.prisma.userCapability.create({
      data: {
        userId,
        capabilityId,
        isGranted: true,
      },
      include: { capability: true },
    });
  }

  async revokeCapabilityFromUser(userId: string, capabilityId: string) {
    // Verificăm dacă relația există
    const userCapability = await this.prisma.userCapability.findUnique({
      where: {
        userId_capabilityId: {
          userId,
          capabilityId,
        },
      },
    });
    
    if (!userCapability) {
      throw new NotFoundException(`Utilizatorul nu are capacitatea cu ID-ul ${capabilityId}`);
    }
    
    if (userCapability.isGranted) {
      // Setăm isGranted la false pentru a revoca permisiunea
      return this.prisma.userCapability.update({
        where: { id: userCapability.id },
        data: { isGranted: false },
        include: { capability: true },
      });
    }
    
    return userCapability;
  }

  // ------------------------------
  // Metode pentru grupuri de permisiuni
  // ------------------------------

  async getAllPermissionGroups() {
    return this.prisma.permissionGroup.findMany({
      include: {
        capabilities: {
          include: { capability: true },
        },
        users: {
          include: { user: true },
        },
      },
    });
  }

  async createPermissionGroup(name: string, description: string) {
    return this.prisma.permissionGroup.create({
      data: { name, description },
    });
  }

  async getPermissionGroupById(id: string) {
    const group = await this.prisma.permissionGroup.findUnique({
      where: { id },
      include: {
        capabilities: {
          include: { capability: true },
        },
        users: {
          include: { user: true },
        },
      },
    });
    
    if (!group) {
      throw new NotFoundException(`Grupul de permisiuni cu ID-ul ${id} nu a fost găsit`);
    }
    
    return group;
  }

  async addCapabilityToGroup(groupId: string, capabilityId: string) {
    // Verificăm dacă grupul și capacitatea există
    const group = await this.prisma.permissionGroup.findUnique({ where: { id: groupId } });
    const capability = await this.prisma.capability.findUnique({ where: { id: capabilityId } });
    
    if (!group) {
      throw new NotFoundException(`Grupul de permisiuni cu ID-ul ${groupId} nu a fost găsit`);
    }
    
    if (!capability) {
      throw new NotFoundException(`Capacitatea cu ID-ul ${capabilityId} nu a fost găsită`);
    }
    
    // Verificăm dacă relația există deja
    const existingRelation = await this.prisma.capabilityGroup.findUnique({
      where: {
        permissionGroupId_capabilityId: {
          permissionGroupId: groupId,
          capabilityId,
        },
      },
    });
    
    if (existingRelation) {
      return existingRelation;
    }
    
    // Adăugăm capacitatea la grup
    return this.prisma.capabilityGroup.create({
      data: {
        permissionGroupId: groupId,
        capabilityId,
      },
    });
  }

  async removeCapabilityFromGroup(groupId: string, capabilityId: string) {
    // Verificăm dacă relația există
    const capabilityGroup = await this.prisma.capabilityGroup.findUnique({
      where: {
        permissionGroupId_capabilityId: {
          permissionGroupId: groupId,
          capabilityId,
        },
      },
    });
    
    if (!capabilityGroup) {
      throw new NotFoundException(`Capacitatea cu ID-ul ${capabilityId} nu face parte din grupul cu ID-ul ${groupId}`);
    }
    
    // Ștergem relația
    return this.prisma.capabilityGroup.delete({
      where: { id: capabilityGroup.id },
    });
  }

  async addUserToGroup(groupId: string, userId: string) {
    // Verificăm dacă grupul și utilizatorul există
    const group = await this.prisma.permissionGroup.findUnique({ where: { id: groupId } });
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    if (!group) {
      throw new NotFoundException(`Grupul de permisiuni cu ID-ul ${groupId} nu a fost găsit`);
    }
    
    if (!user) {
      throw new NotFoundException(`Utilizatorul cu ID-ul ${userId} nu a fost găsit`);
    }
    
    // Verificăm dacă relația există deja
    const existingRelation = await this.prisma.userPermissionGroup.findUnique({
      where: {
        userId_permissionGroupId: {
          userId,
          permissionGroupId: groupId,
        },
      },
    });
    
    if (existingRelation) {
      return existingRelation;
    }
    
    // Adăugăm utilizatorul la grup
    return this.prisma.userPermissionGroup.create({
      data: {
        userId,
        permissionGroupId: groupId,
      },
    });
  }

  async removeUserFromGroup(groupId: string, userId: string) {
    // Verificăm dacă relația există
    const userGroup = await this.prisma.userPermissionGroup.findUnique({
      where: {
        userId_permissionGroupId: {
          userId,
          permissionGroupId: groupId,
        },
      },
    });
    
    if (!userGroup) {
      throw new NotFoundException(`Utilizatorul cu ID-ul ${userId} nu face parte din grupul cu ID-ul ${groupId}`);
    }
    
    // Ștergem relația
    return this.prisma.userPermissionGroup.delete({
      where: { id: userGroup.id },
    });
  }

  // ------------------------------
  // Metode pentru verificarea permisiunilor
  // ------------------------------

  async checkUserPermission(userId: string, requiredCapability: string) {
    const userCapabilities = await this.getUserCapabilities(userId);
    return userCapabilities.some(cap => cap.name === requiredCapability);
  }

  // ------------------------------
  // Metode pentru auditare
  // ------------------------------

  async logPermissionAction(userId: string, action: string, details: string) {
    return this.prisma.permissionAudit.create({
      data: {
        userId,
        performedBy: userId, // În acest caz, utilizatorul care efectuează acțiunea este același cu cel afectat
        action,
        details,
        timestamp: new Date(),
      },
    });
  }

  async getAuditLogs(userId?: string, action?: string, startDate?: Date, endDate?: Date) {
    const where: any = {};
    
    if (userId) {
      where.userId = userId;
    }
    
    if (action) {
      where.action = action;
    }
    
    if (startDate || endDate) {
      where.timestamp = {};
      
      if (startDate) {
        where.timestamp.gte = startDate;
      }
      
      if (endDate) {
        where.timestamp.lte = endDate;
      }
    }
    
    return this.prisma.permissionAudit.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      include: { 
        // Includem informații despre utilizator pentru a afișa numele său
        // performedBy este doar un ID, deci nu-l putem include direct
      },
    });
  }
} 