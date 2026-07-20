// prisma/data/usage-logs.data.ts

export const usageLogsData = [
  // Laurent (Admin)
  {
    userEmail: 'laurent@test.com',
    toolName: 'GitHub',
    usageDate: new Date('2026-07-01'),
    sessionCount: 12,
    totalMinutes: 510,
  },
  {
    userEmail: 'laurent@test.com',
    toolName: 'Figma',
    usageDate: new Date('2026-07-01'),
    sessionCount: 3,
    totalMinutes: 95,
  },
  {
    userEmail: 'laurent@test.com',
    toolName: 'Office 365',
    usageDate: new Date('2026-07-02'),
    sessionCount: 5,
    totalMinutes: 180,
  },
  {
    userEmail: 'laurent@test.com',
    toolName: 'GitHub',
    usageDate: new Date('2026-07-03'),
    sessionCount: 10,
    totalMinutes: 460,
  },

  // Neal (Engineering Manager)
  {
    userEmail: 'karelle.murazik@gmail.com',
    toolName: 'GitHub',
    usageDate: new Date('2026-07-01'),
    sessionCount: 7,
    totalMinutes: 220,
  },
  {
    userEmail: 'karelle.murazik@gmail.com',
    toolName: 'Figma',
    usageDate: new Date('2026-07-01'),
    sessionCount: 6,
    totalMinutes: 170,
  },
  {
    userEmail: 'karelle.murazik@gmail.com',
    toolName: 'Notion',
    usageDate: new Date('2026-07-02'),
    sessionCount: 8,
    totalMinutes: 210,
  },
  {
    userEmail: 'karelle.murazik@gmail.com',
    toolName: 'Office 365',
    usageDate: new Date('2026-07-03'),
    sessionCount: 4,
    totalMinutes: 110,
  },

  // Rufus (QA Engineer)
  {
    userEmail: 'casper70@yahoo.com',
    toolName: 'GitHub',
    usageDate: new Date('2026-07-01'),
    sessionCount: 11,
    totalMinutes: 390,
  },
  {
    userEmail: 'casper70@yahoo.com',
    toolName: 'GitHub',
    usageDate: new Date('2026-07-02'),
    sessionCount: 9,
    totalMinutes: 340,
  },
  {
    userEmail: 'casper70@yahoo.com',
    toolName: 'Notion',
    usageDate: new Date('2026-07-02'),
    sessionCount: 5,
    totalMinutes: 140,
  },
  {
    userEmail: 'casper70@yahoo.com',
    toolName: 'Office 365',
    usageDate: new Date('2026-07-03'),
    sessionCount: 3,
    totalMinutes: 80,
  },
  {
    userEmail: 'casper70@yahoo.com',
    toolName: 'GitHub',
    usageDate: new Date('2026-07-04'),
    sessionCount: 13,
    totalMinutes: 520,
  },
] as const;
