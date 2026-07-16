// prisma/data/departments.data.ts

export const departmentsData = [
  {
    name: 'Engineering',
    slug: 'engineering',
    description: 'Software engineering, infrastructure and technical teams.',
  },
  {
    name: 'Design',
    slug: 'design',
    description: 'Product design, UX, UI and creative teams.',
  },
  {
    name: 'Marketing',
    slug: 'marketing',
    description: 'Marketing, acquisition and brand management teams.',
  },
  {
    name: 'Operations',
    slug: 'operations',
    description: 'Business operations, processes and project management teams.',
  },
  {
    name: 'Communication',
    slug: 'communication',
    description: 'Internal and external communication teams.',
  },
] as const;
