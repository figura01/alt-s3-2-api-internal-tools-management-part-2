// src/tools/types/tool.types.ts

import type { Prisma, ToolStatus } from '@prisma/client';

// =========================
// SORT
// =========================

export type SortField = 'name' | 'monthly_cost' | 'created_at';

export type SortOrder = 'asc' | 'desc';

// On utilise directement les types Prisma
// au lieu de maintenir notre propre copie.
export type ToolWhere = Prisma.ToolWhereInput;

export type ToolOrderBy = Prisma.ToolOrderByWithRelationInput;

// =========================
// FILTERS
// =========================

export interface AppliedFilters {
  query?: string;
  department?: string;
  status?: ToolStatus;
  min_cost?: number;
  max_cost?: number;
  category?: string;
}

// =========================
// COMMON TOOL RESPONSE
// =========================

export interface ToolListItem {
  id: string;

  name: string;

  description: string | null;

  vendor: string | null;

  category: string;

  monthly_cost: number;

  previous_month_cost: number | null;

  owner_department: string;

  status: ToolStatus;

  website_url: string | null;

  icon_url: string | null;

  active_users_count: number;

  created_at: Date;

  updated_at: Date;
}

// =========================
// LIST RESPONSE
// =========================

export interface ToolsListResponse {
  data: ToolListItem[];

  total: number;

  filtered: number;

  page: number;

  limit: number;

  filters_applied: AppliedFilters;
}

// =========================
// CREATE RESPONSE
// =========================

export interface ToolCreateResponse {
  id: string;

  name: string;

  description: string | null;

  vendor: string | null;

  category: string;

  monthly_cost: number;

  owner_department: string;

  status: ToolStatus;

  website_url: string | null;

  icon_url: string | null;

  active_users_count: number;

  created_at: Date;
}

// =========================
// DETAIL RESPONSE
// =========================

export interface ToolDetailResponse {
  id: string;

  name: string;

  description: string | null;

  vendor: string | null;

  website_url: string | null;

  icon_url: string | null;

  category: string;

  monthly_cost: number;

  previous_month_cost: number | null;

  owner_department: string;

  status: ToolStatus;

  active_users_count: number;

  created_at: Date;

  updated_at: Date;
}

// =========================
// UPDATE RESPONSE
// =========================

export interface ToolUpdateResponse {
  id: string;

  name: string;

  description: string | null;

  vendor: string | null;

  category: string;

  monthly_cost: number;

  previous_month_cost: number | null;

  owner_department: string;

  status: ToolStatus;

  website_url: string | null;

  icon_url: string | null;

  active_users_count: number;

  created_at: Date;

  updated_at: Date;
}

// =========================
// DELETE RESPONSE
// =========================

export interface ToolDeleteResponse {
  id: string;

  message: string;
}
