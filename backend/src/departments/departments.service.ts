import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.department.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const department = await this.prisma.department.findUnique({
      where: {
        id,
      },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  create(createDepartmentDto: CreateDepartmentDto) {
    return this.prisma.department.create({
      data: {
        name: createDepartmentDto.name,
        slug: createDepartmentDto.slug,
        description: createDepartmentDto.description,
      },
    });
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    await this.findOne(id);

    return this.prisma.department.update({
      where: {
        id,
      },
      data: {
        ...(updateDepartmentDto.name !== undefined && {
          name: updateDepartmentDto.name,
        }),
        ...(updateDepartmentDto.slug !== undefined && {
          slug: updateDepartmentDto.slug,
        }),
        ...(updateDepartmentDto.description !== undefined && {
          description: updateDepartmentDto.description,
        }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.department.delete({
      where: {
        id,
      },
    });
  }
}
