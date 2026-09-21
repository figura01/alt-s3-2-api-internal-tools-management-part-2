import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';
import { ToolsService } from './tools.service';

describe('ToolsService', () => {
  let service: ToolsService;

  const prismaMock = {
    tool: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToolsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ToolsService>(ToolsService);
  });

  it('should return a tool by id', async () => {
    prismaMock.tool.findUnique.mockResolvedValue({
      id: 'tool-1',
      name: 'Slack',
      description: 'Team messaging platform',
      vendor: 'Slack Technologies',
      websiteUrl: 'https://slack.com',
      monthlyCost: 8,
      ownerDepartment: { name: 'Engineering' },
      status: 'ACTIVE',
      activeUsersCount: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: {
        id: 'tool-1',
        name: 'Communication',
      },
      previousMonthCost: null,
      iconUrl: null,
    });

    const result = await service.findOne('tool-1');

    expect(result.id).toBe('tool-1');
    expect(result.name).toBe('Slack');
    expect(result.monthly_cost).toBe(8);
  });

  it('should throw NotFoundException when tool does not exist', async () => {
    prismaMock.tool.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing-tool')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should create a tool using category and department names', async () => {
    prismaMock.tool.create.mockResolvedValue({
      id: 'tool-2',
      name: 'Linear',
      monthlyCost: 8,
      category: { name: 'Productivity' },
      ownerDepartment: { name: 'Engineering' },
      status: 'ACTIVE',
    });

    const result = await service.create({
      name: 'Linear',
      description: 'Issue tracking',
      vendor: 'Linear',
      website_url: 'https://linear.app',
      category: 'Productivity',
      monthly_cost: 8,
      owner_department: 'Engineering',
    });

    expect(prismaMock.tool.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          category: { connect: { name: 'Productivity' } },
          ownerDepartment: { connect: { name: 'Engineering' } },
          monthlyCost: 8,
        }),
      }),
    );
    expect(result).toMatchObject({
      id: 'tool-2',
      category: 'Productivity',
      owner_department: 'Engineering',
      monthly_cost: 8,
    });
  });

  it('should throw NotFoundException when updating unknown tool', async () => {
    prismaMock.tool.findUnique.mockResolvedValue(null);

    await expect(
      service.update('missing-tool', {
        status: 'INACTIVE',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
