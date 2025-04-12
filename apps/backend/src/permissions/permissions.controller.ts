import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  Request,
  BadRequestException,
  Put,
  Req
} from '@nestjs/common';
import { PermissionsService, UserRole } from './permissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CapabilityGuard } from '../auth/guards/capability.guard';
import { RequireCapabilities } from '../auth/decorators/require-capabilities.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  // ==================== API pentru Capacități =====================

  @Get('capabilities')
  @UseGuards(CapabilityGuard)
  @RequireCapabilities('permissions.read')
  @ApiOperation({ summary: 'Obține toate capacitățile' })
  @ApiResponse({ status: 200, description: 'Lista de capacități returnată cu succes' })
  async getAllCapabilities() {
    return this.permissionsService.getAllCapabilities();
  }

  @Post('capabilities')
  @UseGuards(CapabilityGuard)
  @RequireCapabilities('permissions.create')
  @ApiOperation({ summary: 'Creează o nouă capacitate' })
  @ApiResponse({ status: 201, description: 'Capacitatea a fost creată cu succes' })
  async createCapability(
    @Body() data: { name: string; description: string },
    @CurrentUser() user,
  ) {
    const result = await this.permissionsService.createCapability(data.name, data.description);
    // Logăm acțiunea pentru audit
    await this.permissionsService.logPermissionAction(
      user.id,
      'CREATE_CAPABILITY',
      `A creat capacitatea ${data.name}`,
    );
    return result;
  }

  @Get('capabilities/:id')
  @UseGuards(CapabilityGuard)
  @RequireCapabilities('permissions.read')
  @ApiOperation({ summary: 'Obține o capacitate specifică după ID' })
  @ApiParam({ name: 'id', description: 'ID-ul capacității' })
  @ApiResponse({ status: 200, description: 'Capacitatea returnată cu succes' })
  @ApiResponse({ status: 404, description: 'Capacitatea nu a fost găsită' })
  async getCapabilityById(@Param('id') id: string) {
    return this.permissionsService.getCapabilityById(parseInt(id));
  }

  @Patch('capabilities/:id')
  @UseGuards(CapabilityGuard)
  @RequireCapabilities('permissions.update')
  @ApiOperation({ summary: 'Actualizează o capacitate existentă' })
  @ApiParam({ name: 'id', description: 'ID-ul capacității' })
  @ApiResponse({ status: 200, description: 'Capacitatea a fost actualizată cu succes' })
  @ApiResponse({ status: 404, description: 'Capacitatea nu a fost găsită' })
  async updateCapability(
    @Param('id') id: string,
    @Body() data: { name?: string; description?: string },
    @CurrentUser() user,
  ) {
    const result = await this.permissionsService.updateCapability(
      parseInt(id),
      data.name,
      data.description,
    );
    // Logăm acțiunea pentru audit
    await this.permissionsService.logPermissionAction(
      user.id,
      'UPDATE_CAPABILITY',
      `A actualizat capacitatea ${result.name}`,
    );
    return result;
  }

  @Delete('capabilities/:id')
  @UseGuards(CapabilityGuard)
  @RequireCapabilities('permissions.delete')
  @ApiOperation({ summary: 'Elimină o capacitate' })
  @ApiParam({ name: 'id', description: 'ID-ul capacității' })
  @ApiResponse({ status: 200, description: 'Capacitatea a fost eliminată cu succes' })
  @ApiResponse({ status: 404, description: 'Capacitatea nu a fost găsită' })
  async deleteCapability(@Param('id') id: string) {
    return this.permissionsService.deleteCapability(parseInt(id));
  }

  // ==================== API pentru permisiuni utilizator =====================

  @Get('users/:userId/capabilities')
  @UseGuards(CapabilityGuard)
  @RequireCapabilities('permissions.read')
  @ApiOperation({ summary: 'Obține capacitățile unui utilizator' })
  @ApiParam({ name: 'userId', description: 'ID-ul utilizatorului' })
  @ApiResponse({ status: 200, description: 'Lista de capacități returnată cu succes' })
  @ApiResponse({ status: 404, description: 'Utilizatorul nu a fost găsit' })
  async getUserCapabilities(@Param('userId') userId: string) {
    return this.permissionsService.getUserCapabilities(parseInt(userId));
  }

  @Post('users/:userId/capabilities/:capabilityId')
  @UseGuards(CapabilityGuard)
  @RequireCapabilities('permissions.grant')
  @ApiOperation({ summary: 'Acordă o capacitate unui utilizator' })
  @ApiParam({ name: 'userId', description: 'ID-ul utilizatorului' })
  @ApiParam({ name: 'capabilityId', description: 'ID-ul capacității' })
  @ApiResponse({ status: 200, description: 'Capacitatea a fost acordată cu succes utilizatorului' })
  @ApiResponse({ status: 404, description: 'Utilizatorul sau capacitatea nu a fost găsită' })
  async grantCapabilityToUser(
    @Param('userId') userId: string,
    @Param('capabilityId') capabilityId: string,
    @Req() req,
  ) {
    // Înregistrăm acțiunea de acordare a permisiunii pentru audit
    await this.permissionsService.logPermissionAction(
      req.user.id,
      'GRANT_CAPABILITY',
      `Capacitate ${capabilityId} acordată utilizatorului ${userId}`,
    );
    
    return this.permissionsService.grantCapabilityToUser(parseInt(userId), parseInt(capabilityId));
  }

  @Delete('users/:userId/capabilities/:capabilityId')
  @UseGuards(CapabilityGuard)
  @RequireCapabilities('permissions.revoke')
  @ApiOperation({ summary: 'Revocă o capacitate de la un utilizator' })
  @ApiParam({ name: 'userId', description: 'ID-ul utilizatorului' })
  @ApiParam({ name: 'capabilityId', description: 'ID-ul capacității' })
  @ApiResponse({ status: 200, description: 'Capacitatea a fost revocată cu succes de la utilizator' })
  @ApiResponse({ status: 404, description: 'Utilizatorul sau capacitatea nu a fost găsită' })
  async revokeCapabilityFromUser(
    @Param('userId') userId: string,
    @Param('capabilityId') capabilityId: string,
    @Req() req,
  ) {
    // Înregistrăm acțiunea de revocare a permisiunii pentru audit
    await this.permissionsService.logPermissionAction(
      req.user.id,
      'REVOKE_CAPABILITY',
      `Capacitate ${capabilityId} revocată de la utilizatorul ${userId}`,
    );
    
    return this.permissionsService.revokeCapabilityFromUser(parseInt(userId), parseInt(capabilityId));
  }

  // ==================== API pentru grupuri de permisiuni =====================

  @Get('groups')
  @UseGuards(CapabilityGuard)
  @RequireCapabilities('permissions.read')
  @ApiOperation({ summary: 'Obține toate grupurile de permisiuni' })
  @ApiResponse({ status: 200, description: 'Lista de grupuri de permisiuni returnată cu succes' })
  async getAllPermissionGroups() {
    return this.permissionsService.getAllPermissionGroups();
  }

  @Post('groups')
  @UseGuards(CapabilityGuard)
  @RequireCapabilities('permissions.create')
  @ApiOperation({ summary: 'Creează un nou grup de permisiuni' })
  @ApiResponse({ status: 201, description: 'Grupul de permisiuni a fost creat cu succes' })
  async createPermissionGroup(
    @Body() data: { name: string; description: string },
    @CurrentUser() user,
  ) {
    const result = await this.permissionsService.createPermissionGroup(data.name, data.description);
    // Logăm acțiunea pentru audit
    await this.permissionsService.logPermissionAction(
      user.id,
      'CREATE_PERMISSION_GROUP',
      `A creat grupul de permisiuni ${data.name}`,
    );
    return result;
  }

  @Get('groups/:id')
  @UseGuards(CapabilityGuard)
  @RequireCapabilities('permissions.read')
  @ApiOperation({ summary: 'Obține un grup de permisiuni după ID' })
  @ApiParam({ name: 'id', description: 'ID-ul grupului de permisiuni' })
  @ApiResponse({ status: 200, description: 'Grupul de permisiuni returnat cu succes' })
  @ApiResponse({ status: 404, description: 'Grupul de permisiuni nu a fost găsit' })
  async getPermissionGroupById(@Param('id') id: string) {
    return this.permissionsService.getPermissionGroupById(parseInt(id));
  }

  @Post('groups/:groupId/capabilities/:capabilityId')
  @UseGuards(CapabilityGuard)
  @RequireCapabilities('permissions.update')
  @ApiOperation({ summary: 'Adaugă o capacitate la un grup de permisiuni' })
  @ApiParam({ name: 'groupId', description: 'ID-ul grupului de permisiuni' })
  @ApiParam({ name: 'capabilityId', description: 'ID-ul capacității' })
  @ApiResponse({ status: 200, description: 'Capacitatea a fost adăugată cu succes la grup' })
  @ApiResponse({ status: 404, description: 'Grupul sau capacitatea nu a fost găsită' })
  async addCapabilityToGroup(
    @Param('groupId') groupId: string,
    @Param('capabilityId') capabilityId: string,
    @CurrentUser() user,
  ) {
    const result = await this.permissionsService.addCapabilityToGroup(
      parseInt(groupId),
      parseInt(capabilityId),
    );
    // Logăm acțiunea pentru audit
    await this.permissionsService.logPermissionAction(
      user.id,
      'ADD_CAPABILITY_TO_GROUP',
      `A adăugat capacitatea ${capabilityId} la grupul ${groupId}`,
    );
    return result;
  }

  @Delete('groups/:groupId/capabilities/:capabilityId')
  @UseGuards(CapabilityGuard)
  @RequireCapabilities('permissions.update')
  @ApiOperation({ summary: 'Elimină o capacitate de la un grup de permisiuni' })
  @ApiParam({ name: 'groupId', description: 'ID-ul grupului de permisiuni' })
  @ApiParam({ name: 'capabilityId', description: 'ID-ul capacității' })
  @ApiResponse({ status: 200, description: 'Capacitatea a fost eliminată cu succes de la grup' })
  @ApiResponse({ status: 404, description: 'Grupul sau capacitatea nu a fost găsită' })
  async removeCapabilityFromGroup(
    @Param('groupId') groupId: string,
    @Param('capabilityId') capabilityId: string,
    @CurrentUser() user,
  ) {
    const result = await this.permissionsService.removeCapabilityFromGroup(
      parseInt(groupId),
      parseInt(capabilityId),
    );
    // Logăm acțiunea pentru audit
    await this.permissionsService.logPermissionAction(
      user.id,
      'REMOVE_CAPABILITY_FROM_GROUP',
      `A eliminat capacitatea ${capabilityId} de la grupul ${groupId}`,
    );
    return result;
  }

  @Post('groups/:groupId/users/:userId')
  @UseGuards(CapabilityGuard)
  @RequireCapabilities('permissions.update')
  @ApiOperation({ summary: 'Adaugă un utilizator la un grup de permisiuni' })
  @ApiParam({ name: 'groupId', description: 'ID-ul grupului de permisiuni' })
  @ApiParam({ name: 'userId', description: 'ID-ul utilizatorului' })
  @ApiResponse({ status: 200, description: 'Utilizatorul a fost adăugat cu succes la grup' })
  @ApiResponse({ status: 404, description: 'Grupul sau utilizatorul nu a fost găsit' })
  async addUserToGroup(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @CurrentUser() user,
  ) {
    const result = await this.permissionsService.addUserToGroup(
      parseInt(groupId),
      parseInt(userId),
    );
    // Logăm acțiunea pentru audit
    await this.permissionsService.logPermissionAction(
      user.id,
      'ADD_USER_TO_GROUP',
      `A adăugat utilizatorul ${userId} la grupul ${groupId}`,
    );
    return result;
  }

  @Delete('groups/:groupId/users/:userId')
  @UseGuards(CapabilityGuard)
  @RequireCapabilities('permissions.update')
  @ApiOperation({ summary: 'Elimină un utilizator de la un grup de permisiuni' })
  @ApiParam({ name: 'groupId', description: 'ID-ul grupului de permisiuni' })
  @ApiParam({ name: 'userId', description: 'ID-ul utilizatorului' })
  @ApiResponse({ status: 200, description: 'Utilizatorul a fost eliminat cu succes de la grup' })
  @ApiResponse({ status: 404, description: 'Grupul sau utilizatorul nu a fost găsit' })
  async removeUserFromGroup(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @CurrentUser() user,
  ) {
    const result = await this.permissionsService.removeUserFromGroup(
      parseInt(groupId),
      parseInt(userId),
    );
    // Logăm acțiunea pentru audit
    await this.permissionsService.logPermissionAction(
      user.id,
      'REMOVE_USER_FROM_GROUP',
      `A eliminat utilizatorul ${userId} de la grupul ${groupId}`,
    );
    return result;
  }

  // ==================== API pentru audit =====================

  @Get('audit')
  @UseGuards(CapabilityGuard)
  @RequireCapabilities('permissions.audit')
  @ApiOperation({ summary: 'Obține jurnalele de audit pentru permisiuni' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filtrează după ID-ul utilizatorului' })
  @ApiQuery({ name: 'action', required: false, description: 'Filtrează după tipul acțiunii' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Data de început pentru filtrare' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Data de sfârșit pentru filtrare' })
  @ApiResponse({ status: 200, description: 'Jurnalele de audit returnate cu succes' })
  async getAuditLogs(
    @Req() req,
    @Body() filters?: { userId?: string; action?: string; startDate?: Date; endDate?: Date },
  ) {
    const userId = req.user.id;
    // Doar utilizatorii cu permisiunea 'permissions.audit' pot vedea toate înregistrările
    // Ceilalți utilizatori pot vedea doar propriile lor înregistrări
    return this.permissionsService.getAuditLogs(
      filters?.userId || userId,
      filters?.action,
      filters?.startDate,
      filters?.endDate,
    );
  }

  // ==================== API pentru roluri =====================

  @Get('roles')
  @UseGuards(CapabilityGuard)
  @RequireCapabilities('permissions.read')
  @ApiOperation({ summary: 'Obține toate rolurile' })
  @ApiResponse({ status: 200, description: 'Lista de roluri returnată cu succes' })
  async getAllRoles() {
    return this.permissionsService.getAllRoles();
  }

  @Post('roles/:role/capabilities/:capabilityId')
  @UseGuards(CapabilityGuard)
  @RequireCapabilities('permissions.admin')
  @ApiOperation({ summary: 'Adaugă o capacitate la un rol' })
  @ApiParam({ name: 'role', description: 'Nume rol' })
  @ApiParam({ name: 'capabilityId', description: 'ID-ul capacității' })
  @ApiResponse({ status: 200, description: 'Capacitatea a fost adăugată cu succes la rol' })
  @ApiResponse({ status: 404, description: 'Rolul sau capacitatea nu a fost găsită' })
  async addCapabilityToRole(
    @Param('role') role: string,
    @Param('capabilityId') capabilityId: string,
    @CurrentUser() user,
  ) {
    const result = await this.permissionsService.addCapabilityToRole(role, parseInt(capabilityId));
    // Logăm acțiunea pentru audit
    await this.permissionsService.logPermissionAction(
      user.id,
      'ADD_CAPABILITY_TO_ROLE',
      `A adăugat capacitatea ${capabilityId} la rolul ${role}`,
    );
    return result;
  }

  @Delete('roles/:role/capabilities/:capabilityId')
  @UseGuards(CapabilityGuard)
  @RequireCapabilities('permissions.admin')
  @ApiOperation({ summary: 'Elimină o capacitate de la un rol' })
  @ApiParam({ name: 'role', description: 'Nume rol' })
  @ApiParam({ name: 'capabilityId', description: 'ID-ul capacității' })
  @ApiResponse({ status: 200, description: 'Capacitatea a fost eliminată cu succes de la rol' })
  @ApiResponse({ status: 404, description: 'Rolul sau capacitatea nu a fost găsită' })
  async removeCapabilityFromRole(
    @Param('role') role: string,
    @Param('capabilityId') capabilityId: string,
    @CurrentUser() user,
  ) {
    const result = await this.permissionsService.removeCapabilityFromRole(role, parseInt(capabilityId));
    // Logăm acțiunea pentru audit
    await this.permissionsService.logPermissionAction(
      user.id,
      'REMOVE_CAPABILITY_FROM_ROLE',
      `A eliminat capacitatea ${capabilityId} de la rolul ${role}`,
    );
    return result;
  }
} 