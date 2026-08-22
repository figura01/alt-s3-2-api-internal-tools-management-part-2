export const departments = [
  'Engineering',
  'Sales',
  'Marketing',
  'HR',
  'Finance',
  'Operations',
  'Design',
] as const;

export type Department = (typeof departments)[number];

export const toolStatuses = ['ACTIVE', 'DEPRECATED', 'TRIAL'] as const;

export type ToolStatus = (typeof toolStatuses)[number];
