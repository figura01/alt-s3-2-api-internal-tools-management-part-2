// prisma/data/users.data.ts

export const usersData = [
  {
    name: 'Laurent',
    email: 'laurent@test.com',
    password: 'password123',
    departmentSlug: 'engineering',
    role: 'admin',
    status: 'active',
    jobTitle: 'Full Stack Developer',
    hireDate: '2024-01-15',
  },
  {
    name: 'Neal Balistreri',
    email: 'karelle.murazik@gmail.com',
    password: 'password123',
    departmentSlug: 'engineering',
    role: 'manager',
    status: 'inactive',
    jobTitle: 'Head of Engineering',
    hireDate: '2023-11-03',
  },
  {
    name: 'Rufus Pfannerstill',
    email: 'casper70@yahoo.com',
    password: 'password123',
    departmentSlug: 'engineering',
    role: 'employee',
    status: 'active',
    jobTitle: 'QA Engineer',
    hireDate: '2024-04-08',
  },
] as const;
