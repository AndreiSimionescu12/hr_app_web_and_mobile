import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

// Definim manual enum-ul pentru a evita eroarea de import
enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        companyId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email }
    });
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async createSuperAdmin(email: string, password: string) {
    const hashedPassword = await this.hashPassword(password);

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        isActive: true,
      },
    });
  }

  async createAdminForCompany(email: string, password: string, companyId: string) {
    const hashedPassword = await this.hashPassword(password);

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: UserRole.COMPANY_ADMIN,
        companyId,
        isActive: true,
      },
    });
  }
} 