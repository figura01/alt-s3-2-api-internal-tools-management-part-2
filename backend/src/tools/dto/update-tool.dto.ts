// src/tools/dto/update-tool.dto.ts

import { PartialType } from '@nestjs/mapped-types';

import { ToolStatus } from '@prisma/client';

import { IsEnum, IsOptional } from 'class-validator';

import { CreateToolDto } from './create-tool.dto';

export class UpdateToolDto extends PartialType(CreateToolDto) {
  @IsOptional()
  @IsEnum(ToolStatus)
  status?: ToolStatus;
}
