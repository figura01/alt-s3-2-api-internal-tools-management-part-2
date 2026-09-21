import { UpdateProfileDto } from './dtos/update-profile.dto';
import { Controller, Get, Post, Patch, Body, UseGuards, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { REFRESH_COOKIE, extractCookie, extractSessionCookie, clearSessionCookies, setRefreshCookie, setSessionCookie } from './session-cookie';

import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.register(registerDto);
    setSessionCookie(response, result.access_token);
    setRefreshCookie(response, result.refresh_token, result.expiresAt);
    return { user: result.user };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(loginDto);
    setSessionCookie(response, result.access_token);
    setRefreshCookie(response, result.refresh_token, result.expiresAt);
    return { user: result.user };
  }

  @Post('logout')
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    await this.authService.logout(extractCookie(request, REFRESH_COOKIE), extractSessionCookie(request));
    clearSessionCookies(response);
    return { success: true };
  }

  @Post('refresh')
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.refresh(extractCookie(request, REFRESH_COOKIE));
    setSessionCookie(response, result.access_token);
    return { user: result.user };
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Req() req: Request & { user: JwtPayload },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(req.user, dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request & { user: JwtPayload }) {
    return this.authService.me(req.user);
  }
}
