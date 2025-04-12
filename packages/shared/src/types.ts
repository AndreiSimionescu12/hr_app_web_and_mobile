// Tipuri de bază pentru entitățile principale ale aplicației

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee'
}

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company extends BaseEntity {
  name: string;
  cui: string; // Cod Unic de Înregistrare
  address?: string;
  email?: string;
  phone?: string;
  logo?: string;
}

export interface User extends BaseEntity {
  email: string;
  password?: string; // Exclude din răspunsuri
  role: UserRole;
  companyId: string;
  employeeId?: string; // Legătura la profilul de angajat
  isActive: boolean;
}

export interface Employee extends BaseEntity {
  firstName: string;
  lastName: string;
  cnp?: string;
  address?: string;
  birthDate?: Date;
  hireDate: Date;
  position?: string;
  department?: string;
  companyId: string;
  managerId?: string; // Referință self - managerul direct (tot un employee)
  userId?: string; // Legătura la contul de user (dacă există)
  phones?: PhoneNumber[];
}

export interface PhoneNumber {
  id: string;
  number: string;
  type: 'mobile' | 'work' | 'home' | 'other';
  employeeId: string;
}

export interface Timesheet extends BaseEntity {
  employeeId: string;
  checkIn: Date;
  checkOut?: Date;
  totalHours?: number; // Calculat automat
  companyId: string;
}

export interface LeaveRequest extends BaseEntity {
  employeeId: string;
  startDate: Date;
  endDate: Date;
  type: 'vacation' | 'sick' | 'unpaid' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  approvedById?: string; // ID-ul utilizatorului (manager/admin) care a aprobat
  reason?: string;
  companyId: string;
} 