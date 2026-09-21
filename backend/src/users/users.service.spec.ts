import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './update-user.dto';
import { validate } from 'class-validator';

describe('UsersService permissions', () => {
  const admin = { id: 'admin', role: 'ADMIN', status: 'ACTIVE' };
  let tx: {
    $queryRaw: jest.Mock;
    user: { findUnique: jest.Mock; count: jest.Mock; update: jest.Mock };
  };
  let service: UsersService;
  beforeEach(() => {
    tx = {
      $queryRaw: jest.fn().mockResolvedValue([]),
      user: {
        findUnique: jest.fn().mockResolvedValue(admin),
        count: jest.fn().mockResolvedValue(1),
        update: jest.fn().mockResolvedValue(admin),
      },
    };
    service = new UsersService({
      $transaction: (fn: (client: typeof tx) => unknown) => fn(tx),
    } as unknown as PrismaService);
  });
  it.each([{ role: 'EMPLOYEE' }, { status: 'INACTIVE' }] as UpdateUserDto[])(
    'protects the last admin: %j',
    async (dto) => {
      await expect(
        service.update('admin', dto, 'admin'),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(tx.user.update).not.toHaveBeenCalled();
      expect(tx.$queryRaw).toHaveBeenCalled();
    },
  );
  it('allows demotion with another active administrator', async () => {
    tx.user.count.mockResolvedValue(2);
    await service.update('admin', { role: 'MANAGER' }, 'admin');
    expect(tx.user.update).toHaveBeenCalled();
  });
  it('allows an unchanged last administrator', async () => {
    await service.update('admin', { role: 'ADMIN', status: 'ACTIVE' }, 'admin');
    expect(tx.user.update).toHaveBeenCalled();
  });
  it('rechecks the acting administrator after acquiring locks', async () => {
    tx.user.findUnique.mockResolvedValueOnce({ ...admin, status: 'INACTIVE' });
    await expect(
      service.update('target', { role: 'ADMIN' }, 'admin'),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(tx.user.update).not.toHaveBeenCalled();
  });
  it('rejects missing users', async () => {
    tx.user.findUnique.mockResolvedValueOnce(admin).mockResolvedValueOnce(null);
    await expect(service.update('missing', {}, 'admin')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
  it('excludes passwords from the response selection', async () => {
    await service.update('admin', {}, 'admin');
    const args = tx.user.update.mock.calls[0][0] as {
      select: Record<string, unknown>;
    };
    expect(args.select.passwordHash).toBeUndefined();
  });
  it.each([
    { role: null },
    { status: null },
    { role: 'OWNER' },
    { status: 'DELETED' },
  ])('rejects invalid permissions %j', async (values) => {
    expect(
      (await validate(Object.assign(new UpdateUserDto(), values))).length,
    ).toBeGreaterThan(0);
  });
});
