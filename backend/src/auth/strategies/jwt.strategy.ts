import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { extractSessionCookie } from '../session-cookie';

import type { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: extractSessionCookie,
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sid || !payload.sub) throw new UnauthorizedException('Session expired');
    const session = await this.prisma.authSession.findUnique({
      where: { id: payload.sid },
      include: { user: { select: { role: true, status: true } } },
    });
    if (!session || session.userId !== payload.sub || session.revokedAt ||
      session.expiresAt <= new Date() || session.user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Session expired');
    }
    return { ...payload, role: session.user.role };
  }
}
