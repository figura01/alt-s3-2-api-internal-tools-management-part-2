// prisma/data/access-requests.data.ts

export const accessRequestsData = [
  {
    userEmail: 'karelle.murazik@gmail.com',
    toolName: 'Figma',
    status: 'APPROVED',
    reason: 'Need access to review and validate product design mockups.',
    requestedAt: new Date('2026-06-10T09:00:00.000Z'),
    processedByEmail: 'laurent@test.com',
    processedAt: new Date('2026-06-10T10:30:00.000Z'),
  },
  {
    userEmail: 'casper70@yahoo.com',
    toolName: 'GitHub',
    status: 'APPROVED',
    reason: 'Need repository access to run tests and review pull requests.',
    requestedAt: new Date('2026-06-12T08:45:00.000Z'),
    processedByEmail: 'laurent@test.com',
    processedAt: new Date('2026-06-12T09:15:00.000Z'),
  },
  {
    userEmail: 'casper70@yahoo.com',
    toolName: 'Notion',
    status: 'PENDING',
    reason: 'Need access to consult technical documentation and QA procedures.',
    requestedAt: new Date('2026-06-18T13:20:00.000Z'),
    processedByEmail: null,
    processedAt: null,
  },
  {
    userEmail: 'karelle.murazik@gmail.com',
    toolName: 'Adobe Creative Cloud',
    status: 'REJECTED',
    reason: 'Need temporary access to review exported design assets.',
    requestedAt: new Date('2026-06-20T10:00:00.000Z'),
    processedByEmail: 'laurent@test.com',
    processedAt: new Date('2026-06-20T11:10:00.000Z'),
  },
  {
    userEmail: 'laurent@test.com',
    toolName: 'Office 365',
    status: 'APPROVED',
    reason: 'Administrative access required for workspace management.',
    requestedAt: new Date('2026-06-22T08:00:00.000Z'),
    processedByEmail: 'laurent@test.com',
    processedAt: new Date('2026-06-22T08:05:00.000Z'),
  },
] as const;
