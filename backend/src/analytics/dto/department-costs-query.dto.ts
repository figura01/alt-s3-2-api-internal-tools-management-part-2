import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

import type { SortOrder } from '../types/analytics.types';

export class DepartmentCostsQueryDto {
  @ApiPropertyOptional({
    example: 'total_cost',
    enum: ['department', 'total_cost', 'tools_count', 'total_users'],
  })
  @IsOptional()
  @IsIn(['department', 'total_cost', 'tools_count', 'total_users'])
  sort_by?: 'department' | 'total_cost' | 'tools_count' | 'total_users';

  @ApiPropertyOptional({
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: SortOrder;
}
