# Sistem HR Management

Aplicație web și mobilă pentru managementul angajaților, pontaj și concedii, folosind o arhitectură multi-tenant.

## Tehnologii

- **Backend**: NestJS, Prisma ORM, PostgreSQL
- **Frontend**: Next.js, React, Tailwind CSS
- **Autentificare**: JWT (JSON Web Tokens)

## Arhitectură

Aplicația este construită folosind o arhitectură modulară și multi-tenant:

- **Multi-tenant**: O singură instanță a aplicației deservește mai multe companii
- **Backend modular**: Funcționalitățile sunt împărțite în module independente
- **Frontend responsive**: Interfață adaptabilă pentru desktop și mobil

## Funcționalități principale

- Gestionare companii (multi-tenant)
- Autentificare și autorizare bazate pe roluri (RBAC)
- Gestionare angajați și structură organizațională
- Pontaj și prezență
- Management cereri de concediu

## Structura proiectului

```
├── apps/
│   ├── backend/         # API NestJS
│   └── frontend/        # Aplicația Next.js (React)
├── packages/            # Pachete comune (shared code)
└── turbo.json           # Configurare Turborepo
```

## Rulare în dezvoltare

```bash
# Instalare dependențe
npm install

# Rulare backend
npm run dev:backend

# Rulare frontend
npm run dev:frontend
``` 