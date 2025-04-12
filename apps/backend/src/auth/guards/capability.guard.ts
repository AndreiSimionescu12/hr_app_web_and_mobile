import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRED_CAPABILITIES_KEY } from '../decorators/require-capabilities.decorator';
import { PermissionsService } from '../services/permissions.service';

@Injectable()
export class CapabilityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredCapabilities = this.reflector.getAllAndOverride<string[]>(
      REQUIRED_CAPABILITIES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredCapabilities) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Utilizatorul nu este autentificat');
    }
    
    // Permit SUPER_ADMIN să ocolească verificările de permisiuni
    if (user.role === 'SUPER_ADMIN') {
      return true;
    }

    for (const capability of requiredCapabilities) {
      const hasPermission = await this.permissionsService.checkUserPermission(
        user.id,
        capability,
      );

      if (!hasPermission) {
        throw new UnauthorizedException(`Lipsă permisiune: ${capability}`);
      }
    }

    return true;
  }
} 