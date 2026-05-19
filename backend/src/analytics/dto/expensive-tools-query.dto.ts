import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class ExpensiveToolsQueryDto {
  @ApiPropertyOptional({
    type: Number,
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    type: Number,
    example: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  min_cost?: number;
}
