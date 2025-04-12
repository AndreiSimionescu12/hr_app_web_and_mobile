import { SetMetadata } from '@nestjs/common';

export const REQUIRED_CAPABILITIES_KEY = 'capabilities';

export const RequireCapabilities = (...capabilities: string[]) => 
  SetMetadata(REQUIRED_CAPABILITIES_KEY, capabilities); 