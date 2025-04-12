import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Începere seed...');

  // Definim capacitățile (permisiunile) de bază
  const capabilities = [
    { name: 'permissions.read', description: 'Permite vizualizarea permisiunilor' },
    { name: 'permissions.create', description: 'Permite crearea de noi permisiuni' },
    { name: 'permissions.update', description: 'Permite actualizarea permisiunilor existente' },
    { name: 'permissions.delete', description: 'Permite ștergerea permisiunilor' },
    { name: 'permissions.grant', description: 'Permite acordarea permisiunilor către utilizatori' },
    { name: 'permissions.revoke', description: 'Permite revocarea permisiunilor de la utilizatori' },
    { name: 'permissions.admin', description: 'Acces complet la administrarea permisiunilor' },
    { name: 'permissions.audit', description: 'Permite vizualizarea jurnalului de audit pentru permisiuni' },
    
    { name: 'users.read', description: 'Permite vizualizarea utilizatorilor' },
    { name: 'users.create', description: 'Permite crearea de noi utilizatori' },
    { name: 'users.update', description: 'Permite actualizarea utilizatorilor existenți' },
    { name: 'users.delete', description: 'Permite ștergerea utilizatorilor' },
    
    { name: 'companies.read', description: 'Permite vizualizarea companiilor' },
    { name: 'companies.create', description: 'Permite crearea de noi companii' },
    { name: 'companies.update', description: 'Permite actualizarea companiilor existente' },
    { name: 'companies.delete', description: 'Permite ștergerea companiilor' },
    
    { name: 'employees.read', description: 'Permite vizualizarea angajaților' },
    { name: 'employees.create', description: 'Permite crearea de noi angajați' },
    { name: 'employees.update', description: 'Permite actualizarea angajaților existenți' },
    { name: 'employees.delete', description: 'Permite ștergerea angajaților' },
  ];

  try {
    // Creăm capacitățile în baza de date
    console.log('Creare capacități...');
    for (const cap of capabilities) {
      // Folosim create în loc de upsert pentru că nu avem încă date
      await prisma.capability.create({
        data: cap,
      });
    }

    // Obținem toate capacitățile create
    const allCapabilities = await prisma.capability.findMany();
    console.log(`Au fost create ${allCapabilities.length} capacități`);

    // Creăm asocierile între roluri și capacități (permisiuni implicite bazate pe rol)
    console.log('Creare asocieri rol-capacitate...');
    
    // Capacități pentru SUPER_ADMIN - toate capacitățile
    for (const cap of allCapabilities) {
      await prisma.roleCapability.create({
        data: {
          role: 'SUPER_ADMIN',
          capabilityId: cap.id,
        },
      });
    }
    
    // Capacități pentru COMPANY_ADMIN
    const companyAdminCapabilities = [
      'users.read', 'users.create', 'users.update',
      'employees.read', 'employees.create', 'employees.update', 'employees.delete',
      'companies.read', 'companies.update',
    ];
    
    for (const capName of companyAdminCapabilities) {
      const cap = allCapabilities.find(c => c.name === capName);
      if (cap) {
        await prisma.roleCapability.create({
          data: {
            role: 'COMPANY_ADMIN',
            capabilityId: cap.id,
          },
        });
      }
    }
    
    // Capacități pentru MANAGER
    const managerCapabilities = [
      'employees.read', 'employees.create', 'employees.update',
    ];
    
    for (const capName of managerCapabilities) {
      const cap = allCapabilities.find(c => c.name === capName);
      if (cap) {
        await prisma.roleCapability.create({
          data: {
            role: 'MANAGER',
            capabilityId: cap.id,
          },
        });
      }
    }
    
    // Creăm un grup de permisiuni pentru exemplu
    console.log('Creare grup de permisiuni...');
    const adminGroup = await prisma.permissionGroup.create({
      data: {
        name: 'Administratori',
        description: 'Grup pentru administratorii sistemului',
      },
    });
    
    // Adăugăm câteva capacități la grupul creat
    const adminGroupCapabilities = [
      'permissions.read', 'permissions.create', 'permissions.update',
      'users.read', 'users.create', 'users.update',
    ];
    
    for (const capName of adminGroupCapabilities) {
      const cap = allCapabilities.find(c => c.name === capName);
      if (cap) {
        await prisma.capabilityGroup.create({
          data: {
            permissionGroupId: adminGroup.id,
            capabilityId: cap.id,
          },
        });
      }
    }
    
    console.log('Seed completat cu succes.');
  } catch (error) {
    console.error('Eroare la executarea seed-ului:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 