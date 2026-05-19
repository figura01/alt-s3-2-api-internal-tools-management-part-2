import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class LowUsageToolsQueryDto {
  @ApiPropertyOptional({
    example: 5,
    default: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  max_users?: number = 5;
}
