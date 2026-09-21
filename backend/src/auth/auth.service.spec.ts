import * as argon2 from 'argon2';
import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const prisma = {
    user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    authSession: { create: jest.fn() },
    department: { findUnique: jest.fn() },
  };
  const jwt = { signAsync: jest.fn() };


  beforeEach(async () => {
    jest.resetAllMocks();
    prisma.authSession.create.mockResolvedValue({ id: "session-1" });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: JwtService,
          useValue: jwt,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('returns a token and safe profile for valid credentials', async () => {
    const safeUser = { id: 'user-1', name: 'Test', email: 'test@example.com', role: 'EMPLOYEE', status: 'ACTIVE' };
    prisma.user.findUnique
      .mockResolvedValueOnce({ ...safeUser, passwordHash: await argon2.hash('test-password') })
      .mockResolvedValueOnce(safeUser);
    jwt.signAsync.mockResolvedValue('test-token');

    await expect(service.login({ email: safeUser.email, password: 'test-password' }))
      .resolves.toMatchObject({ access_token: 'test-token', user: safeUser, refresh_token: expect.any(String), expiresAt: expect.any(Date) });
    expect(jwt.signAsync).toHaveBeenCalledWith({ sub: safeUser.id, sid: 'session-1', email: safeUser.email, role: safeUser.role }, { expiresIn: '15m' });
    const selection = prisma.user.findUnique.mock.calls[1][0].select;
    expect(selection).not.toHaveProperty('passwordHash');
    expect(selection).toHaveProperty('createdAt', true);
    expect(selection).not.toHaveProperty('created_at');
  });

  it('rejects an incorrect password without issuing a token', async () => {
    prisma.user.findUnique.mockResolvedValue({ status: 'ACTIVE', passwordHash: await argon2.hash('correct-password') });
    await expect(service.login({ email: 'test@example.com', password: 'wrong-password' })).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwt.signAsync).not.toHaveBeenCalled();
  });

  it('restores the current profile from the token subject', async () => {
    const user = { id: 'user-1', name: 'Test', status: 'ACTIVE' };
    prisma.user.findUnique.mockResolvedValue(user);
    await expect(service.me({ sub: 'user-1', email: 'test@example.com', role: 'EMPLOYEE' })).resolves.toEqual(user);
    expect(prisma.user.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'user-1' } }));
  });

  it.each([null, { status: 'INACTIVE' }])('rejects a missing or inactive account: %p', async (user) => {
    prisma.user.findUnique.mockResolvedValue(user);
    await expect(service.me({ sub: 'user-1', email: 'test@example.com', role: 'EMPLOYEE' })).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(service.login({ email: 'test@example.com', password: 'password' })).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwt.signAsync).not.toHaveBeenCalled();
  });

  it('registers an employee with a hashed password and a safe profile', async () => {
    const dto = { firstName: 'Test', lastName: 'Account', email: 'signup@example.com', password: 'Example123!', departmentId: 'cmdepartment1' };
    const profile = { id: 'new-user', name: 'Test Account', email: dto.email, role: 'EMPLOYEE' };
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.department.findUnique.mockResolvedValue({ id: dto.departmentId });
    prisma.user.create.mockResolvedValue(profile);
    jwt.signAsync.mockResolvedValue('new-token');
    await expect(service.register(dto)).resolves.toMatchObject({ access_token: 'new-token', user: profile });
    const args = prisma.user.create.mock.calls[0][0];
    expect(args.data.role).toBe('EMPLOYEE');
    expect(args.data.departmentId).toBe(dto.departmentId);
    expect(args.data.passwordHash).not.toBe(dto.password);
    await expect(argon2.verify(args.data.passwordHash, dto.password)).resolves.toBe(true);
    expect(args.select).not.toHaveProperty('passwordHash');
  });

  it('rejects duplicate emails before creating an account', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'existing' });
    await expect(service.register({ firstName: 'Test', lastName: 'Account', email: 'signup@example.com', password: 'Example123!', departmentId: 'cmdepartment1' })).rejects.toBeInstanceOf(ConflictException);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('rejects an unknown department', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.department.findUnique.mockResolvedValue(null);
    await expect(service.register({ firstName: 'Test', lastName: 'Account', email: 'signup@example.com', password: 'Example123!', departmentId: 'missing' })).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('updates only the authenticated user and returns a safe profile', async () => {
    const payload = { sub: 'user-1', email: 'test@example.com', role: 'EMPLOYEE' as const };
    prisma.user.findUnique.mockResolvedValue({ id: 'user-1', status: 'ACTIVE' });
    const profile = { id: 'user-1', firstName: 'Alice', lastName: 'Martin', name: 'Alice Martin' };
    prisma.user.update.mockResolvedValue(profile);
    await expect(service.updateProfile(payload, { firstName: 'Alice', lastName: 'Martin' })).resolves.toEqual(profile);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { firstName: 'Alice', lastName: 'Martin', name: 'Alice Martin' },
      select: expect.objectContaining({ firstName: true, lastName: true }),
    });
    expect(prisma.user.update.mock.calls[0][0].select).not.toHaveProperty('passwordHash');
  });

  it('does not update an inactive account', async () => {
    prisma.user.findUnique.mockResolvedValue({ status: 'INACTIVE' });
    await expect(service.updateProfile({ sub: 'user-1', email: 'test@example.com', role: 'EMPLOYEE' }, { firstName: 'Alice', lastName: 'Martin' })).rejects.toBeInstanceOf(UnauthorizedException);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

});
