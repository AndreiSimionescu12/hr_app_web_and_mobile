import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserRole } from '../user/user-role.enum';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async createCompany(
    creatorId: string | undefined,
    companyData: {
      name: string;
      cui: string;
      adminEmail: string;
      adminPassword: string;
      address?: string;
      phone?: string;
      email?: string;
    },
  ) {
    // Verificăm dacă CUI-ul este deja utilizat
    const existingCompany = await this.prisma.company.findFirst({
      where: { cui: companyData.cui },
    });

    if (existingCompany) {
      throw new BadRequestException('CUI-ul este deja înregistrat');
    }

    // Criptăm parola administratorului
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(companyData.adminPassword, salt);

    // Creăm compania și administratorul într-o singură tranzacție
    return this.prisma.$transaction(async (tx) => {
      // 1. Creăm compania
      const company = await tx.company.create({
        data: {
          name: companyData.name,
          cui: companyData.cui,
          address: companyData.address,
          phone: companyData.phone,
          email: companyData.email,
        },
      });

      // 2. Creăm utilizatorul administrator
      const admin = await tx.user.create({
        data: {
          email: companyData.adminEmail,
          password: hashedPassword,
          role: 'COMPANY_ADMIN',
          companyId: company.id,
          isActive: true,
        },
      });

      return {
        company,
        admin: {
          id: admin.id,
          email: admin.email,
          role: admin.role,
        },
      };
    });
  }

  async createCompanyAdmin(companyId: string, dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Verificăm dacă compania există
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException(`Compania cu ID-ul ${companyId} nu a fost găsită`);
    }

    // Verificăm dacă există deja un utilizator cu același email
    const existingUser = await this.prisma.user.findFirst({
      where: { 
        email: dto.email,
        companyId
      },
    });

    if (existingUser) {
      throw new ConflictException(`Un utilizator cu email-ul ${dto.email} există deja în această companie`);
    }

    // Creăm utilizatorul administrator
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: UserRole.COMPANY_ADMIN,
        isActive: true,
        companyId,
      },
    });
  }
} 