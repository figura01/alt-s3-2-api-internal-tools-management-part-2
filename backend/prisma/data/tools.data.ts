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
  {
    name: 'Slack',
    description: 'Team messaging and collaboration platform',
    vendor: 'Salesforce',

    categorySlug: 'productivity',
    ownerDepartmentSlug: 'communication',

    monthlyCost: 980,
    previousMonthCost: 920,
    activeUsersCount: 120,

    status: 'ACTIVE',

    websiteUrl: 'https://slack.com',
    iconUrl: null,
  },
  {
    name: 'Jira',
    description: 'Issue tracking and agile project management platform',
    vendor: 'Atlassian',

    categorySlug: 'project-management',
    ownerDepartmentSlug: 'engineering',

    monthlyCost: 1120,
    previousMonthCost: 1080,
    activeUsersCount: 92,

    status: 'ACTIVE',

    websiteUrl: 'https://www.atlassian.com/software/jira',
    iconUrl: null,
  },
  {
    name: 'Confluence',
    description: 'Team documentation and knowledge management platform',
    vendor: 'Atlassian',

    categorySlug: 'productivity',
    ownerDepartmentSlug: 'engineering',

    monthlyCost: 680,
    previousMonthCost: 650,
    activeUsersCount: 105,

    status: 'ACTIVE',

    websiteUrl: 'https://www.atlassian.com/software/confluence',
    iconUrl: null,
  },
  {
    name: 'Linear',
    description: 'Issue tracking and product development platform',
    vendor: 'Linear',

    categorySlug: 'project-management',
    ownerDepartmentSlug: 'engineering',

    monthlyCost: 420,
    previousMonthCost: 390,
    activeUsersCount: 42,

    status: 'ACTIVE',

    websiteUrl: 'https://linear.app',
    iconUrl: null,
  },
  {
    name: 'GitLab',
    description: 'DevOps and source code management platform',
    vendor: 'GitLab',

    categorySlug: 'development',
    ownerDepartmentSlug: 'engineering',

    monthlyCost: 760,
    previousMonthCost: 720,
    activeUsersCount: 65,

    status: 'ACTIVE',

    websiteUrl: 'https://gitlab.com',
    iconUrl: null,
  },
  {
    name: 'Postman',
    description: 'API development and testing platform',
    vendor: 'Postman',

    categorySlug: 'development',
    ownerDepartmentSlug: 'engineering',

    monthlyCost: 310,
    previousMonthCost: 295,
    activeUsersCount: 38,

    status: 'ACTIVE',

    websiteUrl: 'https://www.postman.com',
    iconUrl: null,
  },
  {
    name: 'Datadog',
    description: 'Cloud monitoring and observability platform',
    vendor: 'Datadog',

    categorySlug: 'analytics',
    ownerDepartmentSlug: 'engineering',

    monthlyCost: 2450,
    previousMonthCost: 2280,
    activeUsersCount: 28,

    status: 'ACTIVE',

    websiteUrl: 'https://www.datadoghq.com',
    iconUrl: null,
  },
  {
    name: 'Sentry',
    description: 'Application monitoring and error tracking platform',
    vendor: 'Sentry',

    categorySlug: 'development',
    ownerDepartmentSlug: 'engineering',

    monthlyCost: 590,
    previousMonthCost: 560,
    activeUsersCount: 44,

    status: 'ACTIVE',

    websiteUrl: 'https://sentry.io',
    iconUrl: null,
  },
  {
    name: 'Vercel',
    description: 'Cloud platform for frontend applications',
    vendor: 'Vercel',

    categorySlug: 'development',
    ownerDepartmentSlug: 'engineering',

    monthlyCost: 840,
    previousMonthCost: 790,
    activeUsersCount: 32,

    status: 'ACTIVE',

    websiteUrl: 'https://vercel.com',
    iconUrl: null,
  },
  {
    name: 'Google Workspace',
    description: 'Cloud productivity and collaboration suite',
    vendor: 'Google',

    categorySlug: 'productivity',
    ownerDepartmentSlug: 'operations',

    monthlyCost: 1850,
    previousMonthCost: 1790,
    activeUsersCount: 148,

    status: 'ACTIVE',

    websiteUrl: 'https://workspace.google.com',
    iconUrl: null,
  },
  {
    name: 'Zoom',
    description: 'Video conferencing and communication platform',
    vendor: 'Zoom',

    categorySlug: 'productivity',
    ownerDepartmentSlug: 'communication',

    monthlyCost: 920,
    previousMonthCost: 940,
    activeUsersCount: 97,

    status: 'ACTIVE',

    websiteUrl: 'https://zoom.us',
    iconUrl: null,
  },
  {
    name: 'Miro',
    description: 'Collaborative online whiteboard platform',
    vendor: 'Miro',

    categorySlug: 'design',
    ownerDepartmentSlug: 'design',

    monthlyCost: 470,
    previousMonthCost: 510,
    activeUsersCount: 52,

    status: 'ACTIVE',

    websiteUrl: 'https://miro.com',
    iconUrl: null,
  },
  {
    name: 'Canva',
    description: 'Online visual design and content creation platform',
    vendor: 'Canva',

    categorySlug: 'design',
    ownerDepartmentSlug: 'marketing',

    monthlyCost: 390,
    previousMonthCost: 410,
    activeUsersCount: 35,

    status: 'ACTIVE',

    websiteUrl: 'https://www.canva.com',
    iconUrl: null,
  },
  {
    name: 'HubSpot',
    description: 'CRM and marketing automation platform',
    vendor: 'HubSpot',

    categorySlug: 'sales-marketing',
    ownerDepartmentSlug: 'marketing',

    monthlyCost: 2750,
    previousMonthCost: 2600,
    activeUsersCount: 46,

    status: 'ACTIVE',

    websiteUrl: 'https://www.hubspot.com',
    iconUrl: null,
  },
  {
    name: 'Salesforce',
    description: 'Customer relationship management platform',
    vendor: 'Salesforce',

    categorySlug: 'sales-marketing',
    ownerDepartmentSlug: 'marketing',

    monthlyCost: 3200,
    previousMonthCost: 3050,
    activeUsersCount: 58,

    status: 'ACTIVE',

    websiteUrl: 'https://www.salesforce.com',
    iconUrl: null,
  },
  {
    name: 'Mailchimp',
    description: 'Email marketing and automation platform',
    vendor: 'Intuit',

    categorySlug: 'sales-marketing',
    ownerDepartmentSlug: 'marketing',

    monthlyCost: 460,
    previousMonthCost: 520,
    activeUsersCount: 18,

    status: 'EXPIRING',

    websiteUrl: 'https://mailchimp.com',
    iconUrl: null,
  },
  {
    name: 'Zendesk',
    description: 'Customer support and service platform',
    vendor: 'Zendesk',

    categorySlug: 'tools',
    ownerDepartmentSlug: 'operations',

    monthlyCost: 1340,
    previousMonthCost: 1290,
    activeUsersCount: 63,

    status: 'ACTIVE',

    websiteUrl: 'https://www.zendesk.com',
    iconUrl: null,
  },
  {
    name: 'Intercom',
    description: 'Customer messaging and support platform',
    vendor: 'Intercom',

    categorySlug: 'tools',
    ownerDepartmentSlug: 'communication',

    monthlyCost: 1180,
    previousMonthCost: 1100,
    activeUsersCount: 41,

    status: 'ACTIVE',

    websiteUrl: 'https://www.intercom.com',
    iconUrl: null,
  },
  {
    name: '1Password',
    description: 'Business password and credential management platform',
    vendor: '1Password',

    categorySlug: 'security',
    ownerDepartmentSlug: 'engineering',

    monthlyCost: 650,
    previousMonthCost: 620,
    activeUsersCount: 132,

    status: 'ACTIVE',

    websiteUrl: 'https://1password.com',
    iconUrl: null,
  },
  {
    name: 'Okta',
    description: 'Identity and access management platform',
    vendor: 'Okta',

    categorySlug: 'security',
    ownerDepartmentSlug: 'operations',

    monthlyCost: 1680,
    previousMonthCost: 1600,
    activeUsersCount: 150,

    status: 'ACTIVE',

    websiteUrl: 'https://www.okta.com',
    iconUrl: null,
  },
  {
    name: 'BambooHR',
    description: 'Human resources management platform',
    vendor: 'BambooHR',

    categorySlug: 'hr',
    ownerDepartmentSlug: 'operations',

    monthlyCost: 890,
    previousMonthCost: 850,
    activeUsersCount: 12,

    status: 'ACTIVE',

    websiteUrl: 'https://www.bamboohr.com',
    iconUrl: null,
  },
  {
    name: 'Personio',
    description: 'HR management and recruiting platform',
    vendor: 'Personio',

    categorySlug: 'hr',
    ownerDepartmentSlug: 'operations',

    monthlyCost: 1250,
    previousMonthCost: 1190,
    activeUsersCount: 16,

    status: 'EXPIRING',

    websiteUrl: 'https://www.personio.com',
    iconUrl: null,
  },
  {
    name: 'Asana',
    description: 'Work and project management platform',
    vendor: 'Asana',

    categorySlug: 'project-management',
    ownerDepartmentSlug: 'operations',

    monthlyCost: 720,
    previousMonthCost: 750,
    activeUsersCount: 74,

    status: 'UNUSED',

    websiteUrl: 'https://asana.com',
    iconUrl: null,
  },
  {
    name: 'Looker Studio',
    description: 'Business intelligence and reporting platform',
    vendor: 'Google',

    categorySlug: 'analytics',
    ownerDepartmentSlug: 'marketing',

    monthlyCost: 280,
    previousMonthCost: 280,
    activeUsersCount: 24,

    status: 'UNUSED',

    websiteUrl: 'https://lookerstudio.google.com',
    iconUrl: null,
  },
  {
    name: 'ChatGPT',
    description: 'AI assistant for productivity and knowledge work',
    vendor: 'OpenAI',

    categorySlug: 'tools',
    ownerDepartmentSlug: 'communication',

    monthlyCost: 1450,
    previousMonthCost: 1280,
    activeUsersCount: 72,

    status: 'ACTIVE',

    websiteUrl: 'https://chatgpt.com',
    iconUrl: null,
  },
] as const;
