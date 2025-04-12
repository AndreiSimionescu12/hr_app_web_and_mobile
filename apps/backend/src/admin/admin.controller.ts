import { Controller, Post, Body, Req } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('create-company')
  async createCompany(
    @Req() req,
    @Body() createCompanyDto: {
      name: string;
      cui: string;
      adminEmail: string;
      adminPassword: string;
      address?: string;
      phone?: string;
      email?: string;
    },
  ) {
    return this.adminService.createCompany(req.user?.id, createCompanyDto);
  }
} 