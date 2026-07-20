// prisma/data/cost-trackings.data.ts

export const costTrackingsData = [
  // GitHub
  {
    toolName: 'GitHub',
    month: new Date('2026-05-01'),
    cost: 845.0,
    userCount: 78,
    costPerUser: 10.83,
  },
  {
    toolName: 'GitHub',
    month: new Date('2026-06-01'),
    cost: 870.0,
    userCount: 80,
    costPerUser: 10.88,
  },
  {
    toolName: 'GitHub',
    month: new Date('2026-07-01'),
    cost: 888.0,
    userCount: 81,
    costPerUser: 10.96,
  },

  // Figma
  {
    toolName: 'Figma',
    month: new Date('2026-05-01'),
    cost: 495.0,
    userCount: 21,
    costPerUser: 23.57,
  },
  {
    toolName: 'Figma',
    month: new Date('2026-06-01'),
    cost: 520.0,
    userCount: 22,
    costPerUser: 23.64,
  },
  {
    toolName: 'Figma',
    month: new Date('2026-07-01'),
    cost: 534.0,
    userCount: 23,
    costPerUser: 23.22,
  },

  // Notion
  {
    toolName: 'Notion',
    month: new Date('2026-05-01'),
    cost: 720.0,
    userCount: 130,
    costPerUser: 5.54,
  },
  {
    toolName: 'Notion',
    month: new Date('2026-06-01'),
    cost: 748.0,
    userCount: 138,
    costPerUser: 5.42,
  },
  {
    toolName: 'Notion',
    month: new Date('2026-07-01'),
    cost: 769.0,
    userCount: 145,
    costPerUser: 5.3,
  },

  // Adobe Creative Cloud
  {
    toolName: 'Adobe Creative Cloud',
    month: new Date('2026-05-01'),
    cost: 702.0,
    userCount: 14,
    costPerUser: 50.14,
  },
  {
    toolName: 'Adobe Creative Cloud',
    month: new Date('2026-06-01'),
    cost: 725.0,
    userCount: 15,
    costPerUser: 48.33,
  },
  {
    toolName: 'Adobe Creative Cloud',
    month: new Date('2026-07-01'),
    cost: 743.0,
    userCount: 15,
    costPerUser: 49.53,
  },

  // Office 365
  {
    toolName: 'Office 365',
    month: new Date('2026-05-01'),
    cost: 1180.0,
    userCount: 53,
    costPerUser: 22.26,
  },
  {
    toolName: 'Office 365',
    month: new Date('2026-06-01'),
    cost: 1225.0,
    userCount: 55,
    costPerUser: 22.27,
  },
  {
    toolName: 'Office 365',
    month: new Date('2026-07-01'),
    cost: 1265.0,
    userCount: 56,
    costPerUser: 22.59,
  },
] as const;
