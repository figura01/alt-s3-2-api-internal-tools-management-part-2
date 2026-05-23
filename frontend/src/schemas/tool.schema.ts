// tool.schema.ts

import { z } from "zod";

export const toolStatusSchema = z.enum(["active", "unused", "expiring"]);

export const toolSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2),
  description: z.string().min(2),
  vendor: z.string().optional(),
  category: z.string().optional(),
  owner_department: z.string().optional(),
  department: z.string().optional(),
  status: toolStatusSchema.default("active"),
  website_url: z.string().url().optional().or(z.literal("")),
  icon_url: z.string().url().optional().or(z.literal("")),
  monthly_cost: z.coerce.number().optional(),
  previous_month_cost: z.coerce.number().optional(),
  active_users_count: z.coerce.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Tool = z.infer<typeof toolSchema>;

export const createToolSchema = toolSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const updateToolSchema = toolSchema.partial().extend({
  id: z.number(),
});

export type CreateToolInput = z.input<typeof createToolSchema>;

export type CreateToolValues = z.output<typeof createToolSchema>;

export type UpdateToolInput = z.input<typeof updateToolSchema>;

export type UpdateToolValues = z.output<typeof updateToolSchema>;
