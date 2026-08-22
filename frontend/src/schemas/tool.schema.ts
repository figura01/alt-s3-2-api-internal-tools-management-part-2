import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                                   STATUS                                   */
/* -------------------------------------------------------------------------- */

export const toolStatusSchema = z.enum([
  "ACTIVE",
  "INACTIVE",
  "EXPIRING",
  "UNUSED",
]);

/* -------------------------------------------------------------------------- */
/*                                    TOOL                                    */
/* -------------------------------------------------------------------------- */

export const toolSchema = z.object({
  id: z.string(),

  name: z.string().trim().default("Untitled tool"),

  description: z.string().trim().nullable(),

  vendor: z.string().trim().nullable(),

  category: z.string().trim().default("Uncategorized"),

  owner_department: z.string().trim().default("Unknown"),

  // Alias frontend utilisé notamment par l'analytics
  department: z.string().trim().default("Unknown"),

  status: toolStatusSchema.default("ACTIVE"),

  website_url: z.string().trim().nullable(),

  icon_url: z.string().trim().nullable(),

  monthly_cost: z.coerce.number().min(0).default(0),

  previous_month_cost: z.coerce.number().min(0).nullable(),

  active_users_count: z.coerce.number().int().min(0).default(0),

  created_at: z.string().trim().default(""),

  updated_at: z.string().trim().default(""),

  // Alias frontend
  last_update: z.string().trim().default(""),
});

/* -------------------------------------------------------------------------- */
/*                                   CREATE                                   */
/* -------------------------------------------------------------------------- */

export const createToolSchema = toolSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    last_update: true,
    department: true,
  })
  .extend({
    name: z.string().trim().min(2, "Name must contain at least 2 characters"),

    description: z.string().trim().min(2, "Description is required"),

    vendor: z.string().trim().min(1, "Vendor is required"),

    category: z.string().trim().min(1, "Category is required"),

    owner_department: z.string().trim().min(1, "Owner department is required"),

    monthly_cost: z.coerce.number().min(0, "Monthly cost cannot be negative"),

    website_url: z.string().trim().optional(),

    icon_url: z.string().trim().optional(),
  });

/* -------------------------------------------------------------------------- */
/*                                   UPDATE                                   */
/* -------------------------------------------------------------------------- */

export const updateToolSchema = createToolSchema.partial().extend({
  id: z.string().min(1, "Tool ID is required"),
});

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

export type CreateToolInput = z.input<typeof createToolSchema>;

export type CreateToolValues = z.output<typeof createToolSchema>;

export type UpdateToolInput = z.input<typeof updateToolSchema>;

export type UpdateToolValues = z.output<typeof updateToolSchema>;
