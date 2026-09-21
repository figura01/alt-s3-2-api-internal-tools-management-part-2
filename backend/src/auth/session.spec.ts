import { PrismaService } from '../prisma/prisma.service';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import type { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { csrfProtection, SESSION_COOKIE, sessionCookieOptions } from './session-cookie';

describe('Cookie sessions (HTTP)', () => {
  let app: INestApplication;
  const jwt = new JwtService({ secret: 'session-test-secret', signOptions: { expiresIn: '1d' } });
  const user = { id: 'user-1', role: 'ADMIN', status: 'ACTIVE' };
  const service = { login: jest.fn(), register: jest.fn(), me: jest.fn(), logout: jest.fn(), refresh: jest.fn() };
  const token = () => jwt.sign({ sub: user.id, sid: 'session-1', role: user.role });
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: service },
        { provide: ConfigService, useValue: { getOrThrow: () => 'session-test-secret' } },
        { provide: PrismaService, useValue: { authSession: { findUnique: async () => ({ userId: user.id, user, expiresAt: new Date(Date.now() + 60000) }) } } },
        JwtStrategy,
      ],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(csrfProtection('http://localhost:3000'));
    await app.init();
  });
  beforeEach(() => {
    service.login.mockResolvedValue({ access_token: token(), user, refresh_token: 'refresh-secret', expiresAt: new Date(Date.now() + 60000) });
    service.register.mockResolvedValue({ access_token: token(), user, refresh_token: 'refresh-secret', expiresAt: new Date(Date.now() + 60000) });
    service.me.mockResolvedValue(user);
  });
  afterAll(async () => { await app.close(); });
  it.each(['login', 'register'])('sets a cookie without exposing the JWT on %s', async (route) => {
    const response = await request(app.getHttpServer()).post(`/api/auth/${route}`)
      .set('Origin', 'http://localhost:3000').set('X-CSRF-Protection', '1').send({}).expect(201);
    expect(response.body).toEqual({ user });
    const cookie = response.headers['set-cookie'][0] as string;
    for (const flag of [`${SESSION_COOKIE}=`, 'HttpOnly', 'SameSite=Lax', 'Path=/api', 'Expires=']) expect(cookie).toContain(flag);
  });
  it('restores the profile using only the cookie', async () => {
    await request(app.getHttpServer()).get('/api/auth/me')
      .set('Cookie', `${SESSION_COOKIE}=${token()}`).expect(200, user);
  });
  it('rejects missing, malformed, expired, tampered and legacy bearer tokens', async () => {
    for (const value of ['', '%broken', jwt.sign({ sub: user.id }, { expiresIn: -1 }), `${token()}broken`]) {
      await request(app.getHttpServer()).get('/api/auth/me').set('Cookie', `${SESSION_COOKIE}=${value}`).expect(401);
    }
    await request(app.getHttpServer()).get('/api/auth/me').set('Authorization', `Bearer ${token()}`).expect(401);
  });
  it('clears the cookie even without an active session', async () => {
    const response = await request(app.getHttpServer()).post('/api/auth/logout').set('X-CSRF-Protection', '1').expect(201);
    expect(response.headers['set-cookie'][0]).toContain(`${SESSION_COOKIE}=;`);
    expect(response.headers['set-cookie'][0]).toContain('Expires=Thu, 01 Jan 1970');
    expect(response.headers['set-cookie'][0]).toContain('Path=/api');
  });
  it.each(['login', 'register', 'logout', 'refresh'])('rejects CSRF on %s', async (route) => {
    await request(app.getHttpServer()).post(`/api/auth/${route}`).send({}).expect(403);
    await request(app.getHttpServer()).post(`/api/auth/${route}`)
      .set('Origin', 'https://foreign.example').set('X-CSRF-Protection', '1').send({}).expect(403);
  });
  it('uses Secure cookies in production', () => {
    const previous = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = 'production';
      expect(sessionCookieOptions()).toMatchObject({ secure: true, httpOnly: true, sameSite: 'lax' });
    } finally { process.env.NODE_ENV = previous; }
  });
});
