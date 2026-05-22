// src/schemas/tool.schema.ts

import { z } from "zod";

export const toolStatusSchema = z.enum(["active", "unused", "expiring"]);

/* -------------------------------------------------------------------------- */
/*                                   CREATE                                   */
/* -------------------------------------------------------------------------- */

export const toolFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name is too long"),

  description: z
    .string()
    .min(2, "Description is required")
    .max(500, "Description is too long"),

  vendor: z.string().max(100).optional(),

  category: z.string().max(100).optional(),

  owner_department: z.string().max(100).optional(),

  department: z.string().max(100).optional(),

  status: toolStatusSchema.default("active"),

  website_url: z
    .union([z.string().url("Invalid website URL"), z.literal("")])
    .optional(),

  icon_url: z
    .union([z.string().url("Invalid icon URL"), z.literal("")])
    .optional(),

  monthly_cost: z.coerce
    .number("Monthly cost must be a number")
    .min(0, "Monthly cost cannot be negative")
    .optional(),

  previous_month_cost: z.coerce
    .number("Previous month cost must be a number")
    .min(0, "Previous month cost cannot be negative")
    .optional(),

  active_users_count: z.coerce
    .number("Active users count must be a number")
    .int("Must be an integer")
    .min(0, "Cannot be negative")
    .optional(),
});

export type ToolFormInput = z.input<typeof toolFormSchema>;

export type ToolFormValues = z.output<typeof toolFormSchema>;

/* -------------------------------------------------------------------------- */
/*                                    UPDATE                                  */
/* -------------------------------------------------------------------------- */

export const updateToolFormSchema = toolFormSchema.partial().extend({
  status: toolStatusSchema.optional(),
});

export type UpdateToolFormInput = z.input<typeof updateToolFormSchema>;

export type UpdateToolFormValues = z.output<typeof updateToolFormSchema>;

/* -------------------------------------------------------------------------- */
/*                                   SHARED                                   */
/* -------------------------------------------------------------------------- */

export type ToolStatus = z.infer<typeof toolStatusSchema>;
