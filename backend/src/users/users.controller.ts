import { Body, Controller, Get, Param, Patch, Req } from '@nestjs/common';
import type { Request } from 'express';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Roles } from '../auth/roles.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './update-user.dto';

@Controller('users')
@Roles('ADMIN')
export class UsersController {
  constructor(private readonly users: UsersService) {}
  @Get()
  findAll() {
    return this.users.findAll();
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.users.update(id, dto, req.user.sub);
  }
}
