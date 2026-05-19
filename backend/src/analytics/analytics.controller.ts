import { Controller, Get, Query } from '@nestjs/common';

import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AnalyticsService } from './analytics.service';

import { DepartmentCostsQueryDto } from './dto/department-costs-query.dto';
import { ExpensiveToolsQueryDto } from './dto/expensive-tools-query.dto';
import { LowUsageToolsQueryDto } from './dto/low-usage-tools-query.dto';

import type {
  DepartmentCostsResponse,
  ExpensiveToolsResponse,
  LowUsageToolsResponse,
  ToolsByCategoryResponse,
  VendorSummaryResponse,
} from './types/analytics.types';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('department-costs')
  @ApiOperation({
    summary: 'Get department cost analytics',
  })
  @ApiOkResponse({
    description: 'Department analytics retrieved successfully',
  })
  getDepartmentCosts(
    @Query()
    query: DepartmentCostsQueryDto,
  ): Promise<DepartmentCostsResponse> {
    return this.analyticsService.getDepartmentCosts(query);
  }

  @Get('expensive-tools')
  @ApiOperation({
    summary: 'Get most expensive tools analytics',
  })
  @ApiOkResponse({
    description: 'Expensive tools analytics retrieved successfully',
  })
  getExpensiveTools(
    @Query()
    query: ExpensiveToolsQueryDto,
  ): Promise<ExpensiveToolsResponse> {
    return this.analyticsService.getExpensiveTools(query);
  }

  @Get('tools-by-category')
  @ApiOperation({
    summary: 'Get tools analytics by category',
  })
  @ApiOkResponse({
    description: 'Tools by category analytics retrieved successfully',
  })
  getToolsByCategory(): Promise<ToolsByCategoryResponse> {
    return this.analyticsService.getToolsByCategory();
  }

  @Get('low-usage-tools')
  @ApiOperation({
    summary: 'Get low usage tools analytics',
  })
  @ApiOkResponse({
    description: 'Low usage tools analytics retrieved successfully',
  })
  getLowUsageTools(
    @Query()
    query: LowUsageToolsQueryDto,
  ): Promise<LowUsageToolsResponse> {
    return this.analyticsService.getLowUsageTools(query);
  }

  @Get('vendor-summary')
  @ApiOperation({
    summary: 'Get vendor analytics summary',
  })
  @ApiOkResponse({
    description: 'Vendor summary analytics retrieved successfully',
  })
  getVendorSummary(): Promise<VendorSummaryResponse> {
    return this.analyticsService.getVendorSummary();
  }
}
