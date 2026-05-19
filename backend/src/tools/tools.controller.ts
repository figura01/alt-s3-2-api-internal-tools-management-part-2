import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreateToolDto } from './dto/create-tool.dto';
import { QueryToolsDto } from './dto/query-tools.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { ToolsService } from './tools.service';

import type {
  ToolCreateResponse,
  ToolDetailResponse,
  ToolsListResponse,
} from './types/tool.types';

@ApiTags('tools')
@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Get()
  @ApiOperation({
    summary: 'List tools with filters, pagination and sorting',
  })
  @ApiOkResponse({
    description: 'Tools list retrieved successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters',
  })
  findAll(@Query() query: QueryToolsDto): Promise<ToolsListResponse> {
    return this.toolsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get tool details by ID',
  })
  @ApiOkResponse({
    description: 'Tool details retrieved successfully',
  })
  @ApiNotFoundResponse({
    description: 'Tool not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid numeric ID',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ToolDetailResponse> {
    return this.toolsService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new tool',
  })
  @ApiBody({
    type: CreateToolDto,
  })
  @ApiCreatedResponse({
    description: 'Tool created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or duplicated name',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  create(@Body() createToolDto: CreateToolDto): Promise<ToolCreateResponse> {
    return this.toolsService.create(createToolDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an existing tool',
  })
  @ApiBody({
    type: UpdateToolDto,
  })
  @ApiOkResponse({
    description: 'Tool updated successfully',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or invalid ID',
  })
  @ApiNotFoundResponse({
    description: 'Tool or category not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateToolDto: UpdateToolDto,
  ): Promise<ToolCreateResponse> {
    return this.toolsService.update(id, updateToolDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a tool',
  })
  @ApiOkResponse({
    description: 'Tool deleted successfully',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<{ message: string }> {
    return this.toolsService.remove(id);
  }
}
