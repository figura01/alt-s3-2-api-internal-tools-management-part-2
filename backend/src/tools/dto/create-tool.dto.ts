import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  Min,
} from 'class-validator';

import { departments } from '../types/tool.enums';

import type { Department } from '../types/tool.enums';

export class CreateToolDto {
  @ApiProperty({
    example: 'Linear',
  })
  @IsString()
  @Length(2, 100)
  name!: string;

  @ApiProperty({
    example: 'Issue tracking and project management',
  })
  @IsString()
  @MaxLength(500)
  description!: string;

  @ApiProperty({
    example: 'Linear',
  })
  @IsString()
  @MaxLength(100)
  vendor!: string;

  @ApiPropertyOptional({
    example: 'https://linear.app',
  })
  @IsOptional()
  @IsUrl()
  website_url?: string;

  @ApiProperty({
    example: '2',
  })
  @IsString()
  category_id!: string;

  @ApiProperty({
    example: 8.0,
  })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @Min(0)
  monthly_cost!: number;

  @ApiProperty({
    enum: departments,
    example: 'Engineering',
  })
  @IsIn(departments)
  owner_department!: Department;
}
