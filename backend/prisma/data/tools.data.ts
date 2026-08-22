// prisma/data/tools.data.ts

export const toolsData = [
  {
    name: 'Figma',
    description: 'Collaborative design and prototyping tool',
    vendor: 'Figma Inc',

    categorySlug: 'design',
    ownerDepartmentSlug: 'engineering',

    monthlyCost: 534,
    previousMonthCost: 0,
    activeUsersCount: 0,

    status: 'ACTIVE',

    websiteUrl: 'https://figma.com',
    iconUrl: 'https://static.figma.com/app/icon/1/favicon.png',
  },
  {
    name: 'GitHub',
    description: 'Version control and code collaboration platform',
    vendor: 'Microsoft',

    categorySlug: 'development',
    ownerDepartmentSlug: 'engineering',

    monthlyCost: 888,
    previousMonthCost: 830,
    activeUsersCount: 81,

    status: 'UNUSED',

    websiteUrl: 'https://github.com',
    iconUrl:
      'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
  },
  {
    name: 'Notion',
    description: 'All-in-one workspace for notes, docs, and project management',
    vendor: 'Notion Labs',

    categorySlug: 'productivity',
    ownerDepartmentSlug: 'marketing',

    monthlyCost: 769,
    previousMonthCost: 861,
    activeUsersCount: 145,

    status: 'UNUSED',

    websiteUrl: 'https://notion.com',
    iconUrl: 'https://www.notion.so/images/favicon.ico',
  },
  {
    name: 'Adobe Creative Cloud',
    description: 'Creative suite for design and video editing',
    vendor: 'Adobe',

    categorySlug: 'design',
    ownerDepartmentSlug: 'operations',

    monthlyCost: 743,
    previousMonthCost: 797,
    activeUsersCount: 15,

    status: 'EXPIRING',

    websiteUrl: 'https://adobecreativecloud.com',
    iconUrl: 'https://www.adobe.com/content/dam/cc/icons/creative-cloud.svg',
  },
  {
    name: 'Office 365',
    description: 'Productivity suite with Office apps and cloud services',
    vendor: 'Microsoft',

    categorySlug: 'productivity',
    ownerDepartmentSlug: 'marketing',

    monthlyCost: 1265,
    previousMonthCost: 1249,
    activeUsersCount: 56,

    status: 'ACTIVE',

    websiteUrl: 'https://office365.com',
    iconUrl:
      'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4OsXp',
  },
] as const;
