import { ConfigService } from '@nestjs/config';
import { SESSION_COOKIE } from '../session-cookie';
import { UsersController } from '../../users/users.controller';
import { UsersService } from '../../users/users.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { RolesGuard } from './roles.guard';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { PrismaService } from '../../prisma/prisma.service';
import { ToolsController } from '../../tools/tools.controller';
import { ToolsService } from '../../tools/tools.service';
import { AnalyticsController } from '../../analytics/analytics.controller';
import { AnalyticsService } from '../../analytics/analytics.service';
import { DepartmentsController } from '../../departments/departments.controller';
import { DepartmentsService } from '../../departments/departments.service';
import { CategoriesController } from '../../categories/categories.controller';
import { CategoriesService } from '../../categories/categories.service';

describe('API role permissions', () => {
  let app: INestApplication;
  const prisma = { authSession: { findUnique: jest.fn() }, user: { findUnique: jest.fn() } };
  const jwt = new JwtService({ secret: process.env.JWT_SECRET ?? 'dev-secret' });
  const methods = ['findAll', 'findOne', 'create', 'update', 'remove', 'getAnalytics', 'getSpendHistory', 'getDepartmentCosts', 'getExpensiveTools', 'getToolsByCategory', 'getLowUsageTools', 'getVendorSummary'];
  const service = Object.fromEntries(methods.map((name) => [name, jest.fn().mockResolvedValue({ ok: true })]));
  const routes = [
    ["get", "/users", ["ADMIN"]],
    ["patch", "/users/user-2", ["ADMIN"]],
    ['get', '/tools', ['EMPLOYEE', 'MANAGER', 'ADMIN']],
    ['get', '/tools/tool-1', ['EMPLOYEE', 'MANAGER', 'ADMIN']],
    ['post', '/tools', ['ADMIN']], ['put', '/tools/tool-1', ['ADMIN']], ['delete', '/tools/tool-1', ['ADMIN']],
    ...['', '/spend-history', '/department-costs', '/expensive-tools', '/tools-by-category', '/low-usage-tools', '/vendor-summary'].map((suffix) => ['get', `/analytics${suffix}`, ['MANAGER', 'ADMIN']]),
    ['post', '/categories', ['ADMIN']], ['patch', '/categories/category-1', ['ADMIN']], ['delete', '/categories/category-1', ['ADMIN']],
    ['post', '/departments', ['ADMIN']], ['patch', '/departments/department-1', ['ADMIN']], ['delete', '/departments/department-1', ['ADMIN']],
  ] as [string, string, string[]][];

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule],
      controllers: [UsersController, ToolsController, AnalyticsController, DepartmentsController, CategoriesController],
      providers: [JwtStrategy, { provide: ConfigService, useValue: { getOrThrow: () => process.env.JWT_SECRET ?? 'dev-secret' } }, { provide: APP_GUARD, useClass: RolesGuard }, { provide: PrismaService, useValue: prisma },
        ...[UsersService, ToolsService, AnalyticsService, DepartmentsService, CategoriesService].map((provide) => ({ provide, useValue: service }))],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });
  afterAll(async () => { await app.close(); });
  beforeEach(() => { jest.clearAllMocks(); prisma.authSession.findUnique.mockResolvedValue({ userId: 'user-1', revokedAt: null, expiresAt: new Date(Date.now() + 60000), user: { role: 'ADMIN', status: 'ACTIVE' } }); });

  for (const [method, path, allowed] of routes) {
    it.each(['anonymous', 'EMPLOYEE', 'MANAGER', 'ADMIN'])(`${method} ${path}: %s`, async (role) => {
      prisma.user.findUnique.mockResolvedValue({ role, status: 'ACTIVE' });
      const client = request(app.getHttpServer());
      const call = method === 'post' ? client.post(path) : method === 'put' ? client.put(path) : method === 'patch' ? client.patch(path) : method === 'delete' ? client.delete(path) : client.get(path);
      if (role !== 'anonymous') call.set('Cookie', `${SESSION_COOKIE}=${jwt.sign({ sub: 'user-1', sid: 'session-1', role })}`);
      const status = role === 'anonymous' ? 401 : allowed.includes(role) ? (method === 'post' ? 201 : 200) : 403;
      await call.send({}).expect(status);
      if (status >= 400) for (const mock of Object.values(service)) expect(mock).not.toHaveBeenCalled();
    });
  }
  it('uses the current database role, not an old admin token', async () => {
    prisma.user.findUnique.mockResolvedValue({ role: 'EMPLOYEE', status: 'ACTIVE' });
    await request(app.getHttpServer()).post('/tools').set('Cookie', `${SESSION_COOKIE}=${jwt.sign({ sub: 'user-1', sid: 'session-1', role: 'ADMIN' })}`).send({}).expect(403);
    expect(service.create).not.toHaveBeenCalled();
  });
  it.each([null, { role: 'ADMIN', status: 'INACTIVE' }])('rejects a missing or inactive user: %p', async (user) => {
    prisma.user.findUnique.mockResolvedValue(user);
    await request(app.getHttpServer()).get('/tools').set('Cookie', `${SESSION_COOKIE}=${jwt.sign({ sub: 'user-1', sid: 'session-1', role: 'ADMIN' })}`).expect(401);
  });
  it('rejects an expired token', async () => {
    await request(app.getHttpServer()).get('/tools').set('Cookie', `${SESSION_COOKIE}=${jwt.sign({ sub: 'user-1', sid: 'session-1', role: 'ADMIN' }, { expiresIn: -1 })}`).expect(401);
  });
  it('keeps the department list accessible for registration', async () => {
    await request(app.getHttpServer()).get('/departments').expect(200);
  });
});
