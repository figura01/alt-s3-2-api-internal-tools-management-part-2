// prisma/data/users.data.ts
import { UserRole, UserStatus } from '@prisma/client';

export const usersData = [
  {
    name: 'Laurent Vuillaume',
    firstName: 'Laurent',
    lastName: 'Vuillaume',
    email: 'laurent@test.com',
    password: 'password123',
    departmentSlug: 'engineering',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    jobTitle: 'Full Stack Developer',
    hireDate: '2024-01-15',
  },
  {
    name: 'Neal Balistreri',
    firstName: 'Neal',
    lastName: 'Balistreri',
    email: 'karelle.murazik@gmail.com',
    password: 'password123',
    departmentSlug: 'engineering',
    role: UserRole.MANAGER,
    status: UserStatus.INACTIVE,
    jobTitle: 'Head of Engineering',
    hireDate: '2023-11-03',
  },
  {
    name: 'Rufus Pfannerstill',
    firstName: 'Rufus',
    lastName: 'Pfannerstill',
    email: 'casper70@yahoo.com',
    password: 'password123',
    departmentSlug: 'engineering',
    role: UserRole.EMPLOYEE,
    status: UserStatus.ACTIVE,
    jobTitle: 'QA Engineer',
    hireDate: '2024-04-08',
  },
] as const;
