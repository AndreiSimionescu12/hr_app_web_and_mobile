import { PrismaClient, UserRole } from '../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Șterge toate datele existente (util în dezvoltare)
  await prisma.leaveRequest.deleteMany();
  await prisma.timesheet.deleteMany();
  await prisma.phoneNumber.deleteMany();
  await prisma.user.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.company.deleteMany();

  // Crează o companie demo
  const company = await prisma.company.create({
    data: {
      name: 'Demo Company SRL',
      cui: 'RO12345678',
      address: 'Strada Demo, nr. 123, București',
      email: 'contact@democompany.ro',
      phone: '0721000000',
    },
  });

  console.log('Companie creată:', company);

  // Crează un utilizator super admin (fără companie asociată)
  const superAdminPassword = await bcrypt.hash('admin123', 10);
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@sistem.ro',
      password: superAdminPassword,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log('Super Admin creat:', superAdmin);

  // Crează un angajat pentru compania demo
  const employee = await prisma.employee.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      hireDate: new Date(),
      position: 'Manager',
      department: 'IT',
      companyId: company.id,
    },
  });

  console.log('Angajat creat:', employee);

  // Crează un utilizator admin pentru compania demo
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@democompany.ro',
      password: adminPassword,
      role: UserRole.COMPANY_ADMIN,
      isActive: true,
      companyId: company.id,
    },
  });

  console.log('Admin companie creat:', adminUser);

  // Crează un utilizator pentru angajat
  const employeePassword = await bcrypt.hash('employee123', 10);
  const employeeUser = await prisma.user.create({
    data: {
      email: 'employee@democompany.ro',
      password: employeePassword,
      role: UserRole.EMPLOYEE,
      isActive: true,
      companyId: company.id,
      employeeId: employee.id,
    },
  });

  console.log('Utilizator angajat creat:', employeeUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 