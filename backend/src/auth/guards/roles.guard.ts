import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ROLES_KEY } from '../roles.decorator';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector, private readonly prisma: PrismaService) { super(); }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!roles) return true;
    await super.canActivate(context);
    const request = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    const user = await this.prisma.user.findUnique({ where: { id: request.user.sub }, select: { role: true, status: true } });
    if (!user || user.status !== 'ACTIVE') throw new UnauthorizedException();
    request.user.role = user.role;
    return roles.includes(user.role);
  }
}
