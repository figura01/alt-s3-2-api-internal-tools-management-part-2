import { Controller, Get, Query } from '@nestjs/common';

import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AnalyticsService } from './analytics.service';

import { DepartmentCostsQueryDto } from './dto/department-costs-query.dto';
import { ExpensiveToolsQueryDto } from './dto/expensive-tools-query.dto';

import type {
  DepartmentCostsResponse,
  ToolsByCategoryResponse,
} from './types/analytics.types';
import type { ExpensiveToolsResponse } from './types/analytics.types';

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
}
