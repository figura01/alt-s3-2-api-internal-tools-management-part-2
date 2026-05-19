import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class ExpensiveToolsQueryDto {
  @ApiPropertyOptional({
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 50,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  min_cost?: number;
}
