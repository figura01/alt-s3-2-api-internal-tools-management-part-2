// prisma/data/user-tool-accesses.data.ts

export const userToolAccessesData = [
  {
    userEmail: 'laurent@test.com',
    toolName: 'GitHub',
    grantedByEmail: 'laurent@test.com',
    status: 'ACTIVE',
    grantedAt: new Date('2026-01-10T09:00:00.000Z'),
  },
  {
    userEmail: 'laurent@test.com',
    toolName: 'Figma',
    grantedByEmail: 'laurent@test.com',
    status: 'ACTIVE',
    grantedAt: new Date('2026-01-10T09:15:00.000Z'),
  },
  {
    userEmail: 'karelle.murazik@gmail.com',
    toolName: 'GitHub',
    grantedByEmail: 'laurent@test.com',
    status: 'ACTIVE',
    grantedAt: new Date('2026-02-01T10:00:00.000Z'),
  },
  {
    userEmail: 'karelle.murazik@gmail.com',
    toolName: 'Notion',
    grantedByEmail: 'laurent@test.com',
    status: 'ACTIVE',
    grantedAt: new Date('2026-02-01T10:10:00.000Z'),
  },
  {
    userEmail: 'casper70@yahoo.com',
    toolName: 'Office 365',
    grantedByEmail: 'laurent@test.com',
    status: 'ACTIVE',
    grantedAt: new Date('2026-02-05T11:00:00.000Z'),
  },
] as const;
