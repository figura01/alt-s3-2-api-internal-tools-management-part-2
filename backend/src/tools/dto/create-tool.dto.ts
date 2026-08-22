// src/tools/dto/create-tool.dto.ts

import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateToolDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  vendor!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsNotEmpty()
  owner_department!: string;

  @Type(() => Number)
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @Min(0)
  monthly_cost!: number;

  @IsOptional()
  @IsUrl({
    require_protocol: true,
  })
  @MaxLength(500)
  website_url?: string;

  @IsOptional()
  @IsUrl({
    require_protocol: true,
  })
  @MaxLength(500)
  icon_url?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  active_users_count?: number;
}
