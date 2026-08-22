import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as argon2 from 'argon2';

import { PrismaService } from '../prisma/prisma.service';

import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserRole } from '@prisma/client';

const userSelect = {
  id: true,
  name: true,
  email: true,
  department: true,
  role: true,
  status: true,
  hire_date: true,
  created_at: true,
  updated_at: true,
};

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
    });

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      access_token: accessToken,
      user,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
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

    if (!safeUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: safeUser.id,
      email: safeUser.email,
      role: safeUser.role,
    });

    return {
      access_token: accessToken,
      user: safeUser,
    };
  }

  async me(payload: JwtPayload) {
    return this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
      select: userSelect,
    });
  }
}
