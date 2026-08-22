// src/tools/tools.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';

import { ToolStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateToolDto } from './dto/create-tool.dto';
import { QueryToolsDto } from './dto/query-tools.dto';
import { UpdateToolDto } from './dto/update-tool.dto';

import type {
  AppliedFilters,
  SortField,
  SortOrder,
  ToolCreateResponse,
  ToolDeleteResponse,
  ToolDetailResponse,
  ToolOrderBy,
  ToolsListResponse,
  ToolUpdateResponse,
  ToolWhere,
} from './types/tool.types';

@Injectable()
export class ToolsService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // FIND ALL
  // =========================

  async findAll(query: QueryToolsDto): Promise<ToolsListResponse> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: ToolWhere = {};

    // Recherche texte
    if (query.query?.trim()) {
      const search = query.query.trim();

      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          vendor: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          category: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          ownerDepartment: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    // Département
    if (query.department) {
      where.ownerDepartment = {
        name: query.department,
      };
    }

    // Catégorie
    if (query.category) {
      where.category = {
        name: query.category,
      };
    }

    // Statut
    if (query.status) {
      where.status = query.status;
    }

    // Coût min / max
    if (query.min_cost !== undefined || query.max_cost !== undefined) {
      where.monthlyCost = {};

      if (query.min_cost !== undefined) {
        where.monthlyCost.gte = query.min_cost;
      }

      if (query.max_cost !== undefined) {
        where.monthlyCost.lte = query.max_cost;
      }
    }

    // Tri
    const orderBy = this.buildOrderBy(query.sort_by, query.sort_order);

    // Requêtes exécutées en parallèle
    const [tools, total, filtered] = await Promise.all([
      this.prisma.tool.findMany({
        where,

        include: {
          category: true,
          ownerDepartment: true,
        },

        orderBy,

        skip,
        take: limit,
      }),

      this.prisma.tool.count(),

      this.prisma.tool.count({
        where,
      }),
    ]);

    return {
      data: tools.map((tool) => ({
        id: tool.id,

        name: tool.name,

        description: tool.description,

        vendor: tool.vendor,

        category: tool.category.name,

        monthly_cost: Number(tool.monthlyCost),

        previous_month_cost:
          tool.previousMonthCost !== null
            ? Number(tool.previousMonthCost)
            : null,

        owner_department: tool.ownerDepartment.name,

        status: tool.status,

        website_url: tool.websiteUrl,

        icon_url: tool.iconUrl,

        active_users_count: tool.activeUsersCount,

        created_at: tool.createdAt,

        updated_at: tool.updatedAt,
      })),

      total,

      filtered,

      page,

      limit,

      filters_applied: this.getAppliedFilters(query),
    };
  }

  // =========================
  // FIND ONE
  // =========================

  async findOne(id: string): Promise<ToolDetailResponse> {
    const tool = await this.prisma.tool.findUnique({
      where: {
        id,
      },

      include: {
        category: true,
        ownerDepartment: true,
      },
    });

    if (!tool) {
      throw new NotFoundException({
        error: 'Tool not found',
        message: `Tool with ID ${id} does not exist`,
      });
    }

    return {
      id: tool.id,

      name: tool.name,

      description: tool.description,

      vendor: tool.vendor,

      website_url: tool.websiteUrl,

      icon_url: tool.iconUrl,

      category: tool.category.name,

      monthly_cost: Number(tool.monthlyCost),

      previous_month_cost:
        tool.previousMonthCost !== null ? Number(tool.previousMonthCost) : null,

      owner_department: tool.ownerDepartment.name,

      status: tool.status,

      active_users_count: tool.activeUsersCount,

      created_at: tool.createdAt,

      updated_at: tool.updatedAt,
    };
  }

  // =========================
  // CREATE
  // =========================

  async create(createToolDto: CreateToolDto): Promise<ToolCreateResponse> {
    const tool = await this.prisma.tool.create({
      data: {
        name: createToolDto.name,
        description: createToolDto.description,
        vendor: createToolDto.vendor,
        monthlyCost: createToolDto.monthly_cost,
        websiteUrl: createToolDto.website_url,
        iconUrl: createToolDto.icon_url,
        activeUsersCount: createToolDto.active_users_count ?? 0,

        category: {
          connect: {
            name: createToolDto.category,
          },
        },

        ownerDepartment: {
          connect: {
            name: createToolDto.owner_department,
          },
        },

        status: ToolStatus.ACTIVE,
      },

      include: {
        category: true,
        ownerDepartment: true,
      },
    });

    return {
      id: tool.id,

      name: tool.name,

      description: tool.description,

      vendor: tool.vendor,

      category: tool.category.name,

      monthly_cost: Number(tool.monthlyCost),

      owner_department: tool.ownerDepartment.name,

      status: tool.status,

      website_url: tool.websiteUrl,

      icon_url: tool.iconUrl,

      active_users_count: tool.activeUsersCount,

      created_at: tool.createdAt,
    };
  }

  // =========================
  // UPDATE
  // =========================

  async update(
    id: string,
    updateToolDto: UpdateToolDto,
  ): Promise<ToolUpdateResponse> {
    await this.ensureToolExists(id);

    const tool = await this.prisma.tool.update({
      where: {
        id,
      },

      data: {
        ...(updateToolDto.name !== undefined && {
          name: updateToolDto.name,
        }),

        ...(updateToolDto.description !== undefined && {
          description: updateToolDto.description,
        }),

        ...(updateToolDto.vendor !== undefined && {
          vendor: updateToolDto.vendor,
        }),

        ...(updateToolDto.monthly_cost !== undefined && {
          monthlyCost: updateToolDto.monthly_cost,
        }),

        ...(updateToolDto.website_url !== undefined && {
          websiteUrl: updateToolDto.website_url,
        }),

        ...(updateToolDto.category !== undefined && {
          category: {
            connect: {
              name: updateToolDto.category,
            },
          },
        }),

        ...(updateToolDto.owner_department !== undefined && {
          ownerDepartment: {
            connect: {
              name: updateToolDto.owner_department,
            },
          },
        }),

        ...(updateToolDto.status !== undefined && {
          status: updateToolDto.status,
        }),
      },

      include: {
        category: true,
        ownerDepartment: true,
      },
    });

    return {
      id: tool.id,

      name: tool.name,

      description: tool.description,

      vendor: tool.vendor,

      category: tool.category.name,

      monthly_cost: Number(tool.monthlyCost),

      previous_month_cost:
        tool.previousMonthCost !== null ? Number(tool.previousMonthCost) : null,

      owner_department: tool.ownerDepartment.name,

      status: tool.status,

      website_url: tool.websiteUrl,

      icon_url: tool.iconUrl,

      active_users_count: tool.activeUsersCount,

      created_at: tool.createdAt,

      updated_at: tool.updatedAt,
    };
  }

  // =========================
  // DELETE
  // =========================

  async remove(id: string): Promise<ToolDeleteResponse> {
    await this.ensureToolExists(id);

    await this.prisma.tool.delete({
      where: {
        id,
      },
    });

    return {
      id,
      message: 'Tool deleted successfully',
    };
  }

  // =========================
  // PRIVATE HELPERS
  // =========================

  private async ensureToolExists(id: string): Promise<void> {
    const tool = await this.prisma.tool.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
      },
    });

    if (!tool) {
      throw new NotFoundException({
        error: 'Tool not found',
        message: `Tool with ID ${id} does not exist`,
      });
    }
  }

  private buildOrderBy(
    sortBy: SortField = 'created_at',
    sortOrder: SortOrder = 'desc',
  ): ToolOrderBy {
    const mapping = {
      name: 'name',
      monthly_cost: 'monthlyCost',
      created_at: 'createdAt',
    } as const;

    return {
      [mapping[sortBy]]: sortOrder,
    };
  }

  private getAppliedFilters(query: QueryToolsDto): AppliedFilters {
    const filters: AppliedFilters = {};

    if (query.query?.trim()) {
      filters.query = query.query.trim();
    }

    if (query.department) {
      filters.department = query.department;
    }

    if (query.status) {
      filters.status = query.status;
    }

    if (query.min_cost !== undefined) {
      filters.min_cost = query.min_cost;
    }

    if (query.max_cost !== undefined) {
      filters.max_cost = query.max_cost;
    }

    if (query.category) {
      filters.category = query.category;
    }

    return filters;
  }
}
