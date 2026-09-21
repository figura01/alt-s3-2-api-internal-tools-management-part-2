import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { createHash, randomBytes } from 'node:crypto';

import * as argon2 from 'argon2';

import { PrismaService } from '../prisma/prisma.service';

import { UpdateProfileDto } from './dtos/update-profile.dto';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import { Prisma, UserRole } from '@prisma/client';

const userSelect = {
  id: true,
  name: true,
  firstName: true,
  lastName: true,
  email: true,
  department: true,
  role: true,
  status: true,
  hireDate: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await argon2.hash(registerDto.password);

    const department = await this.prisma.department.findUnique({
      where: {
        id: registerDto.departmentId,
      },
    });

    if (!department) {
      throw new BadRequestException('Department not found.');
    }

    const user = await this.prisma.user.create({
      data: {
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        name: `${registerDto.firstName} ${registerDto.lastName}`,
        email: registerDto.email,
        passwordHash,
        departmentId: department.id,
        role: UserRole.EMPLOYEE,
      },
      select: userSelect,
    });

    return this.createSession(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      loginDto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const safeUser = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: userSelect,
    });

    if (!safeUser || safeUser.status !== 'ACTIVE') {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createSession(safeUser);
  }

  private hashRefresh(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private async createSession(user: Prisma.UserGetPayload<{ select: typeof userSelect }>) {
    const refreshToken = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await this.prisma.authSession.create({
      data: { userId: user.id, refreshHash: this.hashRefresh(refreshToken), expiresAt },
    });
    const accessToken = await this.signAccess(user, session.id);
    return { access_token: accessToken, refresh_token: refreshToken, expiresAt, user };
  }

  private signAccess(user: { id: string; email: string; role: UserRole }, sessionId: string) {
    return this.jwtService.signAsync({ sub: user.id, sid: sessionId, email: user.email, role: user.role }, { expiresIn: '15m' });
  }

  async refresh(refreshToken: string | null) {
    if (!refreshToken) throw new UnauthorizedException('Session expired');
    const session = await this.prisma.authSession.findUnique({
      where: { refreshHash: this.hashRefresh(refreshToken) },
      include: { user: { select: userSelect } },
    });
    if (!session || session.revokedAt || session.expiresAt <= new Date() || session.user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Session expired');
    }
    const accessToken = await this.signAccess(session.user, session.id);
    return { access_token: accessToken, user: session.user };
  }

  async logout(refreshToken: string | null, accessToken: string | null) {
    const conditions: Prisma.AuthSessionWhereInput[] = [];
    if (refreshToken) conditions.push({ refreshHash: this.hashRefresh(refreshToken) });
    if (accessToken) {
      try {
        // Signature still checked: expiry must not prevent revoking a session.
        const payload = await this.jwtService.verifyAsync<JwtPayload>(accessToken, { ignoreExpiration: true });
        if (payload.sid && payload.sub) conditions.push({ id: payload.sid, userId: payload.sub });
      } catch { /* An invalid cookie is simply cleared by the controller. */ }
    }
    if (conditions.length) {
      await this.prisma.authSession.updateMany({
        where: { OR: conditions, revokedAt: null }, data: { revokedAt: new Date() },
      });
    }
  }

  async updateProfile(payload: JwtPayload, dto: UpdateProfileDto) {
    await this.me(payload);
    return this.prisma.user.update({
      where: { id: payload.sub },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        name: `${dto.firstName} ${dto.lastName}`,
      },
      select: userSelect,
    });
  }

  async me(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
      select: userSelect,
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Session expired');
    }
    return user;
  }
}
