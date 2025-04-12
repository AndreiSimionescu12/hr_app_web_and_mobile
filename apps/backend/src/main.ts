import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurare pentru închiderea corectă a conexiunii Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.$connect();
  
  // Adăugăm validarea automată pentru toate endpoint-urile
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimină proprietățile care nu sunt definite în DTO
    transform: true, // Transformă tipurile de date automat
  }));

  // Activăm CORS pentru a permite comunicarea între frontend și backend
  app.enableCors();

  // Creăm un utilizator super-admin dacă nu există deja unul
  const superAdminExists = await prismaService.user.findFirst({
    where: { role: 'SUPER_ADMIN' },
  });

  if (!superAdminExists) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await prismaService.user.create({
      data: {
        email: 'superadmin@sistem.ro',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });
    
    console.log('Super-admin creat cu succes!');
  }

  await app.listen(3001);
  console.log(`Aplicația rulează pe: ${await app.getUrl()}`);
}
bootstrap();
