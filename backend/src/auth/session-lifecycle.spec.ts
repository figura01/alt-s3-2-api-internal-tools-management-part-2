import { createHash } from 'node:crypto';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

describe('Session lifecycle', () => {
  const secret = 'lifecycle-test-secret';
  const jwt = new JwtService({ secret });
  const prisma = { authSession: { findUnique: jest.fn(), updateMany: jest.fn() } };
  const service = new AuthService(prisma as unknown as PrismaService, jwt);
  const strategy = new JwtStrategy(new ConfigService({ JWT_SECRET: secret }), prisma as unknown as PrismaService);
  const user = { id: 'u1', email: 'a@example.test', role: 'ADMIN' as const, status: 'ACTIVE' };
  const payload = { sub: 'u1', sid: 's1', email: user.email, role: user.role };
  const active = () => ({ id: 's1', userId: 'u1', expiresAt: new Date(Date.now() + 60000), revokedAt: null, user });
  beforeEach(() => { jest.resetAllMocks(); prisma.authSession.findUnique.mockResolvedValue(active()); });

  it('renews access with a hashed lookup and preserves the session identity', async () => {
    const result = await service.refresh('opaque-secret');
    const claims = jwt.verify(result.access_token);
    expect(claims).toMatchObject(payload);
    expect(claims.exp - claims.iat).toBe(900);
    expect(prisma.authSession.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { refreshHash: createHash('sha256').update('opaque-secret').digest('hex') } }));
    expect(result).not.toHaveProperty('refresh_token');
  });
  it.each([
    null,
    { ...active(), revokedAt: new Date() },
    { ...active(), expiresAt: new Date(0) },
    { ...active(), user: { ...user, status: 'INACTIVE' } },
  ])('rejects refresh and access for invalid sessions: %p', async (session) => {
    prisma.authSession.findUnique.mockResolvedValue(session);
    await expect(service.refresh('opaque-secret')).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(strategy.validate(payload)).rejects.toBeInstanceOf(UnauthorizedException);
  });
  it('rejects legacy tokens, mismatched users and absent refresh cookies', async () => {
    await expect(strategy.validate({ ...payload, sid: undefined })).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(strategy.validate({ ...payload, sub: 'other-user' })).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(service.refresh(null)).rejects.toBeInstanceOf(UnauthorizedException);
  });
  it('revokes the session using a valid signed access token even when expired', async () => {
    await service.logout(null, jwt.sign(payload, { expiresIn: -1 }));
    expect(prisma.authSession.updateMany).toHaveBeenCalledWith({ where: { OR: [{ id: 's1', userId: 'u1' }], revokedAt: null }, data: { revokedAt: expect.any(Date) } });
  });
  it('revokes by refresh secret without an access cookie', async () => {
    await service.logout('opaque-secret', null);
    expect(prisma.authSession.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: { OR: [{ refreshHash: createHash('sha256').update('opaque-secret').digest('hex') }], revokedAt: null } }));
  });
  it('does not trust tampered access tokens for revocation', async () => {
    await service.logout(null, jwt.sign(payload) + 'tampered');
    expect(prisma.authSession.updateMany).not.toHaveBeenCalled();
  });
  it('does not report successful logout when the database is unavailable', async () => {
    prisma.authSession.updateMany.mockRejectedValue(new Error('database unavailable'));
    await expect(service.logout('opaque-secret', null)).rejects.toThrow('database unavailable');
  });
});
