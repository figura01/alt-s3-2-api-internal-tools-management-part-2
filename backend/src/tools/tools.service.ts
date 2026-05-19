import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { QueryToolsDto } from './dto/query-tools.dto';

import type {
  AppliedFilters,
  SortField,
  SortOrder,
  ToolCreateResponse,
  ToolDetailResponse,
  ToolOrderBy,
  ToolsListResponse,
  ToolWhere,
  ToolWithCategory,
  ToolWithDetails,
} from './types/tool.types';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';

@Injectable()
export class ToolsService {
  [x: string]: any;
  constructor(private readonly prisma: PrismaService) {}

  async create(createToolDto: CreateToolDto): Promise<ToolCreateResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const category = await this.prisma.category.findUnique({
      where: { id: createToolDto.category_id },
    });

    if (!category) {
      throw new NotFoundException({
        error: 'Category not found',
        message: `Category with ID ${createToolDto.category_id} does not exist`,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const existingTool = await this.prisma.tool.findFirst({
      where: { name: createToolDto.name },
    });

    if (existingTool) {
      throw new BadRequestException({
        error: 'Validation failed',
        details: {
          name: 'Tool name already exists',
        },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const toolResult = await this.prisma.tool.create({
      data: {
        name: createToolDto.name,
        description: createToolDto.description,
        vendor: createToolDto.vendor,
        websiteUrl: createToolDto.website_url,
        categoryId: createToolDto.category_id,
        monthlyCost: createToolDto.monthly_cost,
        ownerDepartment: createToolDto.owner_department,
        status: 'active',
        activeUsersCount: 0,
      },

      include: {
        category: true,
      },
    });

    const tool = toolResult as ToolWithCategory;

    return {
      id: tool.id,
      name: tool.name,
      description: tool.description ?? '',
      vendor: tool.vendor ?? '',
      website_url: tool.websiteUrl,
      category: tool.category.name,
      monthly_cost: Number(tool.monthlyCost),
      owner_department: tool.ownerDepartment,
      status: tool.status ?? 'active',
      active_users_count: tool.activeUsersCount,
      created_at: tool.createdAt ?? new Date(),
      updated_at: tool.updatedAt ?? new Date(),
    };
  }

  async update(
    id: number,
    updateToolDto: UpdateToolDto,
  ): Promise<ToolCreateResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const existingTool = await this.prisma.tool.findUnique({
      where: { id },
    });
    if (!existingTool) {
      throw new NotFoundException({
        error: 'Tool not found',
        message: `Tool with ID ${id} does not exist`,
      });
    }

    if (updateToolDto.category_id) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      const category = await this.prisma.category.findUnique({
        where: { id: updateToolDto.category_id },
      });

      if (!category) {
        throw new NotFoundException({
          error: 'Category not found',
          message: `Category with ID ${updateToolDto.category_id} does not exist`,
        });
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const toolResult = await this.prisma.tool.update({
      where: { id },
      data: {
        ...(updateToolDto.name && { name: updateToolDto.name }),
        ...(updateToolDto.description && {
          description: updateToolDto.description,
        }),
        ...(updateToolDto.vendor && { vendor: updateToolDto.vendor }),
        ...(updateToolDto.website_url !== undefined && {
          websiteUrl: updateToolDto.website_url,
        }),
        ...(updateToolDto.category_id && {
          categoryId: updateToolDto.category_id,
        }),
        ...(updateToolDto.monthly_cost !== undefined && {
          monthlyCost: updateToolDto.monthly_cost,
        }),
        ...(updateToolDto.owner_department && {
          ownerDepartment: updateToolDto.owner_department,
        }),
        ...(updateToolDto.status && {
          status: updateToolDto.status,
        }),
      },
      include: {
        category: true,
      },
    });

    const tool = toolResult as ToolWithCategory;

    return {
      id: tool.id,
      name: tool.name,
      description: tool.description ?? '',
      vendor: tool.vendor ?? '',
      website_url: tool.websiteUrl,
      category: tool.category.name,
      monthly_cost: Number(tool.monthlyCost),
      owner_department: tool.ownerDepartment,
      status: tool.status ?? 'active',
      active_users_count: tool.activeUsersCount,
      created_at: tool.createdAt ?? new Date(),
      updated_at: tool.updatedAt ?? new Date(),
    };
  }

  async findAll(query: QueryToolsDto): Promise<ToolsListResponse> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: ToolWhere = {};

    if (query.department) {
      where.ownerDepartment = query.department;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.min_cost !== undefined || query.max_cost !== undefined) {
      where.monthlyCost = {};

      if (query.min_cost !== undefined) {
        where.monthlyCost.gte = query.min_cost;
      }

      if (query.max_cost !== undefined) {
        where.monthlyCost.lte = query.max_cost;
      }
    }

    if (query.category) {
      where.category = {
        name: query.category,
      };
    }

    const orderBy: ToolOrderBy = this.buildOrderBy(
      query.sort_by,
      query.sort_order,
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const toolsResult = await this.prisma.tool.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
      skip,
      take: limit,
    });

    const tools = toolsResult as ToolWithCategory[];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const total: number = await this.prisma.tool.count();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const filtered: number = await this.prisma.tool.count({
      where,
    });

    return {
      data: tools.map((tool) => ({
        id: tool.id,
        name: tool.name,
        description: tool.description ?? '',
        vendor: tool.vendor ?? '',
        category: tool.category.name,
        monthly_cost: Number(tool.monthlyCost),
        owner_department: tool.ownerDepartment,
        status: tool.status ?? 'active',
        website_url: tool.websiteUrl,
        active_users_count: tool.activeUsersCount,
        created_at: tool.createdAt ?? new Date(),
      })),

      total,
      filtered,
      page,
      limit,

      filters_applied: this.getAppliedFilters(query),
    };
  }

  async findOne(id: number): Promise<ToolDetailResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const toolResult = await this.prisma.tool.findUnique({
      where: {
        id,
      },

      include: {
        category: true,
        usage_logs: true,
      },
    });

    const tool = toolResult as ToolWithDetails | null;

    if (!tool) {
      throw new NotFoundException({
        error: 'Tool not found',
        message: `Tool with ID ${id} does not exist`,
      });
    }

    const usageLogs = tool.usage_logs;

    const totalSessions = usageLogs.length;

    const totalMinutes = usageLogs.reduce(
      (sum, log) => sum + (log.usage_minutes ?? 0),
      0,
    );

    const avgSessionMinutes =
      totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

    return {
      id: tool.id,
      name: tool.name,
      description: tool.description ?? '',
      vendor: tool.vendor ?? '',
      website_url: tool.websiteUrl,
      category: tool.category.name,

      monthly_cost: Number(tool.monthlyCost),

      owner_department: tool.ownerDepartment,

      status: tool.status ?? 'active',

      active_users_count: tool.activeUsersCount,

      total_monthly_cost: Number(tool.monthlyCost) * tool.activeUsersCount,

      created_at: tool.createdAt ?? new Date(),

      updated_at: tool.updatedAt ?? new Date(),

      usage_metrics: {
        last_30_days: {
          total_sessions: totalSessions,
          avg_session_minutes: avgSessionMinutes,
        },
      },
    };
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

  async remove(id: number): Promise<{ message: string }> {
    const tool = await this.prisma.tool.findUnique({
      where: { id },
    });

    if (!tool) {
      throw new NotFoundException({
        error: 'Tool not found',
        message: `Tool with ID ${id} does not exist`,
      });
    }

    await this.prisma.tool.delete({
      where: { id },
    });

    return {
      message: `Tool with ID ${id} deleted successfully`,
    };
  }
}
