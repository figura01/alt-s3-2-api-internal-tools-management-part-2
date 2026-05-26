import { z } from "zod";

export const toolStatusSchema = z.enum(["active", "unused", "expiring"]);

export const toolSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().trim().default("Untitled tool"),
  description: z.string().trim().default(""),
  vendor: z.string().trim().default(""),
  category: z.string().trim().default("Uncategorized"),
  owner_department: z.string().trim().default("Unknown"),
  department: z.string().trim().default("Unknown"),
  status: toolStatusSchema.default("active"),
  website_url: z.string().trim().default(""),
  icon_url: z.string().trim().default(""),
  monthly_cost: z.coerce.number().min(0).default(0),
  previous_month_cost: z.coerce.number().min(0).default(0),
  active_users_count: z.coerce.number().int().min(0).default(0),
  created_at: z.string().trim().default(""),
  updated_at: z.string().trim().default(""),
  last_update: z.string().trim().default(""),
});

export const createToolSchema = toolSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    last_update: true,
  })
  .extend({
    name: z.string().trim().min(2, "Name must contain at least 2 characters"),
    description: z.string().trim().min(2, "Description is required"),
    category: z.string().trim().min(1, "Category is required"),
    owner_department: z.string().trim().min(1, "Owner department is required"),
  });

export const updateToolSchema = createToolSchema.partial().extend({
  id: z.coerce.number().int().positive(),
});

export type CreateToolInput = z.input<typeof createToolSchema>;
export type CreateToolValues = z.output<typeof createToolSchema>;

export type UpdateToolInput = z.input<typeof updateToolSchema>;
export type UpdateToolValues = z.output<typeof updateToolSchema>;
