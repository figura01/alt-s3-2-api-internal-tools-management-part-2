import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './update-user.dto';
import { userSelect } from './selectors/user.selector';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: userSelect,
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });
  }

  update(id: string, dto: UpdateUserDto, actorId: string) {
    return this.prisma.$transaction(async (tx) => {
      // Serialize permission changes so concurrent requests cannot remove both last admins.
      await tx.$queryRaw`SELECT id FROM users ORDER BY id FOR UPDATE`;
      const actor = await tx.user.findUnique({ where: { id: actorId } });
      if (!actor || actor.role !== 'ADMIN' || actor.status !== 'ACTIVE')
        throw new ForbiddenException();
      const user = await tx.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('User not found');
      const removesAdmin =
        user.role === 'ADMIN' &&
        user.status === 'ACTIVE' &&
        ((dto.role !== undefined && dto.role !== 'ADMIN') ||
          dto.status === 'INACTIVE');
      if (
        removesAdmin &&
        (await tx.user.count({ where: { role: 'ADMIN', status: 'ACTIVE' } })) <=
          1
      ) {
        throw new ConflictException(
          'At least one active administrator must remain.',
        );
      }
      return tx.user.update({
        where: { id },
        data: { role: dto.role, status: dto.status },
        select: userSelect,
      });
    });
  }
}
