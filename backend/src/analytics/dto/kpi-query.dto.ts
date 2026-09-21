import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class KpiQueryDto {
  @ApiPropertyOptional({ description: 'Exact department name; omit for company scope' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;
}
