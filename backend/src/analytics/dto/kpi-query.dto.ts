import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class KpiQueryDto {
  @ApiPropertyOptional({ enum: ['1m', '3m', '1y'] })
  @IsOptional()
  @IsIn(['1m', '3m', '1y'])
  range?: '1m' | '3m' | '1y';

  @ApiPropertyOptional({ description: 'Exact department name; omit for company scope' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;
}
