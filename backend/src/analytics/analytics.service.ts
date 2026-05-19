import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { DepartmentCostsQueryDto } from './dto/department-costs-query.dto';
import { ExpensiveToolsQueryDto } from './dto/expensive-tools-query.dto';
import { LowUsageToolsQueryDto } from './dto/low-usage-tools-query.dto';

import type {
  DepartmentCostItem,
  DepartmentCostsResponse,
  ExpensiveToolsResponse,
  ToolsByCategoryResponse,
  LowUsageToolsResponse,
} from './types/analytics.types';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDepartmentCosts(
    query: DepartmentCostsQueryDto,
  ): Promise<DepartmentCostsResponse> {
    const toolsResult = await this.prisma.tool.findMany({
      where: {
        status: 'active',
      },
    });

    const tools = toolsResult as Array<{
      id: number;
      monthlyCost: unknown;
      ownerDepartment: string;
      activeUsersCount: number;
    }>;

    if (tools.length === 0) {
      return {
        data: [],
        summary: {
          total_company_cost: 0,
          departments_count: 0,
          most_expensive_department: null,
        },
      };
    }

    const totalCompanyCost = tools.reduce(
      (sum, tool) => sum + Number(tool.monthlyCost),
      0,
    );

    const departmentMap = new Map<string, DepartmentCostItem>();

    for (const tool of tools) {
      const department = tool.ownerDepartment;

      const current = departmentMap.get(department);

      if (!current) {
        departmentMap.set(department, {
          department,
          total_cost: Number(tool.monthlyCost),
          tools_count: 1,
          total_users: tool.activeUsersCount,
          average_cost_per_tool: 0,
          cost_percentage: 0,
        });

        continue;
      }

      current.total_cost += Number(tool.monthlyCost);

      current.tools_count += 1;

      current.total_users += tool.activeUsersCount;
    }

    const data = Array.from(departmentMap.values()).map((department) => ({
      ...department,

      total_cost: Number(department.total_cost.toFixed(2)),

      average_cost_per_tool: Number(
        (department.total_cost / department.tools_count).toFixed(2),
      ),

      cost_percentage: Number(
        ((department.total_cost / totalCompanyCost) * 100).toFixed(1),
      ),
    }));

    const sortBy = query.sort_by ?? 'total_cost';

    const order = query.order ?? 'desc';

    data.sort((a, b) => {
      const modifier = order === 'asc' ? 1 : -1;

      if (sortBy === 'department') {
        return a.department.localeCompare(b.department) * modifier;
      }

      return (a[sortBy] - b[sortBy]) * modifier;
    });

    const mostExpensiveDepartment =
      [...data].sort((a, b) => {
        if (b.total_cost === a.total_cost) {
          return a.department.localeCompare(b.department);
        }

        return b.total_cost - a.total_cost;
      })[0]?.department ?? null;

    return {
      data,

      summary: {
        total_company_cost: Number(totalCompanyCost.toFixed(2)),

        departments_count: data.length,

        most_expensive_department: mostExpensiveDepartment,
      },
    };
  }

  async getExpensiveTools(
    query: ExpensiveToolsQueryDto,
  ): Promise<ExpensiveToolsResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const toolsResult = await this.prisma.tool.findMany({
      where: {
        status: 'active',
        ...(query.min_cost !== undefined && {
          monthlyCost: {
            gte: query.min_cost,
          },
        }),
      },
      orderBy: {
        monthlyCost: 'desc',
      },
      take: query.limit ?? 10,
    });

    const tools = toolsResult as Array<{
      id: number;
      name: string;
      monthlyCost: unknown;
      activeUsersCount: number;
      ownerDepartment: string;
      vendor: string | null;
    }>;

    if (tools.length === 0) {
      return {
        data: [],
        analysis: {
          total_tools_analyzed: 0,
          avg_cost_per_user_company: 0,
          potential_savings_identified: 0,
        },
      };
    }

    const totalCompanyCost = tools.reduce(
      (sum, tool) => sum + Number(tool.monthlyCost),
      0,
    );

    const totalCompanyUsers = tools.reduce(
      (sum, tool) => sum + tool.activeUsersCount,
      0,
    );

    const avgCostPerUserCompany =
      totalCompanyUsers === 0 ? 0 : totalCompanyCost / totalCompanyUsers;

    const data = tools.map((tool) => {
      const costPerUser =
        tool.activeUsersCount === 0
          ? Number(tool.monthlyCost)
          : Number(tool.monthlyCost) / tool.activeUsersCount;

      let efficiencyRating: 'excellent' | 'good' | 'average' | 'low';

      if (costPerUser < avgCostPerUserCompany * 0.5) {
        efficiencyRating = 'excellent';
      } else if (costPerUser < avgCostPerUserCompany * 0.8) {
        efficiencyRating = 'good';
      } else if (costPerUser <= avgCostPerUserCompany * 1.2) {
        efficiencyRating = 'average';
      } else {
        efficiencyRating = 'low';
      }

      return {
        id: tool.id,
        name: tool.name,

        monthly_cost: Number(Number(tool.monthlyCost).toFixed(2)),

        active_users_count: tool.activeUsersCount,

        cost_per_user: Number(costPerUser.toFixed(2)),

        department: tool.ownerDepartment,

        vendor: tool.vendor ?? 'Unknown',

        efficiency_rating: efficiencyRating,
      };
    });

    const potentialSavings = data
      .filter((tool) => tool.efficiency_rating === 'low')
      .reduce((sum, tool) => sum + tool.monthly_cost, 0);

    return {
      data,

      analysis: {
        total_tools_analyzed: data.length,

        avg_cost_per_user_company: Number(avgCostPerUserCompany.toFixed(2)),

        potential_savings_identified: Number(potentialSavings.toFixed(2)),
      },
    };
  }

  async getToolsByCategory(): Promise<ToolsByCategoryResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const toolsResult = await this.prisma.tool.findMany({
      where: {
        status: 'active',
      },
      include: {
        category: true,
      },
    });

    const tools = toolsResult as Array<{
      id: number;
      monthlyCost: unknown;
      activeUsersCount: number;
      category: {
        id: number;
        name: string;
      };
    }>;

    if (tools.length === 0) {
      return {
        data: [],
        insights: {
          most_expensive_category: null,
          most_efficient_category: null,
        },
      };
    }

    const totalCompanyCost = tools.reduce(
      (sum, tool) => sum + Number(tool.monthlyCost),
      0,
    );

    const categoryMap = new Map<
      string,
      {
        category_name: string;
        tools_count: number;
        total_cost: number;
        total_users: number;
      }
    >();

    for (const tool of tools) {
      const categoryName = tool.category.name;

      const current = categoryMap.get(categoryName);

      if (!current) {
        categoryMap.set(categoryName, {
          category_name: categoryName,
          tools_count: 1,
          total_cost: Number(tool.monthlyCost),
          total_users: tool.activeUsersCount,
        });

        continue;
      }

      current.tools_count += 1;
      current.total_cost += Number(tool.monthlyCost);
      current.total_users += tool.activeUsersCount;
    }

    const data = Array.from(categoryMap.values()).map((category) => {
      const averageCostPerUser =
        category.total_users === 0
          ? 0
          : category.total_cost / category.total_users;

      const percentageOfBudget =
        totalCompanyCost === 0
          ? 0
          : (category.total_cost / totalCompanyCost) * 100;

      return {
        category_name: category.category_name,
        tools_count: category.tools_count,
        total_cost: Number(category.total_cost.toFixed(2)),
        total_users: category.total_users,
        percentage_of_budget: Number(percentageOfBudget.toFixed(1)),
        average_cost_per_user: Number(averageCostPerUser.toFixed(2)),
      };
    });

    const mostExpensiveCategory =
      [...data].sort((a, b) => {
        if (b.total_cost === a.total_cost) {
          return a.category_name.localeCompare(b.category_name);
        }

        return b.total_cost - a.total_cost;
      })[0]?.category_name ?? null;

    const mostEfficientCategory =
      [...data]
        .filter((category) => category.total_users > 0)
        .sort((a, b) => {
          if (a.average_cost_per_user === b.average_cost_per_user) {
            return a.category_name.localeCompare(b.category_name);
          }

          return a.average_cost_per_user - b.average_cost_per_user;
        })[0]?.category_name ?? null;

    return {
      data,
      insights: {
        most_expensive_category: mostExpensiveCategory,
        most_efficient_category: mostEfficientCategory,
      },
    };
  }

  async getLowUsageTools(
    query: LowUsageToolsQueryDto,
  ): Promise<LowUsageToolsResponse> {
    const maxUsers = query.max_users ?? 5;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const toolsResult = await this.prisma.tool.findMany({
      where: {
        status: 'active',
        activeUsersCount: {
          lte: maxUsers,
        },
      },
      orderBy: {
        monthlyCost: 'desc',
      },
    });

    const tools = toolsResult as Array<{
      id: number;
      name: string;
      monthlyCost: unknown;
      activeUsersCount: number;
      ownerDepartment: string;
      vendor: string | null;
    }>;

    if (tools.length === 0) {
      return {
        data: [],
        savings_analysis: {
          total_underutilized_tools: 0,
          potential_monthly_savings: 0,
          potential_annual_savings: 0,
        },
      };
    }

    const data = tools.map((tool) => {
      const monthlyCost = Number(tool.monthlyCost);

      const costPerUser =
        tool.activeUsersCount === 0
          ? monthlyCost
          : monthlyCost / tool.activeUsersCount;

      let warningLevel: 'low' | 'medium' | 'high';

      if (tool.activeUsersCount === 0) {
        warningLevel = 'high';
      } else if (costPerUser < 20) {
        warningLevel = 'low';
      } else if (costPerUser <= 50) {
        warningLevel = 'medium';
      } else {
        warningLevel = 'high';
      }

      let potentialAction = 'Monitor usage trends';

      if (warningLevel === 'medium') {
        potentialAction = 'Review usage and consider optimization';
      }

      if (warningLevel === 'high') {
        potentialAction = 'Consider canceling or downgrading';
      }

      return {
        id: tool.id,
        name: tool.name,

        monthly_cost: Number(monthlyCost.toFixed(2)),

        active_users_count: tool.activeUsersCount,

        cost_per_user: Number(costPerUser.toFixed(2)),

        department: tool.ownerDepartment,

        vendor: tool.vendor ?? 'Unknown',

        warning_level: warningLevel,

        potential_action: potentialAction,
      };
    });

    const potentialMonthlySavings = data
      .filter(
        (tool) =>
          tool.warning_level === 'high' || tool.warning_level === 'medium',
      )
      .reduce((sum, tool) => sum + tool.monthly_cost, 0);

    return {
      data,

      savings_analysis: {
        total_underutilized_tools: data.length,

        potential_monthly_savings: Number(potentialMonthlySavings.toFixed(2)),

        potential_annual_savings: Number(
          (potentialMonthlySavings * 12).toFixed(2),
        ),
      },
    };
  }
}
