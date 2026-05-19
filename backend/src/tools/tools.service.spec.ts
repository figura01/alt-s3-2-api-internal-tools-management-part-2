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
      id: 1,
      name: 'Slack',
      description: 'Team messaging platform',
      vendor: 'Slack Technologies',
      websiteUrl: 'https://slack.com',
      monthlyCost: 8,
      ownerDepartment: 'Engineering',
      status: 'active',
      activeUsersCount: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: {
        id: 1,
        name: 'Communication',
      },
      usage_logs: [],
    });

    const result = await service.findOne(1);

    expect(result.id).toBe(1);
    expect(result.name).toBe('Slack');
    expect(result.total_monthly_cost).toBe(200);
  });

  it('should throw NotFoundException when tool does not exist', async () => {
    prismaMock.tool.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should throw NotFoundException when creating with unknown category', async () => {
    prismaMock.category.findUnique.mockResolvedValue(null);

    await expect(
      service.create({
        name: 'Linear',
        description: 'Issue tracking',
        vendor: 'Linear',
        website_url: 'https://linear.app',
        category_id: 999,
        monthly_cost: 8,
        owner_department: 'Engineering',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should throw NotFoundException when updating unknown tool', async () => {
    prismaMock.tool.findUnique.mockResolvedValue(null);

    await expect(
      service.update(999, {
        status: 'deprecated',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
