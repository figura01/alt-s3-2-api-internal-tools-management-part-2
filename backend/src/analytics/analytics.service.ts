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
  VendorSummaryResponse,
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

      total_cost: this.roundCurrency(Number(department.total_cost)),

      average_cost_per_tool: this.roundCurrency(
        Number(department.total_cost / department.tools_count),
      ),

      cost_percentage: this.roundCurrency(
        Number((department.total_cost / totalCompanyCost) * 100),
        1,
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
        total_company_cost: this.roundCurrency(Number(totalCompanyCost)),

        departments_count: data.length,

        most_expensive_department: mostExpensiveDepartment,
      },
    };
  }

  async getExpensiveTools(
    query: ExpensiveToolsQueryDto,
  ): Promise<ExpensiveToolsResponse> {
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
      const monthlyCost = Number(tool.monthlyCost);
      const costPerUser = this.calculateCostPerUser(
        monthlyCost,
        tool.activeUsersCount,
      );

      const efficiencyRating = this.getEfficiencyRating(
        costPerUser,
        avgCostPerUserCompany,
      );

      return {
        id: tool.id,
        name: tool.name,
        monthly_cost: this.roundCurrency(Number(tool.monthlyCost)),
        active_users_count: tool.activeUsersCount,
        cost_per_user: this.roundCurrency(Number(costPerUser)),
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
        avg_cost_per_user_company: this.roundCurrency(avgCostPerUserCompany),
        potential_savings_identified: this.roundCurrency(potentialSavings),
      },
    };
  }

  async getToolsByCategory(): Promise<ToolsByCategoryResponse> {
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
      const averageCostPerUser = this.calculateCostPerUser(
        category.total_cost,
        category.total_users,
      );

      const percentageOfBudget =
        totalCompanyCost === 0
          ? 0
          : (category.total_cost / totalCompanyCost) * 100;

      return {
        category_name: category.category_name,
        tools_count: category.tools_count,
        total_cost: this.roundCurrency(Number(category.total_cost)),
        total_users: category.total_users,
        percentage_of_budget: this.roundCurrency(Number(percentageOfBudget), 1),
        average_cost_per_user: this.roundCurrency(Number(averageCostPerUser)),
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

        monthly_cost: this.roundCurrency(Number(monthlyCost)),
        active_users_count: tool.activeUsersCount,

        cost_per_user: this.roundCurrency(Number(costPerUser)),

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

        potential_monthly_savings: this.roundCurrency(
          Number(potentialMonthlySavings),
        ),

        potential_annual_savings: this.roundCurrency(
          Number((potentialMonthlySavings * 12).toFixed(2)),
        ),
      },
    };
  }

  async getVendorSummary(): Promise<VendorSummaryResponse> {
    const toolsResult = await this.prisma.tool.findMany({
      where: {
        status: 'active',
      },
    });

    const tools = toolsResult as Array<{
      id: number;
      vendor: string | null;
      monthlyCost: unknown;
      activeUsersCount: number;
      ownerDepartment: string;
    }>;

    if (tools.length === 0) {
      return {
        data: [],
        vendor_insights: {
          most_expensive_vendor: null,
          most_efficient_vendor: null,
          single_tool_vendors: 0,
        },
      };
    }

    const vendorMap = new Map<
      string,
      {
        vendor: string;
        tools_count: number;
        total_monthly_cost: number;
        total_users: number;
        departments: Set<string>;
      }
    >();

    for (const tool of tools) {
      const vendor = tool.vendor ?? 'Unknown';

      const current = vendorMap.get(vendor);

      if (!current) {
        vendorMap.set(vendor, {
          vendor,
          tools_count: 1,

          total_monthly_cost: Number(tool.monthlyCost),

          total_users: tool.activeUsersCount,

          departments: new Set([tool.ownerDepartment]),
        });

        continue;
      }

      current.tools_count += 1;

      current.total_monthly_cost += Number(tool.monthlyCost);

      current.total_users += tool.activeUsersCount;

      current.departments.add(tool.ownerDepartment);
    }

    const data = Array.from(vendorMap.values()).map((vendor) => {
      const averageCostPerUser = this.calculateCostPerUser(
        vendor.total_monthly_cost,
        vendor.total_users,
      );

      const vendorEfficiency = this.getVendorEfficiency(
        averageCostPerUser,
        vendor.total_users,
      );

      return {
        vendor: vendor.vendor,

        tools_count: vendor.tools_count,

        total_monthly_cost: this.roundCurrency(
          Number(vendor.total_monthly_cost),
        ),

        total_users: vendor.total_users,

        departments: Array.from(vendor.departments)
          .sort((a, b) => a.localeCompare(b))
          .join(','),

        average_cost_per_user: this.roundCurrency(Number(averageCostPerUser)),

        vendor_efficiency: vendorEfficiency,
      };
    });

    const mostExpensiveVendor =
      [...data].sort((a, b) => {
        if (b.total_monthly_cost === a.total_monthly_cost) {
          return a.vendor.localeCompare(b.vendor);
        }

        return b.total_monthly_cost - a.total_monthly_cost;
      })[0]?.vendor ?? null;

    const mostEfficientVendor =
      [...data]
        .filter((vendor) => vendor.total_users > 0)
        .sort((a, b) => {
          if (a.average_cost_per_user === b.average_cost_per_user) {
            return a.vendor.localeCompare(b.vendor);
          }

          return a.average_cost_per_user - b.average_cost_per_user;
        })[0]?.vendor ?? null;

    const singleToolVendors = data.filter(
      (vendor) => vendor.tools_count === 1,
    ).length;

    return {
      data,

      vendor_insights: {
        most_expensive_vendor: mostExpensiveVendor,

        most_efficient_vendor: mostEfficientVendor,

        single_tool_vendors: singleToolVendors,
      },
    };
  }

  // =========================
  // PRIVATE HELPERS
  // =========================

  private roundCurrency(value: number, toFixedBy = 2): number {
    return Number(value.toFixed(toFixedBy));
  }

  private roundPercentage(value: number): number {
    return Number(value.toFixed(1));
  }

  private calculateCostPerUser(totalCost: number, totalUsers: number): number {
    if (totalUsers === 0) {
      return totalCost;
    }

    return totalCost / totalUsers;
  }

  private getEfficiencyRating(
    costPerUser: number,
    averageCostPerUserCompany: number,
  ): 'excellent' | 'good' | 'average' | 'low' {
    if (costPerUser < averageCostPerUserCompany * 0.5) {
      return 'excellent';
    }

    if (costPerUser < averageCostPerUserCompany * 0.8) {
      return 'good';
    }

    if (costPerUser <= averageCostPerUserCompany * 1.2) {
      return 'average';
    }

    return 'low';
  }

  private getWarningLevel(
    costPerUser: number,
    activeUsersCount: number,
  ): 'low' | 'medium' | 'high' {
    if (activeUsersCount === 0) {
      return 'high';
    }

    if (costPerUser < 20) {
      return 'low';
    }

    if (costPerUser <= 50) {
      return 'medium';
    }

    return 'high';
  }

  private getPotentialAction(warningLevel: 'low' | 'medium' | 'high'): string {
    if (warningLevel === 'high') {
      return 'Consider canceling or downgrading';
    }

    if (warningLevel === 'medium') {
      return 'Review usage and consider optimization';
    }

    return 'Monitor usage trends';
  }

  private getVendorEfficiency(
    averageCostPerUser: number,
    totalUsers: number,
  ): 'excellent' | 'good' | 'average' | 'poor' {
    if (totalUsers === 0) {
      return 'poor';
    }

    if (averageCostPerUser < 5) {
      return 'excellent';
    }

    if (averageCostPerUser < 15) {
      return 'good';
    }

    if (averageCostPerUser < 25) {
      return 'average';
    }

    return 'poor';
  }
}
