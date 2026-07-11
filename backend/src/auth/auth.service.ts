import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as argon2 from 'argon2';

import { PrismaService } from '../prisma/prisma.service';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { JwtPayload } from './interfaces/jwt-payload.interface';

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
    const existingUser = await this.prisma.users.findUnique({
      where: {
        email: registerDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await argon2.hash(registerDto.password);

    const user = await this.prisma.users.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password_hash: passwordHash,
        department: registerDto.department,
      },
      select: userSelect,
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
    const user = await this.prisma.users.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(
      user.password_hash,
      loginDto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const safeUser = await this.prisma.users.findUnique({
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
    return this.prisma.users.findUnique({
      where: {
        id: payload.sub,
      },
      select: userSelect,
    });
  }
}
