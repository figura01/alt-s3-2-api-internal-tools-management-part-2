// src/types/user-tool.ts

export type UsageFrequency = "daily" | "weekly" | "monthly" | "rarely";

export type ProficiencyLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

export type UserTool = {
  user_id: string;
  tool_id: string;
  usage_frequency: UsageFrequency;
  last_used: string;
  proficiency_level: ProficiencyLevel;
};
